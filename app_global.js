(function () {
  // यहाँ भविष्य में पूरे ऐप के लिए जो भी नया कोड लिखेंगे, वही चलेगा
})();// === GLOBAL APP UI & LIVE FIX (CHATBOX) ===
// === GLOBAL APP UI & LOCKED CHAT HEADER FIX ===
(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }

  function lockForHeader() {
    if (!window.location.pathname.includes("for.html")) return;

    // 1. बॉडी को ऊपर खिसकने से रोकना
    document.documentElement.style.setProperty("overflow-x", "hidden", "important");
    document.body.style.setProperty("margin-top", "0px", "important");
    document.body.style.setProperty("padding-top", "64px", "important");

    // 2. हेडर बार को स्क्रीन के सबसे ऊपर fixed लॉक करना
    const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
    if (hdr) {
      hdr.style.setProperty("position", "fixed", "important");
      hdr.style.setProperty("top", "0px", "important");
      hdr.style.setProperty("left", "0px", "important");
      hdr.style.setProperty("right", "0px", "important");
      hdr.style.setProperty("width", "100%", "important");
      hdr.style.setProperty("height", "60px", "important");
      hdr.style.setProperty("display", "flex", "important");
      hdr.style.setProperty("align-items", "center", "important");
      hdr.style.setProperty("justify-content", "space-between", "important");
      hdr.style.setProperty("z-index", "99999", "important");
      hdr.style.setProperty("transform", "none", "important");
      hdr.style.setProperty("visibility", "visible", "important");
      hdr.style.setProperty("opacity", "1", "important");
    }

    // 3. चैट एरिया को हेडर के ठीक नीचे से शुरू करना
    const area = document.querySelector("#chatArea, .chat-area, .chat");
    if (area) {
      area.style.setProperty("padding-top", "12px", "important");
      area.style.setProperty("margin-top", "0px", "important");
    }
  }

  document.addEventListener("DOMContentLoaded", lockForHeader);
  window.addEventListener("load", lockForHeader);
  // इनपुट बॉक्स लोड होने के बाद भी हेडर को लॉक रखना
  setInterval(lockForHeader, 400);

  // 4. पूरे ऐप के चैट बबल्स को असली स्लिम WhatsApp लुक देना
  setInterval(() => {
    const col = localStorage.getItem("chatbox_custom_bubble_bg") || "#008069";
    document.querySelectorAll(".msg.out, .out").forEach((b) => {
      if (!(b.innerText || "").includes("deleted")) {
        b.style.setProperty("background", col, "important");
        b.style.setProperty("border-radius", "14px 14px 4px 14px", "important");
        b.style.setProperty("padding", "6px 10px", "important");
      }
    });
  }, 300);
})();
