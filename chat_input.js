(function () {
  // पुराने सभी इनपुट बार और नीचे की पट्टियों को साफ-सुथरा छिपाना
  document.querySelectorAll(".input-bar, .chat-input, .bottom-bar, .input-area, footer").forEach(el => {
    el.style.setProperty("display", "none", "important");
  });

  // वर्तमान चुनी हुई थीम का रंग निकालना
  const savedTheme = localStorage.getItem("chatbox_theme_grad") || "linear-gradient(135deg, #00F5D4, #2979FF)";
  const savedPrimary = localStorage.getItem("chatbox_theme_primary") || "#2979FF";

  document.body.insertAdjacentHTML("beforeend", `
    <input type="file" id="waPickGallery" accept="image/*,video/*" style="display:none;">
    <input type="file" id="waPickCamera" accept="image/*" capture="environment" style="display:none;">
    <input type="file" id="waPickDoc" accept=".pdf,.doc,.docx,.txt,.zip,*/*" style="display:none;">

    <!-- 1. प्रीमियम थीम-मैच्ड Attachment Menu -->
    <div id="waAttachMenu" style="display:none;position:fixed;bottom:76px;left:12px;right:12px;max-width:420px;margin:0 auto;background:rgba(255,255,255,0.97);backdrop-filter:blur(16px);border-radius:26px;padding:22px 16px;z-index:99995;box-shadow:0 14px 40px rgba(15,23,42,0.2);border:1px solid rgba(0,0,0,0.06);">
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:18px;text-align:center;">
        <div id="waActDoc" style="cursor:pointer;">
          <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#7f66ff,#5f45e8);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;box-shadow:0 6px 15px rgba(127,102,255,0.28);">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <span style="font-size:12px;font-weight:700;color:#334155;">Document</span>
        </div>
        <div id="waActCam" style="cursor:pointer;">
          <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#ff2e74,#d91b5c);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;box-shadow:0 6px 15px rgba(255,46,116,0.28);">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <span style="font-size:12px;font-weight:700;color:#334155;">Camera</span>
        </div>
        <div id="waActGal" style="cursor:pointer;">
          <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#c861f9,#9b35d4);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;box-shadow:0 6px 15px rgba(200,97,249,0.28);">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <span style="font-size:12px;font-weight:700;color:#334155;">Gallery</span>
        </div>
        <div id="waActLoc" style="cursor:pointer;">
          <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;box-shadow:0 6px 15px rgba(16,185,129,0.28);">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <span style="font-size:12px;font-weight:700;color:#334155;">Location</span>
        </div>
        <div id="waActCon" style="cursor:pointer;">
          <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;box-shadow:0 6px 15px rgba(14,165,233,0.28);">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span style="font-size:12px;font-weight:700;color:#334155;">Contact</span>
        </div>
        <div id="waActPol" style="cursor:pointer;">
          <div style="width:52px;height:52px;border-radius:18px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;box-shadow:0 6px 15px rgba(245,158,11,0.28);">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <span style="font-size:12px;font-weight:700;color:#334155;">Poll</span>
        </div>
      </div>
    </div>

    <!-- 2. क्लीन ट्रांसलूसेंट + थीम मैच्ड बॉटम इनपुट बार (कोई मटमैला रंग नहीं) -->
    <div id="waBottomInput" style="position:fixed;bottom:0;left:0;right:0;padding:8px 10px 10px 10px;background:transparent;display:flex;align-items:center;gap:8px;z-index:99980;">
      <div style="flex:1;background:rgba(255,255,255,0.95);backdrop-filter:blur(14px);border-radius:26px;padding:6px 13px;display:flex;align-items:center;gap:8px;box-shadow:0 4px 18px rgba(15,23,42,0.12);border:1px solid rgba(0,0,0,0.06);">
        <div id="waEmojiBtn" style="color:#64748b;display:flex;align-items:center;cursor:pointer;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </div>
        <input type="text" id="waTextInp" placeholder="Type a message..." autocomplete="off" style="flex:1;border:none;outline:none;font-size:15px;color:#0f172a;background:transparent;padding:5px 2px;">
        <div id="waClipBtn" style="color:${savedPrimary};display:flex;align-items:center;cursor:pointer;padding:2px;">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </div>
        <div id="waCamQuick" style="color:#64748b;display:flex;align-items:center;cursor:pointer;padding:2px;">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </div>
      </div>

      <!-- थीम से मैच करता हुआ ग्रेडिएंट Mic / Send बटन -->
      <button id="waSendMicBtn" style="width:48px;height:48px;border-radius:50%;border:none;background:${savedTheme};color:#ffffff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(41,121,255,0.35);flex-shrink:0;">
        <svg id="waMicIco" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        <svg id="waSendIco" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `);
  const inp = document.getElementById("waTextInp");
  const menu = document.getElementById("waAttachMenu");
  const btn = document.getElementById("waSendMicBtn");
  const micIco = document.getElementById("waMicIco");
  const sendIco = document.getElementById("waSendIco");

  inp.addEventListener("input", () => {
    const hasTxt = inp.value.trim().length > 0;
    micIco.style.display = hasTxt ? "none" : "block";
    sendIco.style.display = hasTxt ? "block" : "none";
    document.getElementById("waCamQuick").style.display = hasTxt ? "none" : "flex";
  });

  // सही 'me' क्लास और दाईं तरफ नीले बबल में मैसेज भेजना
          function pushBubble(htmlContent, msgId) {
      const area = document.getElementById("chatArea") || document.querySelector(".chat");
      if (!area) return;
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // यदि कोई रिप्लाई कोट बॉक्स खुला है, तो बबल के अंदर सुंदर कोट बॉक्स जोड़ना
      let quotePart = "";
      if (window.pendingReplyData) {
        quotePart = `
          <div style="background:rgba(0,0,0,0.18);border-left:3.5px solid #ffffff;border-radius:7px;padding:4px 8px;margin-bottom:4px;font-size:12px;line-height:1.25;">
            <div style="font-weight:700;font-size:11.5px;margin-bottom:1px;">${window.pendingReplyData.who}</div>
            <div style="opacity:0.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${window.pendingReplyData.text}</div>
          </div>
        `;
        if (typeof window.closeReplyBar === "function") window.closeReplyBar();
      }

      area.insertAdjacentHTML("beforeend", `
        <div id="${msgId}" class="msg out" style="align-self:flex-end;background:${savedTheme};color:#ffffff;padding:6px 10px 6px 11px;border-radius:13px;border-top-right-radius:2px;max-width:78%;width:fit-content;font-size:14.5px;line-height:1.35;box-shadow:0 1px 1.5px rgba(0,0,0,0.14);word-wrap:break-word;">
          ${quotePart}
          
                    <span style="font-weight:600;text-shadow:0 1px 1.5px rgba(0,0,0,0.22);">${htmlContent}</span>
          <span style="font-size:10px;opacity:0.85;margin-left:8px;vertical-align:bottom;white-space:nowrap;">${t} <span class="cb-tick" data-status="sent" style="font-weight:900;">✓</span></span>
          
        </div>
      `);

      area.scrollTop = area.scrollHeight;
      localStorage.setItem("cb_saved_chat_" + (localStorage.getItem("active_chat_user") || "@friend"), area.innerHTML);
    }


  function sendNow() {
    const val = inp.value.trim();
    if (!val) return;
    const msgId = "m_" + Date.now();
    pushBubble(val, msgId);
    inp.value = "";
    micIco.style.display = "block";
    sendIco.style.display = "none";
    document.getElementById("waCamQuick").style.display = "flex";

    if (window.socket) {
      const myUser = "@" + (localStorage.getItem("chatbox_username") || "me");
      window.socket.emit("private_message", {
        mid: msgId,
        from: myUser,
        to: localStorage.getItem("active_chat_user"),
        content: val,
        type: "text"
      });
    }
  }

  // चैट खुलते ही सामने वाले दोस्त को 'Seen' का सिग्नल भेजना और लाइव टिक रंग बदलना
  setInterval(() => {
    if (window.socket && !window.cbTickBound) {
      window.cbTickBound = true;
      const partner = localStorage.getItem("active_chat_user");
      const myUser = "@" + (localStorage.getItem("chatbox_username") || "me");
      if (partner) window.socket.emit("mark_messages_read", { to: partner, from: myUser });

      window.socket.on("msg_status_update", (d) => {
        if (d.status === "delivered" && d.mid) {
          const tick = document.querySelector(`[data-mid="${d.mid}"] .cb-tick`);
          if (tick && tick.dataset.status !== "read") {
            tick.innerText = "✓✓";
            tick.dataset.status = "delivered";
          }
        }
        if (d.status === "read") {
          document.querySelectorAll(".cb-tick").forEach(tk => {
            tk.innerText = "✓✓";
            tk.dataset.status = "read";
            tk.style.color = "#00F5D4"; // चमकता हुआ रंगीन ब्लू-एक्वा टिक
            tk.style.textShadow = "0 0 6px rgba(0, 245, 212, 0.7)";
          });
          const area = document.getElementById("chatArea");
          if (area) localStorage.setItem("cb_saved_chat_" + (localStorage.getItem("active_chat_user") || "@friend"), area.innerHTML);
        }
      });
    }
  }, 600);


    // 100% असली आवाज़ रिकॉर्ड करने और लाइव भेजने का सिस्टम (MediaRecorder)
  let mediaRec = null, audioChunks = [], recTimer = null, recSecs = 0;

  
  btn.onclick = () => {
    if (inp.value.trim().length > 0) sendNow();
    else toggleRealVoiceRecord();
  };

  inp.addEventListener("keydown", e => { if (e.key === "Enter") sendNow(); });

  document.getElementById("waClipBtn").onclick = e => {
    e.stopPropagation();
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  };
  document.addEventListener("click", e => {
    if (!e.target.closest("#waAttachMenu, #waClipBtn")) menu.style.display = "none";
  });
  function emitMediaLive(html, type, mid) {
    if (window.socket) {
      const myUser = "@" + (localStorage.getItem("chatbox_username") || "me");
      window.socket.emit("private_message", {
        mid: mid,
        from: myUser,
        to: localStorage.getItem("active_chat_user"),
        content: html,
        type: type
      });
    }
  }

  document.getElementById("waActGal").onclick = () => { menu.style.display = "none"; document.getElementById("waPickGallery").click(); };
  document.getElementById("waActCam").onclick = () => { menu.style.display = "none"; document.getElementById("waPickCamera").click(); };
  document.getElementById("waCamQuick").onclick = () => document.getElementById("waPickCamera").click();

  function handleImgFile(inputEl) {
    inputEl.onchange = e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        const mid = "m_" + Date.now();
        const isVid = file.type.startsWith("video");
        const mediaHtml = isVid
          ? `<video controls src="${r.result}" style="max-width:215px;border-radius:12px;display:block;"></video>`
          : `<img src="${r.result}" style="max-width:215px;border-radius:12px;display:block;">`;
        pushBubble(mediaHtml, mid);
        emitMediaLive(mediaHtml, isVid ? "video" : "image", mid);
      };
      r.readAsDataURL(file);
      inputEl.value = "";
    };
  }
  handleImgFile(document.getElementById("waPickGallery"));
  handleImgFile(document.getElementById("waPickCamera"));

  document.getElementById("waActDoc").onclick = () => { menu.style.display = "none"; document.getElementById("waPickDoc").click(); };
  document.getElementById("waPickDoc").onchange = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const mid = "m_" + Date.now();
      const docHtml = `<a href="${r.result}" download="${f.name}" style="color:inherit;text-decoration:none;display:flex;align-items:center;gap:8px;">
        <span style="font-size:22px;">📄</span>
        <div><div style="font-weight:700;font-size:13.5px;">${f.name}</div><div style="font-size:11px;opacity:0.8;">${Math.round(f.size / 1024)} KB • Tap to download</div></div>
      </a>`;
      pushBubble(docHtml, mid);
      emitMediaLive(docHtml, "document", mid);
    };
    r.readAsDataURL(f);
    e.target.value = "";
  };

  document.getElementById("waActLoc").onclick = () => {
    menu.style.display = "none";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const mid = "m_" + Date.now();
        const url = `https://google.com{pos.coords.latitude},${pos.coords.longitude}`;
        const locHtml = `📍 <b>Live GPS Location</b><br><a href="${url}" target="_blank" style="color:#bfdbfe;text-decoration:underline;font-size:12px;">View on Google Maps ↗</a>`;
        pushBubble(locHtml, mid);
        emitMediaLive(locHtml, "location", mid);
      }, () => alert("📍 Please enable GPS Location permission in your phone/browser."));
    }
  };

  document.getElementById("waActCon").onclick = async () => {
    menu.style.display = "none";
    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const picked = await navigator.contacts.select(["name", "tel"], { multiple: false });
        if (picked && picked.length > 0) {
          const cName = (picked[0].name && picked[0].name[0]) || "Contact";
          const cNum = (picked[0].tel && picked[0].tel[0]) || "";
          const mid = "m_" + Date.now();
          const conHtml = `👤 <b>${cName}</b><br><span style="font-size:12px;opacity:0.85;">${cNum}</span>`;
          pushBubble(conHtml, mid);
          emitMediaLive(conHtml, "contact", mid);
          return;
        }
      } catch (e) {}
    }
    const cName = prompt("Enter Contact Name:");
    const cNum = prompt("Enter Phone Number:");
    if (cName && cNum) {
      const mid = "m_" + Date.now();
      const conHtml = `👤 <b>${cName}</b><br><span style="font-size:12px;opacity:0.85;">${cNum}</span>`;
      pushBubble(conHtml, mid);
      emitMediaLive(conHtml, "contact", mid);
    }
  };

  document.getElementById("waActPol").onclick = () => {
    menu.style.display = "none";
    const q = prompt("Poll Question:");
    const o1 = prompt("Option 1:");
    const o2 = prompt("Option 2:");
    if (q && o1 && o2) {
      const mid = "m_" + Date.now();
      const polHtml = `📊 <b>${q}</b><div style="margin-top:6px;display:flex;flex-direction:column;gap:5px;">
        <div onclick="this.style.background='rgba(255,255,255,0.28)'" style="padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.4);cursor:pointer;">⭕ ${o1}</div>
        <div onclick="this.style.background='rgba(255,255,255,0.28)'" style="padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.4);cursor:pointer;">⭕ ${o2}</div>
      </div>`;
      pushBubble(polHtml, mid);
      emitMediaLive(polHtml, "poll", mid);
    }
  };

  document.getElementById("waEmojiBtn").onclick = () => inp.focus();


  
})();
