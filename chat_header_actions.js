(function () {
  // 1. असली Wallpaper Picker + Voice/Video Call + Block UI जोड़ना
  document.body.insertAdjacentHTML("beforeend", `
    <input type="file" id="cbWallpaperFile" accept="image/*" style="display:none;">

    <!-- Wallpaper चुनने का प्रीमियम पॉप-अप -->
    <div id="cbWallModal" style="display:none;position:fixed;inset:0;background:rgba(15,23,42,0.72);backdrop-filter:blur(8px);justify-content:center;align-items:center;padding:20px;z-index:100000;">
      <div style="background:#fff;width:100%;max-width:330px;border-radius:26px;padding:22px 18px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.35);">
        <h3 style="font-size:18px;color:#0f172a;font-weight:800;">Chat Wallpaper</h3>
        <p style="font-size:12.5px;color:#64748b;margin-top:4px;">Choose a preset theme or pick from gallery</p>
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin:16px 0;">
          <div class="cb-wp-preset" data-bg="#efeae2" style="height:48px;border-radius:14px;background:#efeae2;border:2px solid #cbd5e1;cursor:pointer;"></div>
          <div class="cb-wp-preset" data-bg="linear-gradient(135deg,#0f172a,#1e293b)" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#0f172a,#1e293b);cursor:pointer;"></div>
          <div class="cb-wp-preset" data-bg="linear-gradient(135deg,#e0f2fe,#bae6fd)" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#e0f2fe,#bae6fd);cursor:pointer;"></div>
          <div class="cb-wp-preset" data-bg="linear-gradient(135deg,#fce7f3,#fbcfe8)" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);cursor:pointer;"></div>
        </div>
        <button id="cbPickCustomWall" style="width:100%;padding:12px;border:none;border-radius:14px;background:linear-gradient(135deg,#00F5D4,#2979FF);color:#0f172a;font-weight:800;font-size:13.5px;margin-bottom:8px;cursor:pointer;">Choose Photo from Gallery</button>
        <button id="cbResetWall" style="width:100%;padding:11px;border:none;border-radius:14px;background:#f1f5f9;color:#475569;font-weight:700;font-size:13px;margin-bottom:8px;cursor:pointer;">Reset Default</button>
        <button id="cbCloseWall" style="width:100%;padding:10px;border:none;background:transparent;color:#94a3b8;font-weight:700;font-size:13px;cursor:pointer;">Close</button>
      </div>
    </div>

    <!-- असली Voice और Video Call स्क्रीन -->
    <div id="cbCallOverlay" style="display:none;position:fixed;inset:0;background:linear-gradient(160deg,#0f172a,#1e293b);color:#fff;flex-direction:column;justify-content:space-between;align-items:center;padding:60px 24px 50px 24px;z-index:100005;">
      <div style="text-align:center;">
        <div id="cbCallBadge" style="display:inline-block;padding:5px 14px;border-radius:20px;background:rgba(0,245,212,0.16);color:#00F5D4;font-size:12px;font-weight:700;margin-bottom:18px;">End-to-End Encrypted Voice Call</div>
        <div id="cbCallAvatar" style="width:96px;height:96px;border-radius:32px;background:linear-gradient(135deg,#00F5D4,#2979FF);color:#0f172a;font-size:38px;font-weight:900;display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;box-shadow:0 12px 35px rgba(0,245,212,0.3);">U</div>
        <h2 id="cbCallName" style="font-size:24px;font-weight:800;">User</h2>
        <p id="cbCallStatus" style="font-size:14px;color:#94a3b8;margin-top:6px;">Calling...</p>
      </div>
      <video id="cbLocalVideo" autoplay muted playsinline style="display:none;width:100%;max-width:300px;height:220px;object-fit:cover;border-radius:24px;border:2px solid rgba(255,255,255,0.2);"></video>
      <div style="display:flex;gap:22px;align-items:center;">
        <button id="cbMuteCallBtn" style="width:56px;height:56px;border-radius:50%;border:none;background:rgba(255,255,255,0.14);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
        </button>
        <button id="cbEndCallBtn" style="width:66px;height:66px;border-radius:50%;border:none;background:#ef4444;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 25px rgba(239,68,68,0.45);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
        </button>
      </div>
    </div>
  `);
  const partner = localStorage.getItem("active_chat_user") || "@friend";
  const partnerName = localStorage.getItem("active_chat_name") || "Friend";
  const wallKey = "cb_wallpaper_" + partner;

    function applySavedWallpaper() {
        const savedBg = localStorage.getItem(wallKey) || localStorage.getItem("cb_wallpaper_global");
    const savedBright = localStorage.getItem("cb_wall_bright_" + partner) || localStorage.getItem("cb_wall_bright_global") || "100";


    // चैट के पीछे एक डेडिकेटेड फुल-स्क्रीन वॉलपेपर लेयर बनाना (ताकि टेक्स्ट की चमक कम न हो)
    let bgLayer = document.getElementById("cbDedicatedWallLayer");
    if (!bgLayer) {
      bgLayer = document.createElement("div");
      bgLayer.id = "cbDedicatedWallLayer";
      bgLayer.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;background-size:cover;background-position:center;";
      document.body.prepend(bgLayer);
    }

    if (savedBg.startsWith("data:image")) {
      bgLayer.style.background = "none";
      bgLayer.style.backgroundImage = `url("${savedBg}")`;
      bgLayer.style.backgroundSize = "cover";
      bgLayer.style.backgroundPosition = "center";
    } else {
      bgLayer.style.backgroundImage = "none";
      bgLayer.style.background = savedBg;
    }
    bgLayer.style.filter = `brightness(${savedBright}%)`;

    // बाहर की सभी सफ़ेद परतों को पारदर्शी करना
    document.documentElement.style.setProperty("background", "transparent", "important");
    document.body.style.setProperty("background", "transparent", "important");
    const area = document.getElementById("chatArea");
    if (area) area.style.setProperty("background", "transparent", "important");
  }

  
  applySavedWallpaper();

  window.openWallpaperModal = () => { document.getElementById("cbWallModal").style.display = "flex"; };
  document.getElementById("cbCloseWall").onclick = () => { document.getElementById("cbWallModal").style.display = "none"; };

  document.querySelectorAll(".cb-wp-preset").forEach(p => {
    p.onclick = () => {
      localStorage.setItem(wallKey, p.dataset.bg);
      applySavedWallpaper();
      document.getElementById("cbWallModal").style.display = "none";
    };
  });

  document.getElementById("cbPickCustomWall").onclick = () => document.getElementById("cbWallpaperFile").click();
  document.getElementById("cbWallpaperFile").onchange = e => {
    const file = e.target.files && e.target.files;
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      localStorage.setItem(wallKey, r.result);
      applySavedWallpaper();
      document.getElementById("cbWallModal").style.display = "none";
    };
    r.readAsDataURL(file);
  };

  document.getElementById("cbResetWall").onclick = () => {
    localStorage.removeItem(wallKey);
    const area = document.getElementById("chatArea");
    if (area) { area.style.background = ""; area.style.backgroundImage = ""; }
    document.getElementById("cbWallModal").style.display = "none";
  };

  let activeStream = null, isMuted = false;
  window.startLiveCall = async function (isVideo) {
        if (typeof window.startRealCall === "function") return window.startRealCall(null, null, isVideo);

    const ov = document.getElementById("cbCallOverlay");
    const vid = document.getElementById("cbLocalVideo");
    document.getElementById("cbCallName").innerText = partnerName;
    document.getElementById("cbCallAvatar").innerText = partnerName.charAt(0).toUpperCase();
    document.getElementById("cbCallStatus").innerText = isVideo ? "WhatsApp video call..." : "Ringing...";
    ov.style.display = "flex";

    let logs = JSON.parse(localStorage.getItem("chatbox_call_logs") || "[]");
    logs.unshift({ name: partnerName, user: partner, type: isVideo ? "Video" : "Voice", dir: "Outgoing", time: "Just now" });
    localStorage.setItem("chatbox_call_logs", JSON.stringify(logs));

    if (window.socket) {
      window.socket.emit("call_user", { to: partner, fromName: localStorage.getItem("chatbox_name") || "Friend", isVideo: isVideo });
    }

    try {
      activeStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
      if (isVideo) { vid.srcObject = activeStream; vid.style.display = "block"; }
      else { vid.style.display = "none"; }
    } catch (e) { vid.style.display = "none"; }
  };

  document.getElementById("cbMuteCallBtn").onclick = function () {
    isMuted = !isMuted;
    this.style.background = isMuted ? "#ffffff" : "rgba(255,255,255,0.08)";
    this.style.color = isMuted ? "#0b141a" : "#ffffff";
    if (activeStream) activeStream.getAudioTracks().forEach(t => t.enabled = !isMuted);
  };

  document.getElementById("cbEndCallBtn").onclick = () => {
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    document.getElementById("cbCallOverlay").style.display = "none";
  };

  // हेडर के Video, Voice Call आइकन और 3-Dot मेन्यू के सभी विकल्पों को जोड़ना
  document.addEventListener("click", e => {
    const target = e.target.closest("button, div, span, li, a");
    if (!target || target.closest("#cbWallModal, #cbCallOverlay, #waBottomInput, #msgTopBar")) return;

    const txt = (target.innerText || "").toLowerCase().trim();
    const oc = (target.getAttribute("onclick") || "").toLowerCase();
    const title = (target.getAttribute("title") || "").toLowerCase();

    if (txt.includes("wallpaper") || oc.includes("wallpaper")) {
      e.preventDefault(); e.stopImmediatePropagation();
      window.location.href = "wallpaper.html";
    } else if (txt === "video call" || oc.includes("video") || title.includes("video")) {
      e.preventDefault(); e.stopImmediatePropagation();
      window.startLiveCall(true);
    } else if (txt === "voice call" || txt === "audio call" || oc.includes("voice") || oc.includes("call") || title.includes("call")) {
      e.preventDefault(); e.stopImmediatePropagation();
      window.startLiveCall(false);
    } else if (txt.includes("clear chat") || oc.includes("clear")) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (confirm("Clear this chat?")) {
        const area = document.getElementById("chatArea");
        if (area) area.innerHTML = "";
        localStorage.removeItem("cb_saved_chat_" + partner);
      }
    } 
  }, true);
    // असली WhatsApp जैसा क्लीन वेक्टर आइकन वाला 3-Dot मेन्यू
  document.body.insertAdjacentHTML("beforeend", `
    <div id="waCleanMenu" style="display:none;position:fixed;top:58px;right:12px;width:210px;background:#ffffff;border-radius:16px;padding:6px 0;z-index:100002;box-shadow:0 10px 30px rgba(0,0,0,0.2);border:1px solid rgba(0,0,0,0.06);">
      <div id="wmView" style="display:flex;align-items:center;gap:14px;padding:12px 16px;color:#1e293b;font-size:14.5px;font-weight:500;cursor:pointer;">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>View contact</span>
      </div>
      <div id="wmWall" style="display:flex;align-items:center;gap:14px;padding:12px 16px;color:#1e293b;font-size:14.5px;font-weight:500;cursor:pointer;">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span>Wallpaper</span>
      </div>
      <div id="wmSearch" style="display:flex;align-items:center;gap:14px;padding:12px 16px;color:#1e293b;font-size:14.5px;font-weight:500;cursor:pointer;">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Search</span>
      </div>
      <div id="wmClear" style="display:flex;align-items:center;gap:14px;padding:12px 16px;color:#1e293b;font-size:14.5px;font-weight:500;cursor:pointer;">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        <span>Clear chat</span>
      </div>
      <div style="height:1px;background:#f1f5f9;margin:4px 0;"></div>
      <div id="wmBlock" style="display:flex;align-items:center;gap:14px;padding:12px 16px;color:#dc2626;font-size:14.5px;font-weight:500;cursor:pointer;">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
        <span>Block</span>
      </div>
    </div>
  `);

  const cleanMenu = document.getElementById("waCleanMenu");

  // पुराने 3-dot ड्रॉपडाउन को छिपाना और नया क्लीन मेन्यू खोलना
  document.addEventListener("click", e => {
    const dotBtn = e.target.closest("[onclick*='menu'], [onclick*='Menu'], .dots, .more-btn");
    if (dotBtn && !dotBtn.closest("#waCleanMenu")) {
      e.preventDefault();
      e.stopImmediatePropagation();
      document.querySelectorAll(".dropdown, .menu-popup, #chatMenu").forEach(x => x.style.display = "none");
      cleanMenu.style.display = cleanMenu.style.display === "none" ? "block" : "none";
      return;
    }
    if (!e.target.closest("#waCleanMenu")) cleanMenu.style.display = "none";
  }, true);

  document.getElementById("wmView").onclick = () => { cleanMenu.style.display = "none"; window.location.href = "contact_info.html"; };
  document.getElementById("wmWall").onclick = () => {
  cleanMenu.style.display = "none";
  window.location.href = "wallpaper.html";
};

  document.getElementById("wmSearch").onclick = () => {
    cleanMenu.style.display = "none";
    const q = prompt("Search in chat:");
    if (!q) return;
    document.querySelectorAll("#chatArea .msg").forEach(m => {
      m.style.outline = m.innerText.toLowerCase().includes(q.toLowerCase()) ? "2px solid #008069" : "";
    });
  };
  document.getElementById("wmClear").onclick = () => {
    cleanMenu.style.display = "none";
    if (confirm("Clear all messages in this chat?")) {
      const area = document.getElementById("chatArea");
      if (area) area.innerHTML = "";
      localStorage.removeItem("cb_saved_chat_" + partner);
    }
  };
    // असली WhatsApp Block Banner और Input Lock लगाना
      function checkAndApplyBlockState() {
    const isBlocked = localStorage.getItem("cb_blocked_" + partner) === "1";
    const inpBar = document.getElementById("waBottomInput");
    let blockBanner = document.getElementById("cbBlockedBanner");
    const menuTxt = document.querySelector("#wmBlock span");

    if (menuTxt) menuTxt.innerText = isBlocked ? "Unblock" : "Block";

    if (isBlocked) {
      if (inpBar) inpBar.style.display = "none";
      if (!blockBanner) {
        document.body.insertAdjacentHTML("beforeend", `
          <div id="cbBlockedBanner" style="position:fixed;bottom:10px;left:12px;right:12px;background:#ffffff;color:#475569;padding:13px 16px;border-radius:16px;text-align:center;font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,0.12);z-index:99985;cursor:pointer;border:1px solid #e2e8f0;">
            🚫 You blocked this contact. <span style="color:#008069;font-weight:700;">Tap to unblock.</span>
          </div>
        `);
        document.getElementById("cbBlockedBanner").onclick = openBlockConfirm;
      } else {
        blockBanner.style.display = "block";
      }
    } else {
      if (blockBanner) blockBanner.style.display = "none";
      if (inpBar) inpBar.style.display = "flex";
    }
  }

    // WhatsApp जैसा Block / Unblock Confirm पॉप-अप बनाना
  document.body.insertAdjacentHTML("beforeend", `
    <div id="cbBlockConfirmModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);justify-content:center;align-items:center;padding:24px;z-index:100005;">
      <div style="background:#ffffff;width:100%;max-width:315px;border-radius:22px;padding:22px 20px 16px 20px;box-shadow:0 14px 40px rgba(0,0,0,0.28);text-align:left;">
        <div id="cbBlkTitle" style="font-size:17px;color:#0f172a;font-weight:700;margin-bottom:8px;">Block user?</div>
        <div id="cbBlkDesc" style="font-size:13.5px;color:#64748b;line-height:1.45;margin-bottom:18px;">Blocked contacts will no longer be able to call you or send you messages.</div>
        <div style="display:flex;justify-content:flex-end;gap:12px;">
          <button id="cbBlkCancel" style="background:none;border:none;color:#008069;font-weight:700;font-size:14px;padding:8px 12px;cursor:pointer;">Cancel</button>
          <button id="cbBlkProceed" style="background:none;border:none;color:#dc2626;font-weight:700;font-size:14px;padding:8px 12px;cursor:pointer;">Block</button>
        </div>
      </div>
    </div>
  `);

  function openBlockConfirm(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    cleanMenu.style.display = "none";
    const currentlyBlocked = localStorage.getItem("cb_blocked_" + partner) === "1";

    document.getElementById("cbBlkTitle").innerText = (currentlyBlocked ? "Unblock " : "Block ") + partnerName + "?";
    document.getElementById("cbBlkDesc").innerText = currentlyBlocked
      ? "Unblocking will allow this contact to call you and send you messages again."
      : "Blocked contacts will no longer be able to call you or send you messages.";
    document.getElementById("cbBlkProceed").innerText = currentlyBlocked ? "Unblock" : "Block";
    document.getElementById("cbBlkProceed").style.color = currentlyBlocked ? "#008069" : "#dc2626";
    document.getElementById("cbBlockConfirmModal").style.display = "flex";
  }

  document.getElementById("cbBlkCancel").onclick = () => {
    document.getElementById("cbBlockConfirmModal").style.display = "none";
  };

  document.getElementById("cbBlkProceed").onclick = () => {
    document.getElementById("cbBlockConfirmModal").style.display = "none";
    const currentlyBlocked = localStorage.getItem("cb_blocked_" + partner) === "1";
    let list = JSON.parse(localStorage.getItem("chatbox_blocked_users") || "[]");

    if (currentlyBlocked) {
      localStorage.removeItem("cb_blocked_" + partner);
      list = list.filter(u => (u.user || u) !== partner);
    } else {
      localStorage.setItem("cb_blocked_" + partner, "1");
      if (!list.some(u => (u.user || u) === partner)) {
        list.push({ name: partnerName, user: partner });
      }
    }
    localStorage.setItem("chatbox_blocked_users", JSON.stringify(list));
    checkAndApplyBlockState();
  };

  document.getElementById("wmBlock").onclick = openBlockConfirm;
  setTimeout(() => {
    checkAndApplyBlockState();
    const banner = document.getElementById("cbBlockedBanner");
    if (banner) banner.onclick = openBlockConfirm;
  }, 150);
  // चैट के किसी भी मैसेज को दबाकर रखने (Long-Press) पर असली Star (★) करना
  let starPressTimer = null;
  document.addEventListener("touchstart", function (e) {
    const bubble = e.target.closest(".msg, .bubble, .message, [data-mid]");
    if (!bubble) return;
    starPressTimer = setTimeout(() => {
      const msgText = (bubble.innerText || "").trim();
      if (!msgText) return;
      const starred = JSON.parse(localStorage.getItem("chatbox_starred_msgs") || "[]");
      starred.unshift({
        chatName: partnerName,
        chatUser: partner,
        sender: bubble.classList.contains("sent") || bubble.classList.contains("me") ? "me" : "them",
        text: msgText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      localStorage.setItem("chatbox_starred_msgs", JSON.stringify(starred));
      if (window.showAppAlert) showAppAlert("Message starred! Check Starred messages in menu.");
    }, 600);
  }, { passive: true });

  document.addEventListener("touchend", () => clearTimeout(starPressTimer), { passive: true });


  

})();
