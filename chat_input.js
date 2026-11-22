(function () {
  function runAllChatFixes() {
    // 1. कीबोर्ड खुलने पर भी ऊपर वाले हेडर को स्क्रीन के ठीक ऊपर चिपकाए रखना
    const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
    if (hdr) {
      const vy = window.visualViewport ? window.visualViewport.offsetTop : 0;
      hdr.style.setProperty("position", "fixed", "important");
      hdr.style.setProperty("top", vy + "px", "important");
      hdr.style.setProperty("left", "0px", "important");
      hdr.style.setProperty("right", "0px", "important");
      hdr.style.setProperty("z-index", "99999", "important");
    }

    // 2. पुराने 'Type a message...' वाले पूरे बार को जड़ से छिपाना
    document.querySelectorAll("input, textarea").forEach((el) => {
      if (el.id !== "waNewMsgBox" && (el.placeholder || "").toLowerCase().includes("type a message")) {
        const bar = el.closest(".input-area, .chat-input, .message-input-wrap, footer, form") || el.parentElement;
        if (bar && bar.id !== "waNewInputWrap") bar.style.setProperty("display", "none", "important");
      }
    });
  }

  // 3. नया WhatsApp स्टाइल इनपुट बार और अटैचमेंट मेन्यू बनाना
  function createWaBar() {
    if (document.getElementById("waNewInputWrap")) return;
    const ui = document.createElement("div");
    ui.id = "waNewInputWrap";
    ui.innerHTML = `
      <div id="waCleanAttach" style="display:none;position:fixed;bottom:70px;left:12px;right:12px;background:var(--card-bg,#fff);border-radius:18px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:100000;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#7f66ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">📄</div>
          <span style="font-size:12px;font-weight:600;">Document</span>
          <input type="file" id="waNewDoc" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#ff2e74;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">📷</div>
          <span style="font-size:12px;font-weight:600;">Camera</span>
          <input type="file" accept="image/*" capture="environment" id="waNewCam" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#bf59cf;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">🖼️</div>
          <span style="font-size:12px;font-weight:600;">Gallery</span>
          <input type="file" accept="image/*,video/*" id="waNewGal" style="display:none;">
        </label>
      </div>
      <div style="position:fixed;bottom:0;left:0;right:0;padding:8px 10px;display:flex;align-items:center;gap:8px;z-index:99995;">
        <div style="flex:1;display:flex;align-items:center;background:var(--card-bg,#fff);border-radius:26px;padding:4px 10px;box-shadow:0 2px 10px rgba(0,0,0,0.14);min-height:46px;">
          <input type="text" id="waNewMsgBox" placeholder="Message" autocomplete="off" style="flex:1;border:none;outline:none;background:transparent;font-size:15.5px;color:var(--text-main,#111827);padding:6px;">
          <button type="button" id="waCleanPin" style="background:none;border:none;color:#64748b;padding:6px;cursor:pointer;">📎</button>
          <label style="color:#64748b;padding:5px;cursor:pointer;margin:0;">📷<input type="file" accept="image/*" capture="environment" id="waQuickCam" style="display:none;"></label>
        </div>
        <button type="button" id="waCleanSendBtn" style="width:46px;height:46px;border-radius:50%;border:none;background:#008069;color:#fff;font-size:18px;cursor:pointer;">➤</button>
      </div>`;
    document.body.appendChild(ui);

    const box = document.getElementById("waNewMsgBox");
    const btn = document.getElementById("waCleanSendBtn");
    const pin = document.getElementById("waCleanPin");
    const menu = document.getElementById("waCleanAttach");

    pin.onclick = (e) => { e.stopPropagation(); menu.style.display = menu.style.display === "grid" ? "none" : "grid"; };
    document.addEventListener("click", (e) => { if (!e.target.closest("#waCleanAttach") && !e.target.closest("#waCleanPin")) menu.style.display = "none"; });

    function sendMsg() {
      const txt = box.value.trim();
      if (!txt) return;
      const area = document.querySelector("#chatArea, .chat-area, .chat");
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (area) {
        const b = document.createElement("div");
        b.className = "msg out";
        b.style.cssText = "align-self:flex-end;background:#008069;color:#fff;padding:6px 10px;border-radius:14px 14px 4px 14px;max-width:78%;margin:4px 0;font-size:14.5px;";
        b.innerHTML = `${txt} <span style="font-size:10.5px;opacity:0.8;margin-left:6px;">${t} ✓</span>`;
        area.appendChild(b); area.scrollTop = area.scrollHeight;
      }
      if (window.socket) window.socket.emit("private_message", { to: localStorage.getItem("active_chat_user"), text: txt, time: t });
      box.value = "";
    }
    btn.onclick = sendMsg;
    box.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); sendMsg(); } };

    ["waNewDoc", "waNewCam", "waNewGal", "waQuickCam"].forEach((id) => {
      document.getElementById(id).onchange = function () {
        const f = this.files && this.files[0];
        if (!f) return;
        menu.style.display = "none";
        const r = new FileReader();
        r.onload = (ev) => {
          const area = document.querySelector("#chatArea, .chat-area, .chat");
          const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          if (area) {
            const b = document.createElement("div");
            b.className = "msg out";
            b.style.cssText = "align-self:flex-end;background:#008069;color:#fff;padding:6px 8px;border-radius:14px 14px 4px 14px;max-width:76%;margin:4px 0;";
            b.innerHTML = f.type.startsWith("image/") ? `<img src="${ev.target.result}" style="max-width:200px;border-radius:10px;display:block;"><div style="text-align:right;font-size:10px;">${t} ✓</div>` : `<div>📄 ${f.name}</div><div style="text-align:right;font-size:10px;">${t} ✓</div>`;
            area.appendChild(b); area.scrollTop = area.scrollHeight;
          }
          if (window.socket) window.socket.emit("private_message", { to: localStorage.getItem("active_chat_user"), text: "📎 " + f.name, media: ev.target.result, time: t });
        };
        r.readAsDataURL(f);
        this.value = "";
      };
    });
  }

  setInterval(() => { createWaBar(); runAllChatFixes(); }, 150);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", runAllChatFixes);
    window.visualViewport.addEventListener("scroll", runAllChatFixes);
  }
})();
