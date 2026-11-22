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

