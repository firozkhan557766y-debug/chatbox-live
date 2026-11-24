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

