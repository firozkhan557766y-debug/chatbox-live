// ChatBox Live Real-Time Engine (Complete Version)
let socket = null;

function initLiveChatBox() {
  if (typeof io === "undefined") {
    const s = document.createElement("script");
    s.src = "/socket.io/socket.io.js";
    s.onload = () => initLiveChatBox();
    document.head.appendChild(s);
    return;
  }

  socket = io();
  window.socket = socket;

  const rawUser = localStorage.getItem("chatbox_username") || "guest_user";
  const myUsername = rawUser.startsWith("@") ? rawUser : "@" + rawUser;

  socket.on("connect", () => {
    socket.emit("register_user", myUsername);
  });

  // 1. नया कॉन्टैक्ट ChatBox पर जुड़ने का लाइव नोटिफिकेशन (बिना नंबर दिखाए)
  socket.on("contact_joined", (c) => {
    if (c.username !== myUsername) {
      alert("🎉 Your contact " + c.name + " (" + c.username + ") is now on ChatBox!");
    }
  });

  // 2. नई Follow / Chat Request आने पर सेव करना और अलर्ट देना
  socket.on("receive_request", (data) => {
    let reqs = JSON.parse(localStorage.getItem("chatbox_requests") || "[]");
    if (!reqs.some(r => r.from === data.from)) {
      reqs.unshift({ name: data.name, from: data.from, time: "Just now" });
      localStorage.setItem("chatbox_requests", JSON.stringify(reqs));
    }
    alert("🔔 New Follow Request from " + data.name + " (" + data.from + ")");
    if (typeof renderRequests === "function") renderRequests();
  });

  // 3. सामने वाले दोस्त द्वारा Request Accept करते ही Direct Messages में चैट जोड़ना
  socket.on("request_accepted", (data) => {
    addFriendToDirectMessages(data.name, data.from);
    alert("🎉 " + data.name + " (" + data.from + ") accepted your request! Added to Direct Messages.");
  });

  // 4. लाइव प्राइवेट मैसेज प्राप्त करना
  socket.on("new_message", (data) => {
    const cleanFrom = data.from.startsWith("@") ? data.from : "@" + data.from;
    let hist = JSON.parse(localStorage.getItem("chat_history_" + cleanFrom) || "[]");
    hist.push({ sender: "them", text: data.content, type: data.type || "text", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    localStorage.setItem("chat_history_" + cleanFrom, JSON.stringify(hist));

    // अगर यूजर उसी दोस्त की चैट में है, तो तुरंत स्क्रीन पर दिखाना
    if (typeof appendIncomingMessage === "function") {
      appendIncomingMessage(data);
    } else {
      addFriendToDirectMessages(cleanFrom.replace("@", ""), cleanFrom);
    }
  });

  // 5. नए रियल ग्रुप में जोड़े जाने पर Direct Messages में ग्रुप बनाना
  socket.on("added_to_group", (g) => {
    addFriendToDirectMessages(g.groupName, g.groupId);
    alert("🎉 You were added to group: " + g.groupName);
  });

  // 6. केवल चुने हुए दोस्तों की प्राइवेट स्टोरी प्राप्त करना
  socket.on("new_friend_story", (story) => {
    let fStories = JSON.parse(localStorage.getItem("cb_friend_stories") || "[]");
    fStories = fStories.filter(s => s.owner !== story.owner);
    fStories.unshift(story);
    localStorage.setItem("cb_friend_stories", JSON.stringify(fStories));
    if (typeof renderStories === "function") renderStories();
  });

  // 7. अपनी स्टोरी देखने वाले दोस्त का नाम और समय जोड़ना
  socket.on("add_story_view", (v) => {
    let myStories = JSON.parse(localStorage.getItem("cb_stories") || "[]");
    let target = myStories.find(s => s.id === v.storyId) || myStories[0];
    if (target) {
      if (!target.views) target.views = [];
      if (!target.views.some(x => x.user === v.user)) {
        target.views.push({ name: v.name, user: v.user, time: v.time });
        localStorage.setItem("cb_stories", JSON.stringify(myStories));
      }
    }
  });
  // रिक्वेस्ट भेजने का ग्लोबल फंक्शन
window.sendLiveRequest = function (toUser, myName, myUser) {
  if (socket) {
    socket.emit("send_request", { to: toUser, name: myName, from: myUser });
  }
};

// Direct Messages (#chatContainer) में नया दोस्त या ग्रुप जोड़ने का पक्का सिस्टम
function addFriendToDirectMessages(name, username) {
  const cleanUser = username.startsWith("@") ? username : "@" + username;
  let list = JSON.parse(localStorage.getItem("cb_direct_friends") || "[]");

  if (!list.some(f => f.username.toLowerCase() === cleanUser.toLowerCase())) {
    list.unshift({ name: name, username: cleanUser, time: "Just now" });
    localStorage.setItem("cb_direct_friends", JSON.stringify(list));
  }
  renderDirectFriends();
}

function renderDirectFriends() {
  const box = document.getElementById("chatContainer");
  if (!box) return;

  let list = JSON.parse(localStorage.getItem("cb_direct_friends") || "[]");
  list.forEach(f => {
    const cardId = "cb_df_" + f.username.replace(/[^a-zA-Z0-9]/g, "_");
    if (document.getElementById(cardId)) return;

    const initial = (f.name || "U").charAt(0).toUpperCase();
    const safeName = (f.name || "User").replace(/'/g, "");
    const cardHtml = `
      <div id="${cardId}" class="chat-item" onclick="openChat('${safeName}', '${f.username}')">
        <div class="avatar">${initial}</div>
        <div class="chat-info">
          <div class="chat-top">
            <span class="chat-name">${f.name}</span>
            <span class="chat-time">${f.time || "New"}</span>
          </div>
          <div class="chat-msg">Connected on ChatBox • Tap to message</div>
        </div>
        <span class="badge">New</span>
      </div>
    `;
    const label = box.querySelector(".section-label");
    if (label) label.insertAdjacentHTML("afterend", cardHtml);
    else box.insertAdjacentHTML("afterbegin", cardHtml);
  });
}

// पेज खुलते ही लाइव इंजन और Direct Messages लिस्ट चालू करना
window.addEventListener("DOMContentLoaded", () => {
  initLiveChatBox();
  renderDirectFriends();
});
setInterval(renderDirectFriends, 900);
// पेज खुलते ही और वापस आने पर तुरंत Direct Messages में दोस्त दिखाना
renderDirectFriends();
window.addEventListener("pageshow", renderDirectFriends);


}
