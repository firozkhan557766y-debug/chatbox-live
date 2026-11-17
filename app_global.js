(function () {
  // यहाँ भविष्य में पूरे ऐप के लिए जो भी नया कोड लिखेंगे, वही चलेगा
})();// === GLOBAL APP UI & LIVE FIX (CHATBOX) ===
(function () {
  // 1. पूरे ऐप के लिए सर्विस वर्कर रजिस्टर करना
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 2. चैट स्क्रीन (for.html) के ऊपर वाले हेडर बार को हमेशा विज़िबल और सही रखना
    if (window.location.pathname.includes("for.html")) {
      const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
      if (hdr) {
        hdr.style.cssText =
          "display:flex !important;align-items:center;justify-content:space-between;position:sticky !important;top:0 !important;left:0;right:0;height:60px !important;padding:0 12px;background:var(--primary-grad,#008069) !important;color:#fff !important;z-index:9999 !important;visibility:visible !important;opacity:1 !important;";
      }
      const chatName = localStorage.getItem("active_chat_name") || "Chat";
      const nameEl = document.querySelector("#chatName, .chat-name, .user-name, header b, header h3, .header b");
      if (nameEl && !nameEl.innerText.trim()) nameEl.innerText = chatName;
    }

    // 3. पूरे ऐप के चैट बबल्स को असली स्लिम WhatsApp लुक और रंग देना
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
  });
})();

