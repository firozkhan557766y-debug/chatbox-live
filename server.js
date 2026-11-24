const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e7 });

app.use(express.json());
app.use((req, res, next) => {
  if (req.method === "GET" && (req.path === "/" || req.path.endsWith(".html"))) {
    const fileName = req.path === "/" ? "index.html" : req.path.slice(1);
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
      let html = fs.readFileSync(filePath, "utf8");
      const injectTags = `\n<script src="/socket.io/socket.io.js"></script>\n<script src="/app_global.js?v=5"></script>\n</body>`;
      html = html.includes("</body>") ? html.replace("</body>", injectTags) : html + injectTags;
      return res.type("html").send(html);
    }
  }
  next();
});

app.use(express.static(path.join(__dirname)));

const DB_FILE = path.join(__dirname, "users.json");
let otpStore = {}; // अस्थायी OTP स्टोर

function loadUsers() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
    return {};
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveUsers(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 1. मोबाइल नंबर पर 6-अंकों का OTP भेजना (Sign Up और Password Reset दोनों के लिए)
app.post("/api/send_otp", (req, res) => {
  const { phone, purpose } = req.body;
  if (!phone || phone.length < 10) return res.json({ ok: false, msg: "Enter valid 10-digit mobile number!" });

  let db = loadUsers();
  const existingUser = Object.keys(db).find(u => db[u].phone === phone);

  if (purpose === "signup" && existingUser) {
    return res.json({ ok: false, msg: "This number is already registered! Please Login." });
  }
  if (purpose === "reset" && !existingUser) {
    return res.json({ ok: false, msg: "No account found with this mobile number!" });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore[phone] = { code: code, expires: Date.now() + 300000 }; // 5 मिनट वैध

  // यदि आपके पास SMS API (जैसे Fast2SMS या Twilio) है तो यहाँ जोड़ सकते हैं; अभी ऐप में लाइव OTP दिखेगा
  console.log("OTP for " + phone + ": " + code);
  res.json({ ok: true, demoOtp: code, username: existingUser || "" });
});

// 2. OTP सत्यापित करके नया अकाउंट बनाना (Sign Up)
// 2. सख्त सर्वर-साइड जाँच के साथ नया अकाउंट बनाना (Sign Up)
app.post("/api/signup", (req, res) => {
  const { name, user, phone, otp, pass } = req.body;

  if (!name || !/^[a-zA-Z\s]{3,25}$/.test(name.trim())) {
    return res.json({ ok: false, msg: "Server Error: Name must be 3-25 letters only!" });
  }
  if (!user || !/^[a-z0-9_]{4,20}$/.test(user)) {
    return res.json({ ok: false, msg: "Server Error: Username must be 4-20 valid characters!" });
  }
  if (!pass || pass.length < 6) {
    return res.json({ ok: false, msg: "Server Error: Password must be at least 6 characters!" });
  }

  let db = loadUsers();
  if (db[user]) return res.json({ ok: false, msg: "This @username is already registered on server!" });
  if (!otpStore[phone] || otpStore[phone].code !== otp) {
    return res.json({ ok: false, msg: "Invalid or Expired OTP!" });
  }

  delete otpStore[phone];
  db[user] = { name: name.trim(), pass, phone, dp: "", blocked: [] };
  saveUsers(db);

  io.emit("contact_joined", { name: name.trim(), username: "@" + user, phone: phone });
  res.json({ ok: true });
});

// 3. केवल लाइव सर्वर डेटाबेस से ही Login करना (100% Real Server Check)
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;
  if (!user || !pass) return res.json({ ok: false, msg: "Enter @username and password!" });

  let db = loadUsers();
  if (!db[user]) {
    return res.json({ ok: false, msg: "Account not found on server! Please Create Account first." });
  }
  if (db[user].pass !== pass) {
    return res.json({ ok: false, msg: "Wrong Password! Access Denied." });
  }

  res.json({ ok: true, name: db[user].name, dp: db[user].dp || "" });
});



// 4. मोबाइल नंबर OTP से नया पासवर्ड सेट करना (Reset Password)
app.post("/api/reset_password", (req, res) => {
  const { phone, otp, newPass } = req.body;
  if (!otpStore[phone] || otpStore[phone].code !== otp) {
    return res.json({ ok: false, msg: "Invalid or Expired OTP!" });
  }

  let db = loadUsers();
  const targetUser = Object.keys(db).find(u => db[u].phone === phone);
  if (!targetUser) return res.json({ ok: false, msg: "User not found!" });

  delete otpStore[phone];
  db[targetUser].pass = newPass;
  saveUsers(db);
  res.json({ ok: true, user: targetUser, name: db[targetUser].name });
});

// 5. ऐप के अंदर किसी भी यूजर की ID ढूँढना (बिना नंबर दिखाए)
app.get("/api/search_users", (req, res) => {
  const q = (req.query.q || "").toLowerCase().replace("@", "").trim();
  let db = loadUsers();
  let results = [];

  Object.keys(db).forEach(u => {
    if (!q || u.includes(q) || db[u].name.toLowerCase().includes(q)) {
      results.push({ name: db[u].name, username: "@" + u, dp: db[u].dp || "" });
    }
  });
  res.json({ ok: true, users: results });
});

// 6. DP अपडेट करना
app.post("/api/update_dp", (req, res) => {
  const { user, dp } = req.body;
  let db = loadUsers();
  if (db[user]) {
    db[user].dp = dp;
    saveUsers(db);
    return res.json({ ok: true });
  }
  res.json({ ok: false });
});

// Socket.io लाइव चैट, रिक्वेस्ट और प्राइवेट स्टेटस
let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("register_user", (username) => {
    onlineUsers[username] = socket.id;
    socket.username = username;
  });

  socket.on("send_request", (data) => {
    const targetSocket = onlineUsers[data.to];
    if (targetSocket) io.to(targetSocket).emit("receive_request", { from: data.from, name: data.name });
  });
  socket.on("accept_request", (data) => {
    const targetSocket = onlineUsers[data.to];
    if (targetSocket) {
      io.to(targetSocket).emit("request_accepted", { from: data.from, name: data.name });
    }
  });







  
    socket.on("webrtc_offer", d => {
    const s = onlineUsers[d.to];
    if (s) {
      io.to(s).emit("webrtc_offer", d);
      socket.emit("webrtc_ringing", { to: d.to });
    }
  });
  socket.on("webrtc_answer", d => { const s = onlineUsers[d.to]; if (s) io.to(s).emit("webrtc_answer", d); });
  socket.on("webrtc_ice", d => { const s = onlineUsers[d.to]; if (s) io.to(s).emit("webrtc_ice", d); });
  socket.on("webrtc_end", d => { const s = onlineUsers[d.to]; if (s) io.to(s).emit("webrtc_end", d); });
  // 2. जब दोस्त चैट खोलकर मैसेज देख ले -> भेजने वाले के सारे टिक रंगीन (Read) कर देना
  socket.on("mark_messages_read", (data) => {
    const senderSocket = onlineUsers[data.to];
    if (senderSocket) {
      io.to(senderSocket).emit("msg_status_update", { from: data.from, status: "read" });
    }
  });

  socket.on("delete_for_everyone", (data) => {
    const targetSocket = onlineUsers[data.to];
    if (targetSocket) io.to(targetSocket).emit("msg_deleted_everyone", { mid: data.mid });
  });

  socket.on("live_react", (data) => {
    const targetSocket = onlineUsers[data.to];
    if (targetSocket) io.to(targetSocket).emit("msg_reacted_live", { mid: data.mid, emoji: data.emoji });
  });

  socket.on("toggle_block_user", (data) => {
    let db = loadUsers();
    const me = data.me.replace("@", "").toLowerCase();
    const target = data.target.replace("@", "").toLowerCase();
    if (db[me]) {
      if (!db[me].blocked) db[me].blocked = [];
      if (data.block) {
        if (!db[me].blocked.includes(target)) db[me].blocked.push(target);
      } else {
        db[me].blocked = db[me].blocked.filter(u => u !== target);
      }
      saveUsers(db);
    }
  });

  socket.on("create_real_group", (data) => {
    const targetSocket = onlineUsers[data.member];
    if (targetSocket) {
      io.to(targetSocket).emit("added_to_group", {
        groupId: data.groupId,
        groupName: data.groupName,
        admin: data.admin
      });
    }
  });

  socket.on("report_user", (data) => {
    const repFile = path.join(__dirname, "reports.json");
    let reps = fs.existsSync(repFile) ? JSON.parse(fs.readFileSync(repFile, "utf8")) : [];
    reps.push({ by: data.by, against: data.against, time: new Date().toISOString() });
    fs.writeFileSync(repFile, JSON.stringify(reps, null, 2));
  });


  socket.on("publish_story", (storyData) => {
    (storyData.allowedUsers || []).forEach(fUser => {
      const targetSocket = onlineUsers["@" + fUser.replace("@", "")];
      if (targetSocket) io.to(targetSocket).emit("new_friend_story", storyData);
    });
  });

  socket.on("story_viewed", (data) => {
    const ownerSocket = onlineUsers[data.owner];
    if (ownerSocket) {
      io.to(ownerSocket).emit("add_story_view", {
        storyId: data.storyId,
        name: data.viewerName,
        user: data.viewerUser,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  });
  socket.on("post_live_story", data => {
    if (!data || !data.story || !Array.isArray(data.allowedFriends)) return;
    data.allowedFriends.forEach(friendUser => {
      const targetSocket = onlineUsers[friendUser];
      if (targetSocket) io.to(targetSocket).emit("new_live_story", data.story);
    });
  });

  socket.on("story_viewed_receipt", d => {
    const ownerSocket = onlineUsers[d.ownerUser];
    if (ownerSocket) io.to(ownerSocket).emit("story_viewed_receipt", d);
  });
  // === LIVE USER REGISTER, SEARCH & JOIN NOTIFICATION ===
  global.liveUsers = global.liveUsers || {};

  socket.on("register_live_user", (user) => {
    if (!user || !user.username) return;
    const uname = user.username.toLowerCase().replace("@", "").trim();
    const isNew = !global.liveUsers[uname];
    global.liveUsers[uname] = {
      name: user.name || uname,
      username: uname,
      phone: user.phone || "",
      socketId: socket.id,
      online: true
    };
    socket.username = uname;

    // सभी यूज़र्स को ताज़ा यूज़र लिस्ट भेजना
    io.emit("all_live_users", Object.values(global.liveUsers));

    // नया दोस्त जुड़ते ही सबको "Joined ChatBox" नोटिफिकेशन भेजना
    if (isNew) {
      socket.broadcast.emit("user_joined_chatbox", {
        name: user.name || uname,
        username: uname
      });
    }
  });

  socket.on("search_live_users", (q) => {
    const query = (q || "").toLowerCase().replace("@", "").trim();
    const matches = Object.values(global.liveUsers || {}).filter(
      (u) => u.username.includes(query) || (u.name || "").toLowerCase().includes(query)
    );
    socket.emit("search_live_results", matches);
  });
    global.offlineMessages = global.offlineMessages || {};

  socket.on("private_message", (data) => {
    if (!data || !data.to) return;
    const toUser = data.to.toLowerCase().replace("@", "").trim();
    const fromUser = (data.from || socket.username || "user").toLowerCase().replace("@", "").trim();
    const payload = {
      id: Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      from: fromUser,
      fromName: data.fromName || fromUser,
      to: toUser,
      text: data.text || "",
      media: data.media || null,
      time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // सर्वर पर भी सेव करना ताकि बैकग्राउंड टैब खुलते ही तुरंत मिले
    global.offlineMessages[toUser] = global.offlineMessages[toUser] || [];
    global.offlineMessages[toUser].push(payload);

    const target = global.liveUsers && global.liveUsers[toUser];
    if (target && target.socketId) {
      io.to(target.socketId).emit("receive_private_message", payload);
    }
  });

  socket.on("sync_my_messages", (username) => {
    const u = (username || "").toLowerCase().replace("@", "").trim();
    const list = (global.offlineMessages && global.offlineMessages[u]) || [];
    if (list.length > 0) {
      socket.emit("bulk_receive_messages", list);
      global.offlineMessages[u] = [];
    }
  });
  
      // === PERSISTENT FOLLOW REQUEST -> ACCEPT -> DIRECT CHAT ===
  global.pendingRequests = global.pendingRequests || {};

  socket.on("send_follow_request", ({ from, fromName, to }) => {
    if (!from || !to) return;
    const a = from.toLowerCase().replace("@", "").trim();
    const b = to.toLowerCase().replace("@", "").trim();
    global.pendingRequests[b] = global.pendingRequests[b] || [];
    if (!global.pendingRequests[b].some((r) => r.from === a)) {
      global.pendingRequests[b].push({ from: a, fromName: fromName || a });
    }
    const target = global.liveUsers && global.liveUsers[b];
    if (target && target.socketId) {
      io.to(target.socketId).emit("incoming_follow_request", { from: a, fromName: fromName || a });
    }
  });

  socket.on("check_pending_requests", (username) => {
    const u = (username || "").toLowerCase().replace("@", "").trim();
    const list = (global.pendingRequests && global.pendingRequests[u]) || [];
    if (list.length > 0) {
      socket.emit("incoming_follow_request", list[list.length - 1]);
    }
  });

  socket.on("accept_follow_request", ({ from, fromName, to }) => {
    if (!from || !to) return;
    const acceptor = from.toLowerCase().replace("@", "").trim();
    const requester = to.toLowerCase().replace("@", "").trim();
    if (global.pendingRequests && global.pendingRequests[acceptor]) {
      global.pendingRequests[acceptor] = global.pendingRequests[acceptor].filter((r) => r.from !== requester);
    }
    const reqTarget = global.liveUsers && global.liveUsers[requester];
    if (reqTarget && reqTarget.socketId) {
      io.to(reqTarget.socketId).emit("follow_request_accepted", { by: acceptor, byName: fromName || acceptor });
    }
  });
  
  socket.on("disconnect", () => {
    if (socket.username) delete onlineUsers[socket.username];
  });
});

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => console.log("ChatBox Live on 3000"));

