// 1. सभी पुराने Back बटन (←) को ढूँढकर तुरंत प्रीमियम SVG तीर में बदलना
const backBtns = document.querySelectorAll(".back-btn, .back-link, .close-viewer");

backBtns.forEach(btn => {
  if (btn.textContent.includes("←")) {
    btn.style.width = "38px";
    btn.style.height = "38px";
    btn.style.borderRadius = "12px";
    btn.style.background = "rgba(255, 255, 255, 0.22)";
    btn.style.display = "inline-flex";
    btn.style.justifyContent = "center";
    btn.style.alignItems = "center";
    btn.style.marginRight = "12px";
    btn.style.textDecoration = "none";
    btn.style.backdropFilter = "blur(4px)";
    btn.style.flexShrink = "0";

    const isLightBg = window.location.pathname.includes("sec.html");
    const strokeColor = isLightBg ? "#2979FF" : "white";
    if (isLightBg) {
      btn.style.background = "#e0f2fe";
    }

    btn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    `;
  }
});

// 2. चैट स्क्रीन (for.html) के Send बटन (➤) को पेपर-प्लेन बनाना
const sendBtns = document.querySelectorAll(".send-btn");
sendBtns.forEach(btn => {
  if (btn.textContent.includes("➤")) {
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="margin-left: -2px;">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    `;
  }
});
