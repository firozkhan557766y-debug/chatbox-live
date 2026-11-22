(function () {
  function initWhatsAppChatBar() {
    const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
    if (hdr) {
      hdr.style.cssText = "position:fixed !important;top:0 !important;left:0 !important;right:0 !important;height:60px !important;display:flex !important;align-items:center !important;justify-content:space-between !important;z-index:9999 !important;visibility:visible !important;opacity:1 !important;";
    }
    document.body.style.setProperty("padding-top", "64px", "important");
    document.body.style.setProperty("padding-bottom", "74px", "important");

    const oldBar = document.getElementById("waSlimInputWrap");
    if (oldBar) oldBar.remove();

    const wrap = document.createElement("div");
    wrap.id = "waSlimInputWrap";
    wrap.innerHTML = `
      <div id="waAttachMenu" style="display:none;position:fixed;bottom:70px;left:12px;right:12px;background:var(--card-bg,#fff);border-radius:18px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,0.22);z-index:10000;grid-template-columns:repeat(3,1fr);gap:14px;text-align:center;">
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:46px;height:46px;border-radius:50%;background:#7f66ff;color:#fff;display:flex;align-items:center;justify-content:center;">📄</div>
          <span style="font-size:12px;font-weight:600;">Document</span>
          <input type="file" id="waDocPick" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:46px;height:46px;border-radius:50%;background:#ff2e74;color:#fff;display:flex;align-items:center;justify-content:center;">📷</div>
          <span style="font-size:12px;font-weight:600;">Camera</span>
          <input type="file" accept="image/*" capture="environment" id="waCamPick" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:46px;height:46px;border-radius:50%;background:#bf59cf;color:#fff;display:flex;align-items:center;justify-content:center;">🖼️</div>
          <span style="font-size:12px;font-weight:600;">Gallery</span>
          <input type="file" accept="image/*,video/*" id="waGalPick" style="display:none;">
        </label>
      </div>
      <div style="position:fixed;bottom:0;left:0;right:0;padding:8px 10px;display:flex;align-items:center;gap:8px;z-index:9998;">
        <div style="flex:1;display:flex;align-items:center;background:var(--card-bg,#fff);border-radius:26px;padding:4px 12px;box-shadow:0 2px 10px rgba(0,0,0,0.12);min-height:46px;">
          <input type="text" id="waMsgInput" placeholder="Message" autocomplete="off" style="flex:1;border:none;outline:none;background:transparent;font-size:15.5px;color:var(--text-main,#0f172a);">
          <button type="button" id="waAttachBtn" style="background:none;border:none;color:#64748b;padding:6px;cursor:pointer;">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
        </div>
        <button type="button" id="waSendMicBtn" style="width:46px;height:46px;border-radius:50%;border:none;background:#008069;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,128,105,0.35);cursor:pointer;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>`;
    document.body.appendChild(wrap);
        const inp = document.getElementById("waMsgInput");
    const sendBtn = document.getElementById("waSendMicBtn");
    const attBtn = document.getElementById("waAttachBtn");
    const attMenu = document.getElementById("waAttachMenu");

    attBtn.onclick = (e) => { e.stopPropagation(); attMenu.style.display = attMenu.style.display === "grid" ? "none" : "grid"; };
    document.addEventListener("click", (e) => { if (!e.target.closest("#waAttachMenu") && !e.target.closest("#waAttachBtn")) attMenu.style.display = "none"; });

    function sendNow() {
      const txt = inp.value.trim();
      if (!txt) return;
      if (typeof window.sendMessage === "function") {
        const old = document.getElementById("msgInput");
        if (old) old.value = txt;
        window.sendMessage(txt);
      } else {
        const area = document.querySelector("#chatArea, .chat-area, .chat");
        const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (area) {
          const b = document.createElement("div");
          b.className = "msg out";
          b.style.cssText = "align-self:flex-end;background:#008069;color:#fff;padding:6px 10px;border-radius:14px 14px 4px 14px;max-width:78%;margin:4px 0;font-size:14.5px;";
          b.innerHTML = `${txt} <span style="font-size:10.5px;opacity:0.8;margin-left:6px;">${t} ✓</span>`;
          area.appendChild(b); area.scrollTop = area.scrollHeight;
        }
        const u = (localStorage.getItem("active_chat_user") || "").toLowerCase().replace("@", "");
        if (u) localStorage.setItem("cb_latest_msg_" + u, JSON.stringify({ text: txt, time: t, sender: "me", ts: Date.now() }));
        if (window.socket) window.socket.emit("private_message", { to: localStorage.getItem("active_chat_user"), text: txt, time: t });
      }
      inp.value = "";
    }

    sendBtn.onclick = sendNow;
    inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); sendNow(); } };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initWhatsAppChatBar);
  else initWhatsAppChatBar();
  document.querySelectorAll("footer, .chat-input, .input-area, .message-input-wrap").forEach(el => {
  if (!el.closest("#waSlimInputWrap")) el.style.display = "none";
});
  
})();

