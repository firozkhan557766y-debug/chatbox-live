(function () {
  function initWaUI() {
    // 1. कीबोर्ड खुलने पर भी हेडर को हमेशा स्क्रीन पर चिपकाए रखना
    const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
    const topOffset = window.visualViewport ? window.visualViewport.offsetTop : 0;
    if (hdr) {
      hdr.style.cssText = `position:fixed !important;top:${topOffset}px !important;left:0 !important;right:0 !important;height:58px !important;display:flex !important;align-items:center !important;justify-content:space-between !important;z-index:99999 !important;visibility:visible !important;opacity:1 !important;`;
    }
    document.body.style.setProperty("padding-top", "62px", "important");
    document.body.style.setProperty("padding-bottom", "70px", "important");

    // 2. असली WhatsApp अटैचमेंट मेन्यू (Document, Camera, Gallery) बनाना
    if (!document.getElementById("waAttachBox")) {
      const box = document.createElement("div");
      box.id = "waAttachBox";
      box.style.cssText = "display:none;position:fixed;bottom:68px;left:12px;right:12px;background:var(--card-bg,#fff);border-radius:16px;padding:16px;box-shadow:0 8px 28px rgba(0,0,0,0.25);z-index:100000;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;";
      box.innerHTML = `
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#7f66ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">📄</div>
          <span style="font-size:12px;font-weight:600;color:var(--text-main,#111);">Document</span>
          <input type="file" id="waDocIn" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#ff2e74;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">📷</div>
          <span style="font-size:12px;font-weight:600;color:var(--text-main,#111);">Camera</span>
          <input type="file" accept="image/*" capture="environment" id="waCamIn" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#bf59cf;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">🖼️</div>
          <span style="font-size:12px;font-weight:600;color:var(--text-main,#111);">Gallery</span>
          <input type="file" accept="image/*,video/*" id="waGalIn" style="display:none;">
        </label>`;
      document.body.appendChild(box);

      ["waDocIn", "waCamIn", "waGalIn"].forEach(id => {
        document.getElementById(id).onchange = function () {
          const f = this.files && this.files[0];
          if (!f) return;
          box.style.display = "none";
          const r = new FileReader();
          r.onload = e => {
            const area = document.querySelector("#chatArea, .chat-area, .chat");
            const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            if (area) {
              const d = document.createElement("div");
              d.className = "msg out";
              d.style.cssText = "align-self:flex-end;background:#008069;color:#fff;padding:6px 8px;border-radius:14px 14px 4px 14px;max-width:75%;margin:4px 0;font-size:13.5px;";
              d.innerHTML = f.type.startsWith("image/")
                ? `<img src="${e.target.result}" style="max-width:200px;border-radius:10px;display:block;"><div style="text-align:right;font-size:10px;margin-top:3px;">${t} ✓</div>`
                : `<div>📄 <b>${f.name}</b></div><div style="text-align:right;font-size:10px;margin-top:3px;">${t} ✓</div>`;
              area.appendChild(d);
              area.scrollTop = area.scrollHeight;
            }
            if (window.socket) window.socket.emit("private_message", { to: localStorage.getItem("active_chat_user"), text: "📎 " + f.name, media: e.target.result, time: t });
          };
          r.readAsDataURL(f);
          this.value = "";
        };
      });
    }

    // 3. पुराने इनपुट और पिन (📎) बटन को WhatsApp स्टाइल में लॉक करना
    const inp = document.querySelector('input[placeholder*="Type a message"], input[placeholder="Message"], #msgInput');
    if (inp) {
      inp.placeholder = "Message";
      const bar = inp.closest(".input-area, .chat-input, .message-input-wrap, footer") || (inp.parentElement && inp.parentElement.parentElement ? inp.parentElement.parentElement : inp.parentElement);
      if (bar && bar.tagName !== "BODY") {
        bar.style.cssText = "position:fixed !important;bottom:0 !important;left:0 !important;right:0 !important;display:flex !important;align-items:center !important;z-index:99998 !important;visibility:visible !important;opacity:1 !important;";
        const oldPin = bar.querySelector("button, label, span, svg");
        if (oldPin && !oldPin.dataset.waBound) {
          oldPin.dataset.waBound = "1";
          oldPin.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            const b = document.getElementById("waAttachBox");
            if (b) b.style.display = b.style.display === "grid" ? "none" : "grid";
          };
        }
      }
    }
  }

  window.addEventListener("scroll", initWaUI);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", initWaUI);
    window.visualViewport.addEventListener("scroll", initWaUI);
  }
  setInterval(initWaUI, 200);
})();
