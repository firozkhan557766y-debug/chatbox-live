// =========================================================================
// CHATBOX COMPLETE GLOBAL ENGINE (UI FIX + LIVE SEARCH + FOLLOW + 2-PHONE CHAT)
// =========================================================================

// 1. HOME SCREEN WIDTH, CHIPS & UNDERLINE FIX
(function () {
  const st = document.createElement("style");
  st.innerHTML = `
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
    }
    a, a:hover, a:focus, a:active, button {
      text-decoration: none !important;
    }
    .chips, .top-chips, .quick-tabs, .nav-pills, .feature-row {
      display: flex !important;
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      scrollbar-width: none !important;
      gap: 6px !important;
      padding-right: 12px !important;
    }
    .chips::-webkit-scrollbar, .top-chips::-webkit-scrollbar {
      display: none !important;
    }
  `;
  document.head.appendChild(st);
})();

// 2. MAIN LIVE DIRECTORY, FOLLOW REQUESTS, HOME CARDS & REAL-TIME SYNC
(function () {
  const seenMsgIds = new Set();

  function getMe() {
    const name =
      localStorage.getItem("chatbox_name") ||
      localStorage.getItem("userName") ||
      localStorage.getItem("name") ||
      "User";
    const raw =
      localStorage.getItem("chatbox_username") ||
      localStorage.getItem("userHandle") ||
      localStorage.getItem("username") ||
      name;
    const user = raw.toLowerCase().replace(/[^a-z0-9_]/g, "");
    return { name, user };
  }

  function saveHomeCard(myUser, peerUser, peerName, lastText, timeStr) {
    if (!myUser || !peerUser || myUser === peerUser) return;
    const key = "cb_home_cards_" + myUser;
    const map = JSON.parse(localStorage.getItem(key) || "{}");
    map[peerUser] = {
      username: peerUser,
      name: peerName || peerUser,
      lastText: lastText || "Tap to chat",
      timeStr: timeStr || "Now",
      ts: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(map));
  }

  // होम स्क्रीन पर Neha Sharma के ठीक ऊपर नए दोस्तों के कार्ड लॉक रखना
    // होम स्क्रीन / Direct Message लिस्ट के ऊपर अलग शांत बॉक्स में कार्ड लॉक रखना (0% Flicker)
  function keepFriendCardsAlive() {
    if (window.location.pathname.includes("for.html")) return;

    const allDivs = Array.from(document.querySelectorAll("div"));
    const nehaTitle = allDivs.find(
      (el) => el.children.length === 0 && (el.innerText || "").trim() === "Neha Sharma"
    );
    if (!nehaTitle) return;

    let nehaCard = nehaTitle.parentElement;
    while (nehaCard && nehaCard.parentElement && nehaCard.offsetHeight < 55) {
      nehaCard = nehaCard.parentElement;
    }
    const listContainer = nehaCard ? nehaCard.parentElement : null;
    if (!listContainer || !listContainer.parentElement) return;

    // पुराने झप-झप करने वाले कंटेनर से बाहर एक अलग शांत बॉक्स बनाना
    let safeWrap = document.getElementById("cbLockedFriendsWrap");
    if (!safeWrap) {
      safeWrap = document.createElement("div");
      safeWrap.id = "cbLockedFriendsWrap";
      safeWrap.style.cssText = "width:100%;display:flex;flex-direction:column;";
      listContainer.parentElement.insertBefore(safeWrap, listContainer);
    }

    const { user: myUser } = getMe();
    const saved = JSON.parse(localStorage.getItem("cb_home_cards_" + myUser) || "{}");
    const list = Object.values(saved);
    const sig = JSON.stringify(list);
    if (safeWrap.dataset.sig === sig) return; // केवल नया डेटा आने पर ही अपडेट होगा (0% झप-झप!)
    safeWrap.dataset.sig = sig;

    safeWrap.innerHTML = "";
    list.forEach((c) => {
      if (!c || !c.username) return;
      const card = document.createElement("div");
      card.style.cssText =
        "display:flex;align-items:center;justify-content:space-between;background:#ffffff;padding:14px 16px;border-radius:14px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,0.06);cursor:pointer;";
      card.onclick = () => {
        localStorage.setItem("active_chat_user", "@" + c.username);
        localStorage.setItem("active_chat_name", c.name);
        location.href = "for.html";
      };
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
          <div style="width:46px;height:46px;border-radius:50%;background:#0095f6;color:#fff;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${(c.name || "U").charAt(0).toUpperCase()}</div>
          <div style="min-width:0;flex:1;">
            <div style="font-weight:700;font-size:15.5px;color:#0f172a;">${c.name}</div>
            <div style="font-size:13px;color:#008069;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">✓✓ ${c.lastText}</div>
          </div>
        </div>
        <div style="font-size:11.5px;color:#64748b;margin-left:8px;">${c.timeStr}</div>`;
      safeWrap.appendChild(card);
    });
    }
  
    function runMainEngine() {
    keepFriendCardsAlive();
    if (typeof io === "undefined" && !window.socket) return;
    const sock = window.socket || (window.socket = io());
    const { name: myName, user: myUser } = getMe();
    if (!myUser) return;

    // सर्वर से लाइव रजिस्टर, पेंडिंग रिक्वेस्ट और अनरीड मैसेज सिंक करना
    sock.emit("register_live_user", { name: myName, username: myUser });
    sock.emit("check_pending_requests", myUser);
    sock.emit("sync_my_messages", myUser);

    // सर्च बार को जोड़ना
    const searchInp = document.querySelector('input[placeholder*="Search"], #searchUser');
    if (searchInp && !searchInp.dataset.liveReady) {
      searchInp.dataset.liveReady = "1";
      searchInp.addEventListener("input", () => {
        const q = searchInp.value.trim();
        if (q) sock.emit("search_live_users", q);
        else {
          const b = document.getElementById("liveSearchDrop");
          if (b) b.style.display = "none";
        }
      });
    }

    if (sock._cleanEngineBound) return;
    sock._cleanEngineBound = true;

    // नया यूज़र जुड़ने पर अलर्ट दिखाना
    sock.on("user_joined_chatbox", (u) => {
      if (!u || u.username === myUser) return;
      const toast = document.createElement("div");
      toast.style.cssText =
        "position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#008069;color:#fff;padding:10px 18px;border-radius:24px;font-size:13px;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,0.25);z-index:999999;";
      toast.innerText = `🎉 ${u.name} (@${u.username}) joined ChatBox!`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    });

    // सर्च रिजल्ट में + Follow -> Requested -> Message दिखाना
    sock.on("search_live_results", (list) => {
      const sInp = document.querySelector('input[placeholder*="Search"], #searchUser');
      let box = document.getElementById("liveSearchDrop");
      if (!box) {
        box = document.createElement("div");
        box.id = "liveSearchDrop";
        box.style.cssText =
          "position:fixed;top:145px;left:12px;right:12px;background:#fff;border-radius:14px;box-shadow:0 10px 25px rgba(0,0,0,0.22);z-index:99999;max-height:260px;overflow-y:auto;";
        document.body.appendChild(box);
      }
      const others = (list || []).filter((u) => u.username !== myUser);
      if (!sInp || !sInp.value.trim() || !others.length) {
        box.style.display = "none";
        return;
      }
      const accepted = JSON.parse(localStorage.getItem("cb_accepted_" + myUser) || "[]");
      const pending = JSON.parse(localStorage.getItem("cb_pending_" + myUser) || "[]");

      box.style.display = "block";
      box.innerHTML = others
        .map((u) => {
          const isAcc = accepted.includes(u.username);
          const isPen = pending.includes(u.username);
          let btn = `<button onclick="window.doFollowReq('${u.username}','${u.name}')" style="background:#2563eb;color:#fff;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;">+ Follow</button>`;
          if (isAcc)
            btn = `<button onclick="localStorage.setItem('active_chat_user','@${u.username}');localStorage.setItem('active_chat_name','${u.name}');location.href='for.html';" style="background:#008069;color:#fff;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;">Message</button>`;
          else if (isPen)
            btn = `<button disabled style="background:#e2e8f0;color:#475569;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;">Requested ⏳</button>`;
          return `<div style="padding:12px 14px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;color:#0f172a;"><div><b>${u.name}</b> <span style="color:#64748b;font-size:12px;">@${u.username}</span></div>${btn}</div>`;
        })
        .join("");
    });

    window.doFollowReq = function (toUser) {
      const { name: mName, user: mUser } = getMe();
      const pen = JSON.parse(localStorage.getItem("cb_pending_" + mUser) || "[]");
      if (!pen.includes(toUser)) {
        pen.push(toUser);
        localStorage.setItem("cb_pending_" + mUser, JSON.stringify(pen));
      }
      sock.emit("send_follow_request", { from: mUser, fromName: mName, to: toUser });
      const sInp = document.querySelector('input[placeholder*="Search"], #searchUser');
      if (sInp) sock.emit("search_live_users", sInp.value.trim());
    };

    // इनकमिंग Follow Request कार्ड और Accept -> Direct Chat (for.html)
    sock.on("incoming_follow_request", (req) => {
      if (!req || !req.from || req.from === myUser) return;
      if (document.getElementById("cbFollowReqCard")) return;
      const card = document.createElement("div");
      card.id = "cbFollowReqCard";
      card.style.cssText =
        "position:fixed;top:16px;left:12px;right:12px;background:#ffffff;color:#0f172a;padding:14px 16px;border-radius:18px;box-shadow:0 12px 32px rgba(0,0,0,0.3);z-index:999999;display:flex;align-items:center;justify-content:space-between;gap:10px;border-left:5px solid #008069;";
      card.innerHTML = `<div><div style="font-size:11px;color:#008069;font-weight:700;">🔔 New Follow Request</div><div style="font-size:14px;font-weight:700;">${req.fromName} (@${req.from})</div></div><div style="display:flex;gap:6px;"><button id="cbAccNow" style="background:#008069;color:#fff;border:none;padding:7px 14px;border-radius:14px;font-size:12.5px;font-weight:700;cursor:pointer;">Accept ✓</button><button onclick="this.closest('#cbFollowReqCard').remove()" style="background:#f1f5f9;color:#475569;border:none;padding:7px 10px;border-radius:14px;font-size:12px;">✕</button></div>`;
      document.body.appendChild(card);

      document.getElementById("cbAccNow").onclick = () => {
        const acc = JSON.parse(localStorage.getItem("cb_accepted_" + myUser) || "[]");
        if (!acc.includes(req.from)) {
          acc.push(req.from);
          localStorage.setItem("cb_accepted_" + myUser, JSON.stringify(acc));
        }
        saveHomeCard(myUser, req.from, req.fromName, "Tap to chat", "Now");
        sock.emit("accept_follow_request", { from: myUser, fromName: myName, to: req.from });
        localStorage.setItem("active_chat_user", "@" + req.from);
        localStorage.setItem("active_chat_name", req.fromName || req.from);
        location.href = "for.html";
      };
    });

    sock.on("follow_request_accepted", (d) => {
      if (!d || !d.by) return;
      const pen = JSON.parse(localStorage.getItem("cb_pending_" + myUser) || "[]").filter(
        (u) => u !== d.by
      );
      localStorage.setItem("cb_pending_" + myUser, JSON.stringify(pen));
      const acc = JSON.parse(localStorage.getItem("cb_accepted_" + myUser) || "[]");
      if (!acc.includes(d.by)) {
        acc.push(d.by);
        localStorage.setItem("cb_accepted_" + myUser, JSON.stringify(acc));
      }
      saveHomeCard(myUser, d.by, d.byName, "Tap to chat", "Now");
      localStorage.setItem("active_chat_user", "@" + d.by);
      localStorage.setItem("active_chat_name", d.byName || d.by);
      location.href = "for.html";
    });

    // इनकमिंग लाइव मैसेज को सेव करना, होम कार्ड अपडेट करना और नोटिफिकेशन दिखाना
    function onMsgIn(msg) {
      if (!msg || !msg.from) return;
      if (msg.id && seenMsgIds.has(msg.id)) return;
      if (msg.id) seenMsgIds.add(msg.id);
      const sender = msg.from.toLowerCase().replace("@", "").trim();
      if (sender === myUser) return;

      saveHomeCard(myUser, sender, msg.fromName || sender, msg.text, msg.time);
      const k = "cb_final_msgs_" + sender;
      const arr = JSON.parse(localStorage.getItem(k) || "[]");
      arr.push({ side: "in", text: msg.text, time: msg.time });
      localStorage.setItem(k, JSON.stringify(arr));

      const activeChat = (localStorage.getItem("active_chat_user") || "")
        .toLowerCase()
        .replace("@", "")
        .trim();
      if (!window.location.pathname.includes("for.html") || activeChat !== sender) {
        const pop = document.createElement("div");
        pop.style.cssText =
          "position:fixed;top:16px;left:12px;right:12px;background:#008069;color:#fff;padding:12px 16px;border-radius:16px;font-size:13.5px;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,0.3);cursor:pointer;";
        pop.innerHTML = `💬 <b>${msg.fromName || sender}:</b> ${msg.text}`;
        pop.onclick = () => {
          localStorage.setItem("active_chat_user", "@" + sender);
          localStorage.setItem("active_chat_name", msg.fromName || sender);
          location.href = "for.html";
        };
        document.body.appendChild(pop);
        setTimeout(() => pop.remove(), 4500);
      }
    }

    sock.on("receive_private_message", onMsgIn);
    sock.on("bulk_receive_messages", (arr) => (arr || []).forEach(onMsgIn));
  }

  setInterval(runMainEngine, 300);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) runMainEngine();
  });
})();
    // === DIRECT DATABASE API SEARCH (NEVER EMPTY AFTER DEPLOY) ===
// === LIVE SOCKET SEARCH (INSTANTLY FINDS ALL REGISTERED USERS) ===
setInterval(() => {
  const sInp = document.querySelector('input[placeholder*="Search"], #searchUser');
  if (sInp && !sInp.dataset.sockSearchReady) {
    sInp.dataset.sockSearchReady = "1";
    sInp.addEventListener("input", () => {
      const q = sInp.value.trim();
      if (q && window.socket) window.socket.emit("search_live_users", q);
      else {
        const b = document.getElementById("liveSearchDrop");
        if (b) b.style.display = "none";
      }
    });
  }
}, 500);

// === STOP HOME SCREEN CARD FLICKER ===
// === STOP HOME SCREEN CARD FLICKER + AUTO REGISTER NEW USERS ===
(function () {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const highest = setInterval(() => {}, 99999);
      for (let i = 1; i < highest; i++) {
        clearInterval(i);
      }

      // हर 2 सेकंड में अपना अकाउंट रजिस्टर + रिक्वेस्ट व मैसेज सिंक रखना
      setInterval(() => {
        if (typeof io !== "undefined") {
          const sock = window.socket || (window.socket = io());
          const myName =
            localStorage.getItem("chatbox_name") ||
            localStorage.getItem("userName") ||
            localStorage.getItem("name") ||
            "User";
          const raw =
            localStorage.getItem("chatbox_username") ||
            localStorage.getItem("userHandle") ||
            localStorage.getItem("username") ||
            myName;
          const me = raw.toLowerCase().replace(/[^a-z0-9_]/g, "");

          if (me) {
            sock.emit("register_live_user", { name: myName, username: me });
            sock.emit("check_pending_requests", me);
            sock.emit("sync_my_messages", me);
          }
        }
      }, 2000);
    }, 1200);
  });
})();
