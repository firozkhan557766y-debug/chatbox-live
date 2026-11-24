// === HOME SCREEN CHIPS & WIDTH FIX ===
(function () {
  const style = document.createElement("style");
  style.innerHTML = `
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
    }
    /* Groups, Smart AI, Stickers, Games की अंडरलाइन हटाना और एक लाइन में फिट करना */
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
    /* चैट कार्ड्स को पूरी चौड़ाई में बराबर सेट करना */
    .chat-list, .chats, #chatList {
      width: 100% !important;
      padding: 10px 12px !important;
      box-sizing: border-box !important;
    }
    .chat-item, .chat-card, .user-card {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(style);
})();
// === UNIFIED LIVE SEARCH, FOLLOW REQUEST, NOTIFICATION & DIRECT CHAT ===
(function () {
  function startUnifiedLive() {
    if (typeof io === "undefined" && !window.socket) return;
    const sock = window.socket || (window.socket = io());

    // किसी भी चाबी से यूज़र का असली नाम और यूज़रनेम निकालना
    const myName = localStorage.getItem("chatbox_name") || localStorage.getItem("userName") || localStorage.getItem("name") || "User";
    const rawUser = localStorage.getItem("chatbox_username") || localStorage.getItem("userHandle") || localStorage.getItem("username") || myName;
    const myUser = rawUser.toLowerCase().replace(/[^a-z0-9_]/g, "");

    if (myUser) {
      sock.emit("register_live_user", { name: myName, username: myUser });
      sock.emit("check_pending_requests", myUser);
    }

    let acceptedList = JSON.parse(localStorage.getItem("cb_accepted_" + myUser) || "[]");
    let pendingSent = JSON.parse(localStorage.getItem("cb_pending_" + myUser) || "[]");

    // 1. सर्च बार को जोड़ना
    const searchInp = document.querySelector('input[placeholder*="Search"], #searchUser');
    if (searchInp && !searchInp.dataset.boundV2) {
      searchInp.dataset.boundV2 = "1";
      searchInp.addEventListener("input", () => {
        const q = searchInp.value.trim();
        if (q) sock.emit("search_live_users", q);
      });
    }

    // 2. सर्च रिजल्ट में + Follow -> Requested -> Message दिखाना
    sock.off("search_live_results").on("search_live_results", (list) => {
      const sInp = document.querySelector('input[placeholder*="Search"], #searchUser');
      let box = document.getElementById("liveSearchDrop");
      if (!box) {
        box = document.createElement("div");
        box.id = "liveSearchDrop";
        box.style.cssText = "position:fixed;top:145px;left:12px;right:12px;background:#fff;border-radius:14px;box-shadow:0 10px 25px rgba(0,0,0,0.22);z-index:99999;max-height:260px;overflow-y:auto;";
        document.body.appendChild(box);
      }
      const others = (list || []).filter((u) => u.username !== myUser);
      if (!sInp || !sInp.value.trim() || !others.length) {
        box.style.display = "none";
        return;
      }
      box.style.display = "block";
      box.innerHTML = others
        .map((u) => {
          const isAcc = acceptedList.includes(u.username);
          const isPen = pendingSent.includes(u.username);
          let btn = `<button onclick="window.doFollowReq('${u.username}','${u.name}')" style="background:#2563eb;color:#fff;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;">+ Follow</button>`;
          if (isAcc) btn = `<button onclick="localStorage.setItem('active_chat_user','@${u.username}');localStorage.setItem('active_chat_name','${u.name}');location.href='for.html';" style="background:#008069;color:#fff;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;">Message</button>`;
          else if (isPen) btn = `<button disabled style="background:#e2e8f0;color:#475569;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;">Requested ⏳</button>`;
          return `<div style="padding:12px 14px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;color:#0f172a;">
            <div><b>${u.name}</b> <span style="color:#64748b;font-size:12px;">@${u.username}</span></div>
            ${btn}
          </div>`;
        })
        .join("");
    });

    window.doFollowReq = function (toUser, toName) {
      if (!pendingSent.includes(toUser)) {
        pendingSent.push(toUser);
        localStorage.setItem("cb_pending_" + myUser, JSON.stringify(pendingSent));
      }
      sock.emit("send_follow_request", { from: myUser, fromName: myName, to: toUser });
      const sInp = document.querySelector('input[placeholder*="Search"], #searchUser');
      if (sInp) sock.emit("search_live_users", sInp.value.trim());
    };

    // 3. Notification कार्ड दिखाना और Accept दबाते ही सीधे 3rd Screen (for.html) में ले जाना
    sock.off("incoming_follow_request").on("incoming_follow_request", (req) => {
      if (!req || !req.from || req.from === myUser) return;
      const old = document.getElementById("cbFollowReqCard");
      if (old) old.remove();
      const card = document.createElement("div");
      card.id = "cbFollowReqCard";
      card.style.cssText = "position:fixed;top:16px;left:12px;right:12px;background:#ffffff;color:#0f172a;padding:14px 16px;border-radius:18px;box-shadow:0 12px 32px rgba(0,0,0,0.3);z-index:999999;display:flex;align-items:center;justify-content:space-between;gap:10px;border-left:5px solid #008069;";
      card.innerHTML = `
        <div>
          <div style="font-size:11px;color:#008069;font-weight:700;">🔔 New Follow Request</div>
          <div style="font-size:14px;font-weight:700;">${req.fromName} <span style="font-weight:400;color:#64748b;">(@${req.from})</span></div>
        </div>
        <div style="display:flex;gap:6px;">
          <button id="cbAccNow" style="background:#008069;color:#fff;border:none;padding:7px 14px;border-radius:14px;font-size:12.5px;font-weight:700;cursor:pointer;">Accept ✓</button>
          <button onclick="this.closest('#cbFollowReqCard').remove()" style="background:#f1f5f9;color:#475569;border:none;padding:7px 10px;border-radius:14px;font-size:12px;cursor:pointer;">✕</button>
        </div>`;
      document.body.appendChild(card);

      document.getElementById("cbAccNow").onclick = () => {
        if (!acceptedList.includes(req.from)) {
          acceptedList.push(req.from);
          localStorage.setItem("cb_accepted_" + myUser, JSON.stringify(acceptedList));
        }
        sock.emit("accept_follow_request", { from: myUser, fromName: myName, to: req.from });
        localStorage.setItem("active_chat_user", "@" + req.from);
        localStorage.setItem("active_chat_name", req.fromName || req.from);
        location.href = "for.html";
      };
    });

    // 4. सामने वाले के Accept करते ही भेजने वाले को भी सीधे 3rd Screen (for.html) में ले जाना
    sock.off("follow_request_accepted").on("follow_request_accepted", (d) => {
      if (!d || !d.by) return;
      pendingSent = pendingSent.filter((u) => u !== d.by);
      localStorage.setItem("cb_pending_" + myUser, JSON.stringify(pendingSent));
      if (!acceptedList.includes(d.by)) {
        acceptedList.push(d.by);
        localStorage.setItem("cb_accepted_" + myUser, JSON.stringify(acceptedList));
      }
      localStorage.setItem("active_chat_user", "@" + d.by);
      localStorage.setItem("active_chat_name", d.byName || d.by);
      location.href = "for.html";
    });
  }

  setTimeout(startUnifiedLive, 600);
  setInterval(startUnifiedLive, 3000);
})();
     // === AUTO-CREATE & UPDATE REAL CHAT CARDS ON HOME SCREEN ===
(function () {
  function upsertHomeChatCard(username, displayName, lastText, timeStr, unread) {
    const listBox = document.querySelector("#chatList, .chat-list, .chats");
    if (!listBox) return;

    const cleanUser = (username || "").toLowerCase().replace("@", "").trim();
    if (!cleanUser) return;
    const name = displayName || cleanUser;
    const initial = name.charAt(0).toUpperCase();
    const cardId = "live_card_" + cleanUser;

    // सेव करना ताकि पेज रिफ्रेश करने पर भी कार्ड बना रहे
    const myUser = (localStorage.getItem("chatbox_username") || localStorage.getItem("userHandle") || "user").toLowerCase().replace(/[^a-z0-9_]/g, "");
    const savedKey = "cb_home_cards_" + myUser;
    const savedCards = JSON.parse(localStorage.getItem(savedKey) || "{}");
    savedCards[cleanUser] = { username: cleanUser, name, lastText, timeStr, ts: Date.now() };
    localStorage.setItem(savedKey, JSON.stringify(savedCards));

    let card = document.getElementById(cardId);
    if (!card) {
      card = document.createElement("div");
      card.id = cardId;
      card.className = "chat-item chat-card";
      card.style.cssText = "display:flex;align-items:center;justify-content:space-between;background:#111418;padding:14px;border-radius:10px;margin-bottom:10px;cursor:pointer;border:1px solid rgba(255,255,255,0.06);";
      listBox.prepend(card);
    } else {
      listBox.prepend(card); // नया मैसेज आने पर सबसे ऊपर लाना
    }

    card.onclick = () => {
      localStorage.setItem("active_chat_user", "@" + cleanUser);
      localStorage.setItem("active_chat_name", name);
      location.href = "for.html";
    };

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
        <div style="width:46px;height:46px;border-radius:50%;background:#0095f6;color:#fff;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${initial}</div>
        <div style="min-width:0;flex:1;">
          <div style="font-weight:700;font-size:15px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
          <div style="font-size:13px;color:${unread ? "#25d366" : "#94a3b8"};font-weight:${unread ? "600" : "400"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${lastText || "Tap to start chatting"}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;margin-left:8px;">
        <span style="font-size:11px;color:#94a3b8;">${timeStr || ""}</span>
        ${unread ? `<span style="background:#25d366;color:#000;font-size:10px;font-weight:800;padding:2px 7px;border-radius:10px;">NEW</span>` : ""}
      </div>`;
  }

  // 1. पहले से सेव किए गए सभी असली दोस्तों के कार्ड लोड करना
  function loadSavedHomeCards() {
    const myUser = (localStorage.getItem("chatbox_username") || localStorage.getItem("userHandle") || "user").toLowerCase().replace(/[^a-z0-9_]/g, "");
    const savedCards = JSON.parse(localStorage.getItem("cb_home_cards_" + myUser) || "{}");
    Object.values(savedCards)
      .sort((a, b) => (a.ts || 0) - (b.ts || 0))
      .forEach((c) => upsertHomeChatCard(c.username, c.name, c.lastText, c.timeStr, false));
  }

  // 2. लाइव मैसेज आते ही या रिक्वेस्ट स्वीकार होते ही होम स्क्रीन पर कार्ड बनाना/अपडेट करना
  function bindHomeCardEvents() {
    if (!window.socket) return;
    window.socket.on("receive_private_message", (msg) => {
      if (!msg || !msg.from) return;
      upsertHomeChatCard(msg.from, msg.fromName || msg.from, msg.text, msg.time, true);
    });
    window.socket.on("follow_request_accepted", (d) => {
      if (!d || !d.by) return;
      upsertHomeChatCard(d.by, d.byName || d.by, "Tap to start chatting", "Now", false);
    });
  }

  setTimeout(() => { loadSavedHomeCards(); bindHomeCardEvents(); }, 1000);
})();

// === BULLETPROOF LIVE & SYNC MESSAGE RECEIVER + HOME CARD ===
(function () {
  const seenMsgIds = new Set();

  function handleIncomingMsg(msg) {
    if (!msg || !msg.from) return;
    if (msg.id && seenMsgIds.has(msg.id)) return;
    if (msg.id) seenMsgIds.add(msg.id);

    const myName = localStorage.getItem("chatbox_name") || localStorage.getItem("userName") || "User";
    const myUser = (localStorage.getItem("chatbox_username") || localStorage.getItem("userHandle") || myName).toLowerCase().replace(/[^a-z0-9_]/g, "");
    const sender = msg.from.toLowerCase().replace("@", "").trim();
    if (sender === myUser) return;

    const activeChat = (localStorage.getItem("active_chat_user") || "").toLowerCase().replace("@", "").trim();

    // 1. चैट हिस्ट्री सेव करना
    const histKey = "cb_chat_hist_" + myUser + "_" + sender;
    const hist = JSON.parse(localStorage.getItem(histKey) || "[]");
    hist.push({ side: "in", text: msg.text, media: msg.media || null, time: msg.time });
    localStorage.setItem(histKey, JSON.stringify(hist));

    // 2. होम स्क्रीन के लिए कार्ड सेव करना
    const savedKey = "cb_home_cards_" + myUser;
    const savedCards = JSON.parse(localStorage.getItem(savedKey) || "{}");
    savedCards[sender] = { username: sender, name: msg.fromName || sender, lastText: msg.text, timeStr: msg.time, ts: Date.now() };
    localStorage.setItem(savedKey, JSON.stringify(savedCards));

    // 3. अगर चैट स्क्रीन (for.html) खुली है तो तुरंत बबल जोड़ना, वरना होम स्क्रीन पर कार्ड व नोटिफिकेशन दिखाना
    if (window.location.pathname.includes("for.html") && activeChat === sender) {
      const area = document.querySelector("#chatArea, .chat-area, .chat");
      if (area) {
        const b = document.createElement("div");
        b.className = "msg in";
        b.style.cssText = "align-self:flex-start;background:var(--card-bg,#ffffff);color:var(--text-main,#111827);padding:7px 11px;border-radius:14px 14px 14px 4px;max-width:78%;margin:4px 0;font-size:14.5px;box-shadow:0 1px 2px rgba(0,0,0,0.14);";
        b.innerHTML = msg.media
          ? `<img src="${msg.media}" style="max-width:200px;border-radius:10px;display:block;"><div style="font-size:10px;opacity:0.7;margin-top:3px;">${msg.time}</div>`
          : `${msg.text} <span style="font-size:10px;opacity:0.65;margin-left:6px;">${msg.time}</span>`;
        area.appendChild(b);
        area.scrollTop = area.scrollHeight;
      }
    } else {
      const pop = document.createElement("div");
      pop.style.cssText = "position:fixed;top:16px;left:12px;right:12px;background:#008069;color:#fff;padding:12px 16px;border-radius:16px;font-size:13.5px;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,0.3);cursor:pointer;";
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

  function keepSyncing() {
    if (!window.socket) return;
    const sock = window.socket;
    const myName = localStorage.getItem("chatbox_name") || localStorage.getItem("userName") || "User";
    const myUser = (localStorage.getItem("chatbox_username") || localStorage.getItem("userHandle") || myName).toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!myUser) return;

    sock.emit("register_live_user", { name: myName, username: myUser });
    sock.emit("sync_my_messages", myUser);

    if (!sock.datasetBoundV3) {
      sock.datasetBoundV3 = "1";
      sock.on("receive_private_message", handleIncomingMsg);
      sock.on("bulk_receive_messages", (arr) => (arr || []).forEach(handleIncomingMsg));
    }
  }

  setInterval(keepSyncing, 1500);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) keepSyncing(); });
})();
