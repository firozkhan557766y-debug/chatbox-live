(function () {
  const style = document.createElement("style");
  style.innerHTML = `
    *, *::before, *::after {
      -webkit-tap-highlight-color: transparent !important;
      -webkit-touch-callout: none !important;
      outline: none !important;
    }
    button, a, div, span, input, img, svg {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
    }
    button:active, a:active, .chat-item:active, .msg:active {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
})();
