(function () {
  function buildCleanWhatsAppChat() {
    // 1. ऊपर के हेडर और 3-डॉट मेन्यू को सुरक्षित और स्थिर रखना (बिना छेड़े)
    const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
    if (hdr) {
      hdr.style.position = "fixed";
      hdr.style.top = "0px";
      hdr.style.left = "0px";
      hdr.style.right = "0px";
      hdr.style.zIndex = "9990";
    }
    document.body.style.paddingTop = "64px";
    document.body.style.paddingBottom = "76px";

    // 2. पुराने वाले खराब इनपुट बार को हमेशा के लिए गायब करना
    document.querySelectorAll('input[placeholder*="Type a message"], #msgInput').forEach((oldIn) => {
      if (oldIn.id === "waNewMsgBox") return;
      const oldBar = oldIn.closest(".input-area, .chat-input, .message-input-wrap, footer") || oldIn.parentElement;
      if (oldBar && oldBar.id !== "waNewInputWrap") {
        oldBar.style.setProperty("display", "none", "important");
      }
    });

    if (document.getElementById("waNewInputWrap")) return;

    // 3. बिल्कुल नया असली WhatsApp स्टाइल इनपुट बार और अटैचमेंट पॉप-अप बनाना
    const ui = document.createElement("div");
    ui.id = "waNewInputWrap";
    ui.innerHTML = `
      <div id="waCleanAttach" style="display:none;position:fixed;bottom:70px;left:12px;right:12px;background:var(--card-bg,#ffffff);border-radius:18px;padding:18px 12px;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:10000;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#7f66ff;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(127,102,255,0.35);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <span style="font-size:12px;font-weight:600;color:var(--text-main,#111827);">Document</span>
          <input type="file" id="waNewDoc" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#ff2e74;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(255,46,116,0.35);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <span style="font-size:12px;font-weight:600;color:var(--text-main,#111827);">Camera</span>
          <input type="file" accept="image/*" capture="environment" id="waNewCam" style="display:none;">
        </label>
        <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#bf59cf;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(191,89,207,0.35);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <span style="font-size:12px;font-weight:600;color:var(--text-main,#111827);">Gallery</span>
          <input type="file" accept="image/*,video/*" id="waNewGal" style="display:none;">
        </label>
      </div>

      <div style="position:fixed;bottom:0;left:0;right:0;padding:8px 10px;display:flex;align-items:center;gap:8px;z-index:9995;background:transparent;">
        <div style="flex:1;display:flex;align-items:center;background:var(--card-bg,#ffffff);border-radius:26px;padding:4px 10px;box-shadow:0 2px 10px rgba(0,0,0,0.14);min-height:46px;">
          <button type="button" id="waCleanEmoji" style="background:none;border:none;color:#64748b;padding:5px;display:flex;align-items:center;cursor:pointer;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </button>
          <input type="text" id="waNewMsgBox" placeholder="Message" autocomplete="off" style="flex:1;border:none;outline:none;background:transparent;font-size:15.5px;color:var(--text-main,#111827);padding:6px;">
          <button type="button" id="waCleanPin" style="background:none;border:none;color:#64748b;padding:6px;display:flex;align-items:center;cursor:pointer;">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <label style="color:#64748b;padding:5px;display:flex;align-items:center;cursor:pointer;margin:0;">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <input type="file" accept="image/*" capture="environment" id="waQuickCam" style="display:none;">
          </label>
        </div>

        <button type="button" id="waCleanSendBtn" style="width:46px;height:46px;border-radius:50%;border:none;background:#008069;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,128,105,0.35);cursor:pointer;flex-shrink:0;">
          <svg id="waIcMic" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          <svg id="waIcSend" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(ui);
        const box = document.getElementById("waNewMsgBox");
    const btn = document.getElementById("waCleanSendBtn");
    const mic = document.getElementById("waIcMic");
    const snd = document.getElementById("waIcSend");
    const pin = document.getElementById("waCleanPin");
    const menu = document.getElementById("waCleanAttach");

    box.oninput = () => {
      const has = box.value.trim().length > 0;
      mic.style.display = has ? "none" : "block";
      snd.style.display = has ? "block" : "none";
    };

    pin.onclick = (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === "grid" ? "none" : "grid";
    };
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#waCleanAttach") && !e.target.closest("#waCleanPin")) menu.style.display = "none";
    });

    function fireSend() {
      const txt = box.value.trim();
      if (!txt) return;
      const area = document.querySelector("#chatArea, .chat-area, .chat");
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const col = localStorage.getItem("chatbox_custom_bubble_bg") || "#008069";
      if (area) {
        const b = document.createElement("div");
        b.className = "msg out";
        b.style.cssText = `align-self:flex-end;background:${col};color:#fff;padding:6px 10px;border-radius:14px 14px 4px 14px;max-width:78%;margin:4px 0;font-size:14.5px;box-shadow:0 1px 2px rgba(0,0,0,0.12);`;
        b.innerHTML = `${txt} <span style="font-size:10.5px;opacity:0.8;margin-left:6px;">${t} ✓</span>`;
        area.appendChild(b);
        area.scrollTop = area.scrollHeight;
      }
      const u = (localStorage.getItem("active_chat_user") || "").toLowerCase().replace("@", "");
      if (u) localStorage.setItem("cb_latest_msg_" + u, JSON.stringify({ text: txt, time: t, sender: "me", ts: Date.now() }));
      if (window.socket) window.socket.emit("private_message", { to: localStorage.getItem("active_chat_user"), text: txt, time: t });
      box.value = "";
      mic.style.display = "block";
      snd.style.display = "none";
    }

    btn.onclick = fireSend;
    box.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); fireSend(); } };

    ["waNewDoc", "waNewCam", "waNewGal", "waQuickCam"].forEach((id) => {
      const inp = document.getElementById(id);
      if (!inp) return;
      inp.onchange = function () {
        const f = this.files && this.files[0];
        if (!f) return;
        menu.style.display = "none";
        const area = document.querySelector("#chatArea, .chat-area, .chat");
        const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const col = localStorage.getItem("chatbox_custom_bubble_bg") || "#008069";
        const r = new FileReader();
        r.onload = (ev) => {
          if (area) {
            const b = document.createElement("div");
            b.className = "msg out";
            b.style.cssText = `align-self:flex-end;background:${col};color:#fff;padding:6px 8px;border-radius:14px 14px 4px 14px;max-width:76%;margin:4px 0;font-size:13.5px;`;
            if (f.type.startsWith("image/")) {
              b.innerHTML = `<img src="${ev.target.result}" style="max-width:210px;border-radius:10px;display:block;margin-bottom:3px;"><div style="text-align:right;font-size:10px;opacity:0.85;">${t} ✓</div>`;
            } else if (f.type.startsWith("video/")) {
              b.innerHTML = `<video src="${ev.target.result}" controls style="max-width:210px;border-radius:10px;display:block;margin-bottom:3px;"></video><div style="text-align:right;font-size:10px;opacity:0.85;">${t} ✓</div>`;
            } else {
              const kb = Math.max(1, Math.round(f.size / 1024));
              b.innerHTML = `<div style="display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.16);padding:8px 10px;border-radius:10px;margin-bottom:3px;"><span style="font-size:20px;">📄</span><div><div style="font-weight:600;word-break:break-all;">${f.name}</div><div style="font-size:11px;opacity:0.8;">${kb} KB • Document</div></div></div><div style="text-align:right;font-size:10px;opacity:0.85;">${t} ✓</div>`;
            }
            area.appendChild(b);
            area.scrollTop = area.scrollHeight;
          }
          if (window.socket) window.socket.emit("private_message", { to: localStorage.getItem("active_chat_user"), text: f.type.startsWith("image/") ? "📷 Photo" : "📄 " + f.name, media: ev.target.result, fileName: f.name, time: t });
        };
        r.readAsDataURL(f);
        this.value = "";
      };
    });
  }

  document.addEventListener("DOMContentLoaded", buildCleanWhatsAppChat);
  window.addEventListener("load", buildCleanWhatsAppChat);
  // 1. पुराने 'Type a message...' वाले बार को जड़ से छिपाना
document.querySelectorAll('input, textarea').forEach(el => {
  if (el.id !== "waNewMsgBox" && (el.placeholder || "").toLowerCase().includes("type a message")) {
    let p = el.parentElement;
    while (p && p.parentElement && p.parentElement.tagName !== "BODY" && !p.parentElement.classList.contains("chat")) {
      p = p.parentElement;
    }
    if (p && p.id !== "waNewInputWrap") p.style.setProperty("display", "none", "important");
  }
});

// 2. कीबोर्ड के ऊपर आने वाली Google Autofill (चाबी/लोकेशन) पट्टी को रोकना
const newBox = document.getElementById("waNewMsgBox");
if (newBox) {
  newBox.setAttribute("name", "chat_msg_random_" + Date.now());
  newBox.setAttribute("autocomplete", "off");
  newBox.setAttribute("autocorrect", "off");
}

// 3. कीबोर्ड खुलने पर भी ऊपर वाले हेडर को स्क्रीन के ठीक ऊपर चिपकाए रखना
function keepHeaderPinned() {
  const topHdr = document.querySelector("header, .header, .top-bar, .chat-header");
  if (topHdr) {
    const vy = window.visualViewport ? window.visualViewport.offsetTop : 0;
    topHdr.style.setProperty("position", "fixed", "important");
    topHdr.style.setProperty("top", vy + "px", "important");
    topHdr.style.setProperty("z-index", "99999", "important");
  }
}
keepHeaderPinned();
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", keepHeaderPinned);
  window.visualViewport.addEventListener("scroll", keepHeaderPinned);
}
window.addEventListener("scroll", keepHeaderPinned);
  
  setInterval(buildCleanWhatsAppChat, 400);
})();
