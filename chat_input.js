(function () {
  function setupWhatsAppAttachments() {
    if (document.getElementById("waRealAttachWrap")) return;

    const wrap = document.createElement("div");
    wrap.id = "waRealAttachWrap";
    wrap.innerHTML = `
      <div id="waRealMenu" style="display:none;position:fixed;bottom:68px;left:12px;right:12px;background:var(--card-bg,#ffffff);border-radius:18px;padding:18px 12px;box-shadow:0 10px 30px rgba(0,0,0,0.22);z-index:100000;grid-template-columns:repeat(3,1fr);gap:14px;text-align:center;">
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#7f66ff;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(127,102,255,0.35);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <span style="font-size:12px;color:var(--text-main,#0f172a);font-weight:600;">Document</span>
          <input type="file" id="waPickDoc" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#ff2e74;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(255,46,116,0.35);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <span style="font-size:12px;color:var(--text-main,#0f172a);font-weight:600;">Camera</span>
          <input type="file" accept="image/*" capture="environment" id="waPickCam" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#bf59cf;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(191,89,207,0.35);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <span style="font-size:12px;color:var(--text-main,#0f172a);font-weight:600;">Gallery</span>
          <input type="file" accept="image/*,video/*" id="waPickGal" style="display:none;">
        </label>
      </div>
    `;
    document.body.appendChild(wrap);
        const menu = document.getElementById("waRealMenu");
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#waRealMenu") && !e.target.closest("#waPinTrigger")) {
        menu.style.display = "none";
      }
    });

    ["waPickDoc", "waPickCam", "waPickGal"].forEach((id) => {
      const picker = document.getElementById(id);
      if (!picker) return;
      picker.addEventListener("change", function () {
        const file = this.files && this.files;
        if (!file) return;
        menu.style.display = "none";
        const area = document.querySelector("#chatArea, .chat-area, .chat");
        const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const reader = new FileReader();
        reader.onload = function (ev) {
          if (area) {
            const b = document.createElement("div");
            b.className = "msg out";
            b.style.cssText = "align-self:flex-end;background:var(--chatbox-custom-bubble-bg,#008069);color:#fff;padding:6px 8px;border-radius:14px 14px 4px 14px;max-width:75%;margin:4px 0;font-size:13.5px;box-shadow:0 1px 2px rgba(0,0,0,0.12);";
            if (file.type.startsWith("image/")) {
              b.innerHTML = `<img src="${ev.target.result}" style="max-width:210px;border-radius:10px;display:block;margin-bottom:4px;"><div style="text-align:right;font-size:10px;opacity:0.85;">${t} ✓</div>`;
            } else if (file.type.startsWith("video/")) {
              b.innerHTML = `<video src="${ev.target.result}" controls style="max-width:210px;border-radius:10px;display:block;margin-bottom:4px;"></video><div style="text-align:right;font-size:10px;opacity:0.85;">${t} ✓</div>`;
            } else {
              const sizeKB = Math.max(1, Math.round(file.size / 1024));
              b.innerHTML = `<div style="display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.15);padding:8px 10px;border-radius:10px;margin-bottom:3px;"><span style="font-size:20px;">📄</span><div><div style="font-weight:600;word-break:break-all;">${file.name}</div><div style="font-size:11px;opacity:0.8;">${sizeKB} KB • Document</div></div></div><div style="text-align:right;font-size:10px;opacity:0.85;">${t} ✓</div>`;
            }
            area.appendChild(b);
            area.scrollTop = area.scrollHeight;
          }
          if (window.socket) {
            window.socket.emit("private_message", { to: localStorage.getItem("active_chat_user"), text: file.type.startsWith("image/") ? "📷 Photo" : "📄 " + file.name, media: ev.target.result, fileName: file.name, time: t });
          }
        };
        reader.readAsDataURL(file);
        this.value = "";
      });
    });
  }

  function lockChatUI() {
    setupWhatsAppAttachments();
    const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
    if (hdr) {
      hdr.style.cssText = "position:fixed !important;top:0px !important;left:0px !important;right:0px !important;height:60px !important;display:flex !important;align-items:center !important;justify-content:space-between !important;z-index:99999 !important;visibility:visible !important;opacity:1 !important;";
    }

    const inp = document.querySelector('input[placeholder*="Type a message"], input[placeholder="Message"], #msgInput');
    if (inp) {
      inp.placeholder = "Message";
      inp.style.setProperty("display", "block", "important");
      inp.style.setProperty("visibility", "visible", "important");
      inp.style.setProperty("opacity", "1", "important");

      const bar = inp.closest(".input-area, .chat-input, .message-input-wrap, footer") || (inp.parentElement && inp.parentElement.parentElement ? inp.parentElement.parentElement : inp.parentElement);
      if (bar && bar.tagName !== "BODY") {
        bar.style.setProperty("position", "fixed", "important");
        bar.style.setProperty("bottom", "0px", "important");
        bar.style.setProperty("left", "0px", "important");
        bar.style.setProperty("right", "0px", "important");
        bar.style.setProperty("width", "100%", "important");
        bar.style.setProperty("display", "flex", "important");
        bar.style.setProperty("align-items", "center", "important");
        bar.style.setProperty("z-index", "99999", "important");
        bar.style.setProperty("visibility", "visible", "important");
        bar.style.setProperty("opacity", "1", "important");

        if (!document.getElementById("waPinTrigger")) {
          const pin = document.createElement("button");
          pin.id = "waPinTrigger";
          pin.type = "button";
          pin.innerHTML = `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;
          pin.style.cssText = "background:none;border:none;color:#64748b;padding:6px 8px;cursor:pointer;display:flex;align-items:center;flex-shrink:0;";
          pin.onclick = (e) => {
            e.stopPropagation();
            const m = document.getElementById("waRealMenu");
            if (m) m.style.display = m.style.display === "grid" ? "none" : "grid";
          };
          inp.parentElement.appendChild(pin);
        }
      }
    }
    document.body.style.setProperty("padding-top", "64px", "important");
    document.body.style.setProperty("padding-bottom", "74px", "important");
  }

  document.addEventListener("DOMContentLoaded", lockChatUI);
  window.addEventListener("load", lockChatUI);
  window.addEventListener("resize", lockChatUI);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", lockChatUI);
  setInterval(lockChatUI, 200);
})();
