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
// === AUTO LIVE SYNC, SEARCH & JOIN NOTIFICATION ===
(function () {
  function connectLiveDirectory() {
    if (typeof io === "undefined" && !window.socket) return;
    const sock = window.socket || (window.socket = io());

    // 1. अपना अकाउंट लाइव सर्वर पर रजिस्टर करना
    const myName = localStorage.getItem("chatbox_name") || localStorage.getItem("userName") || "Firoz";
    const myUser = (localStorage.getItem("chatbox_username") || localStorage.getItem("userHandle") || myName).toLowerCase().replace(/[^a-z0-9_]/g, "");
    const myPhone = localStorage.getItem("chatbox_phone") || "";

    if (myUser) {
      sock.emit("register_live_user", { name: myName, username: myUser, phone: myPhone });
    }

    // 2. दोस्त के ऐप जॉइन करते ही लाइव नोटिफिकेशन और लिस्ट में जोड़ना
    sock.off("user_joined_chatbox").on("user_joined_chatbox", (u) => {
      if (!u || u.username === myUser) return;
      const toast = document.createElement("div");
      toast.style.cssText = "position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#008069;color:#fff;padding:10px 18px;border-radius:24px;font-size:13.5px;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,0.25);z-index:999999;";
      toast.innerText = `🎉 ${u.name} (@${u.username}) joined ChatBox!`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4500);
    });

    // 3. सर्च बार को लाइव सर्वर से जोड़ना ताकि किसी भी फोन की ID तुरंत दिखे
    const searchInp = document.querySelector('input[placeholder*="Search"], #searchUser');
    if (searchInp && !searchInp.dataset.liveSearchBound) {
      searchInp.dataset.liveSearchBound = "1";
      searchInp.addEventListener("input", () => {
        const val = searchInp.value.trim();
        if (val.length > 0) sock.emit("search_live_users", val);
      });

      sock.off("search_live_results").on("search_live_results", (list) => {
        let resBox = document.getElementById("liveSearchDrop");
        if (!resBox) {
          resBox = document.createElement("div");
          resBox.id = "liveSearchDrop";
          resBox.style.cssText = "position:fixed;top:145px;left:12px;right:12px;background:#fff;border-radius:14px;box-shadow:0 10px 25px rgba(0,0,0,0.2);z-index:99999;max-height:260px;overflow-y:auto;";
          document.body.appendChild(resBox);
        }
        if (!searchInp.value.trim() || !list.length) {
          resBox.style.display = "none";
          return;
        }
        resBox.style.display = "block";
        resBox.innerHTML = list
          .filter((u) => u.username !== myUser)
          .map(
            (u) => `<div onclick="localStorage.setItem('active_chat_user','@${u.username}');localStorage.setItem('active_chat_name','${u.name}');location.href='for.html';" style="padding:12px 14px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
              <div><b>${u.name}</b> <span style="color:#64748b;font-size:12px;">@${u.username}</span></div>
              <span style="background:#008069;color:#fff;padding:4px 12px;border-radius:14px;font-size:12px;">Chat</span>
            </div>`
          )
          .join("");
      });
    }
  }

  setTimeout(connectLiveDirectory, 800);
  setInterval(connectLiveDirectory, 4000);
})();
// === FOLLOW REQUEST -> NOTIFICATION ACCEPT -> DIRECT CHAT (for.html) ===
(function () {
  function setupRequestAcceptFlow() {
    if (!window.socket) return;
    const sock = window.socket;
    const myName = localStorage.getItem("chatbox_name") || localStorage.getItem("userName") || "User";
    const myUser = (localStorage.getItem("chatbox_username") || localStorage.getItem("userHandle") || myName).toLowerCase().replace(/[^a-z0-9_]/g, "");

    let acceptedList = JSON.parse(localStorage.getItem("cb_accepted_" + myUser) || "[]");
    let pendingSent = JSON.parse(localStorage.getItem("cb_pending_" + myUser) || "[]");
    let incomingReqs = JSON.parse(localStorage.getItem("cb_incoming_reqs_" + myUser) || "[]");

    // 1. सर्च में + Follow -> Requested -> Message स्टेट दिखाना
    sock.off("search_live_results").on("search_live_results", (list) => {
      const searchInp = document.querySelector('input[placeholder*="Search"], #searchUser');
      let resBox = document.getElementById("liveSearchDrop");
      if (!resBox) {
        resBox = document.createElement("div");
        resBox.id = "liveSearchDrop";
        resBox.style.cssText = "position:fixed;top:145px;left:12px;right:12px;background:#fff;border-radius:14px;box-shadow:0 10px 25px rgba(0,0,0,0.2);z-index:99999;max-height:260px;overflow-y:auto;";
        document.body.appendChild(resBox);
      }
      if (!searchInp || !searchInp.value.trim() || !list.length) {
        resBox.style.display = "none";
        return;
      }
      resBox.style.display = "block";
      resBox.innerHTML = list
        .filter((u) => u.username !== myUser)
        .map((u) => {
          const isAcc = acceptedList.includes(u.username);
          const isPen = pendingSent.includes(u.username);
          let btnHtml = `<button onclick="window.sendFollowReq('${u.username}','${u.name}')" style="background:#2563eb;color:#fff;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;">+ Follow</button>`;
          if (isAcc) {
            btnHtml = `<button onclick="localStorage.setItem('active_chat_user','@${u.username}');localStorage.setItem('active_chat_name','${u.name}');location.href='for.html';" style="background:#008069;color:#fff;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;">Message</button>`;
          } else if (isPen) {
            btnHtml = `<button disabled style="background:#e2e8f0;color:#475569;border:none;padding:6px 14px;border-radius:16px;font-size:12px;font-weight:600;">Requested ⏳</button>`;
          }
          return `<div style="padding:12px 14px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;">
            <div><b>${u.name}</b> <span style="color:#64748b;font-size:12px;">@${u.username}</span></div>
            ${btnHtml}
          </div>`;
        })
        .join("");
    });

    window.sendFollowReq = function (targetUser, targetName) {
      if (!pendingSent.includes(targetUser)) {
        pendingSent.push(targetUser);
        localStorage.setItem("cb_pending_" + myUser, JSON.stringify(pendingSent));
      }
      sock.emit("send_follow_request", { from: myUser, fromName: myName, to: targetUser });
      const searchInp = document.querySelector('input[placeholder*="Search"], #searchUser');
      if (searchInp) sock.emit("search_live_users", searchInp.value.trim());
    };

    // 2. सामने वाले के पास Request आने पर Notification कार्ड + Accept बटन दिखाना
    function showRequestModal(req) {
      const old = document.getElementById("cbFollowReqCard");
      if (old) old.remove();
      const card = document.createElement("div");
      card.id = "cbFollowReqCard";
      card.style.cssText = "position:fixed;top:16px;left:12px;right:12px;background:#ffffff;color:#0f172a;padding:14px 16px;border-radius:18px;box-shadow:0 12px 32px rgba(0,0,0,0.28);z-index:999999;display:flex;align-items:center;justify-content:space-between;gap:10px;border-left:5px solid #008069;";
      card.innerHTML = `
        <div>
          <div style="font-size:11px;color:#008069;font-weight:700;">🔔 Follow Request</div>
          <div style="font-size:14px;font-weight:700;">${req.fromName} <span style="font-weight:400;color:#64748b;">(@${req.from})</span></div>
        </div>
        <div style="display:flex;gap:6px;">
          <button id="cbAccBtn" style="background:#008069;color:#fff;border:none;padding:7px 14px;border-radius:14px;font-size:12.5px;font-weight:700;cursor:pointer;">Accept ✓</button>
          <button id="cbDecBtn" style="background:#f1f5f9;color:#475569;border:none;padding:7px 10px;border-radius:14px;font-size:12px;cursor:pointer;">✕</button>
        </div>`;
      document.body.appendChild(card);

      document.getElementById("cbAccBtn").onclick = () => {
        if (!acceptedList.includes(req.from)) {
          acceptedList.push(req.from);
          localStorage.setItem("cb_accepted_" + myUser, JSON.stringify(acceptedList));
        }
        incomingReqs = incomingReqs.filter((r) => r.from !== req.from);
        localStorage.setItem("cb_incoming_reqs_" + myUser, JSON.stringify(incomingReqs));
        sock.emit("accept_follow_request", { from: myUser, fromName: myName, to: req.from });
        card.remove();

        // Accept करते ही सीधे 3rd Screen (Direct Chat - for.html) में जाना
        localStorage.setItem("active_chat_user", "@" + req.from);
        localStorage.setItem("active_chat_name", req.fromName || req.from);
        location.href = "for.html";
      };

      document.getElementById("cbDecBtn").onclick = () => {
        incomingReqs = incomingReqs.filter((r) => r.from !== req.from);
        localStorage.setItem("cb_incoming_reqs_" + myUser, JSON.stringify(incomingReqs));
        card.remove();
      };
    }

    sock.off("incoming_follow_request").on("incoming_follow_request", (req) => {
      if (!req || !req.from) return;
      if (!incomingReqs.some((r) => r.from === req.from)) {
        incomingReqs.push(req);
        localStorage.setItem("cb_incoming_reqs_" + myUser, JSON.stringify(incomingReqs));
      }
      showRequestModal(req);
    });

    // ऊपर Notification Bell (🔔) पर टैप करने से भी पेंडिंग रिक्वेस्ट दिखाना
    const bellBtn = document.querySelector('[aria-label*="Notification"], .bell-btn, #notifBtn, header button');
    if (bellBtn && !bellBtn.dataset.reqHooked) {
      bellBtn.dataset.reqHooked = "1";
      bellBtn.addEventListener("click", () => {
        const saved = JSON.parse(localStorage.getItem("cb_incoming_reqs_" + myUser) || "[]");
        if (saved.length > 0) showRequestModal(saved[saved.length - 1]);
      });
    }

    // 3. सामने वाले के Accept करते ही भेजने वाले को भी सीधे 3rd Screen (for.html) में ले जाना
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

  setTimeout(setupRequestAcceptFlow, 1400);
})();

