(function () {
  const style = document.createElement("style");
  style.innerHTML = `
    /* सभी मुख्य पेजों के Top Bar को एकदम सीधा और एक जैसा बनाना */
    header, .header, .top-bar, .navbar, .app-header, .calls-header {
      height: 60px !important;
      min-height: 60px !important;
      max-height: 60px !important;
      border-radius: 0 !important;
      padding: 0 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 900 !important;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06) !important;
    }

    /* हेडर के अंदर के टाइटल को एक ही सीधी लाइन में रखना */
    header h1, .header h1, .top-bar h1, .top-title, .app-title {
      font-size: 21px !important;
      font-weight: 700 !important;
      margin: 0 !important;
      line-height: 1 !important;
      display: flex !important;
      align-items: center !important;
    }

    /* दाईं तरफ के आइकन और 3-Dot बटन को एक ही सीधी रेखा में अलाइन करना */
    .header-actions, .top-icons, .nav-icons {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }

    #cbPageDotBtn {
      top: 11px !important;
      right: 12px !important;
      height: 38px !important;
      width: 38px !important;
    }
  `;
  document.head.appendChild(style);
})();
