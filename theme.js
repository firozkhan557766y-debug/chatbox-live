(function () {
  const themes = [
    { grad: "linear-gradient(135deg, #1DE9B6 0%, #2979FF 100%)", accent: "#2979FF", bg: "#f1f5f9", card: "#ffffff", text: "#0f172a", sub: "#64748b", border: "#e2e8f0" },
    { grad: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", accent: "#8E2DE2", bg: "#f5f3ff", card: "#ffffff", text: "#1e1b4b", sub: "#6b7280", border: "#e5e7eb" },
    { grad: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", accent: "#11998e", bg: "#ecfdf5", card: "#ffffff", text: "#064e3b", sub: "#4b5563", border: "#d1fae5" },
    { grad: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", accent: "#38bdf8", bg: "#0b141a", card: "#111b21", text: "#e9edef", sub: "#8696a0", border: "#202c33" }
  ];

  const idx = parseInt(localStorage.getItem("chatbox_theme_idx") || "0");
  const t = themes[idx] || themes;

  const style = document.createElement("style");
  style.innerHTML = `
    :root {
      --primary-grad: ${t.grad};
      --accent-color: ${t.accent};
      --bg-color: ${t.bg};
      --card-bg: ${t.card};
      --text-main: ${t.text};
      --text-sub: ${t.sub};
      --border-col: ${t.border};
    }
    body {
      background: ${t.bg} !important;
      color: ${t.text} !important;
    }
    .top, .top-bar, .header, .banner, .hero-header {
      background: ${t.grad} !important;
      color: #ffffff !important;
    }
    .card, .modern-card, .call-card, .u-card, .sec-card, .hero-card, .setting-item, .chat-item, .req-card, .sheet, .m-sheet {
      background: ${t.card} !important;
      color: ${t.text} !important;
      border-color: ${t.border} !important;
    }
    h1, h2, h3, h4, b, .r-title {
      color: inherit;
    }
    .r-sub, small, p {
      color: ${t.sub};
    }
    .p-btn, .main-btn, .m-btn, .fab-call, .req-btn {
      background: ${t.grad} !important;
      color: #ffffff !important;
    }
  `;
  document.head.appendChild(style);
})();
