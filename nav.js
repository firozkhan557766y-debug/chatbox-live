(function () {
  const allThemes = [
    { grad: "linear-gradient(135deg, #1DE9B6 0%, #2979FF 100%)", shadow: "rgba(41, 121, 255, 0.35)" },
    { grad: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", shadow: "rgba(142, 45, 226, 0.35)" },
    { grad: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", shadow: "rgba(17, 153, 142, 0.35)" },
    { grad: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", shadow: "rgba(15, 23, 42, 0.4)" }
  ];

  const tIdx = parseInt(localStorage.getItem("chatbox_theme_idx") || "0");
  const customGrad = localStorage.getItem("chatbox_theme_grad");
  const currentTheme = allThemes[tIdx] || allThemes;
  const activeGrad = customGrad || currentTheme.grad;
  const activeShadow = currentTheme.shadow;

  const headerSelectors = ".top, .top-bar, .header, .banner, .hero-header";
  document.querySelectorAll(headerSelectors).forEach(el => {
    el.style.background = activeGrad;
  });

  const path = window.location.pathname.toLowerCase();
  const isChat = path.includes("third.html");
  const isStatus = path.includes("status.html");
  const isCalls = path.includes("calls.html");
  const isSettings = path.includes("setting.html") || path.includes("six.html");

  function makeTab(active, svg, label, link) {
    const iconColor = active ? "#ffffff" : "#64748b";
    const pillStyle = active
      ? `background:${activeGrad}; color:#ffffff; padding:9px 16px; border-radius:20px; box-shadow:0 6px 16px ${activeShadow};`
      : `background:transparent; color:#64748b; padding:9px 12px; border-radius:20px;`;

    return `<a href="${link}" style="text-decoration:none; display:flex; align-items:center; gap:6px; font-family:'Segoe UI',sans-serif; font-size:12px; font-weight:700; transition:all 0.25s ease; ${pillStyle}">
      ${svg.replace(/COL/g, iconColor)}
      ${active ? `<span>${label}</span>` : ""}
    </a>`;
  }

  const chatSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="COL" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
  const statusSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="COL" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" stroke-dasharray="14 4"/><circle cx="12" cy="12" r="3.5" fill="COL"/></svg>`;
  const callSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="COL" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
  const setSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="COL" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;

  const floatingNav = `
    <div style="height:125px; width:100%; clear:both;"></div>
    <div id="cbFloatingBar" style="position:fixed; bottom:0px; left:0px; right:0px; max-width:440px; margin:0 auto; background:rgba(255,255,255,0.95); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-radius:0px; padding:7px 10px; display:flex; justify-content:space-between; align-items:center; border:1px solid #e2e8f0; box-shadow:0 10px 30px rgba(15,23,42,0.12); z-index:9999;">
      ${makeTab(isChat, chatSvg, "Chats", "third.html")}
      ${makeTab(isStatus, statusSvg, "Status", "status.html")}
      ${makeTab(isCalls, callSvg, "Calls", "calls.html")}
      ${makeTab(isSettings, setSvg, "Settings", "setting.html")}
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", floatingNav);

  document.querySelectorAll("button, a, div").forEach(el => {
    const st = window.getComputedStyle(el);
    if (st.position === "fixed" && el.id !== "cbFloatingBar" && el.id !== "liveCallScreen" && parseInt(st.bottom) < 85) {
      el.style.setProperty("bottom", "92px", "important");
    }
  });
    // बिना किसी हैंग (0% Lag) के 60fps स्मूथ स्वाइप सिस्टम
  
})();
