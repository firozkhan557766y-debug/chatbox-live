(function () {
  function fixChatScreen() {
    // 1. ऊपर के हेडर को हमेशा सबसे ऊपर लॉक और विज़िबल रखना
    const hdr = document.querySelector("header, .header, .top-bar, .chat-header");
    if (hdr) {
      hdr.style.setProperty("position", "fixed", "important");
      hdr.style.setProperty("top", "0px", "important");
      hdr.style.setProperty("left", "0px", "important");
      hdr.style.setProperty("right", "0px", "important");
      hdr.style.setProperty("height", "60px", "important");
      hdr.style.setProperty("display", "flex", "important");
      hdr.style.setProperty("align-items", "center", "important");
      hdr.style.setProperty("justify-content", "space-between", "important");
      hdr.style.setProperty("z-index", "99999", "important");
      hdr.style.setProperty("visibility", "visible", "important");
      hdr.style.setProperty("opacity", "1", "important");
    }
    document.body.style.setProperty("padding-top", "64px", "important");

    // 2. पुराने वाले इनपुट बार को ही असली WhatsApp स्लिम बार में सजाना (ताकि डबल बार न बने)
    const inp = document.querySelector('input[placeholder*="Type a message"], #msgInput');
    if (inp) {
      inp.placeholder = "Message";
      const bar = inp.parentElement && inp.parentElement.parentElement ? inp.parentElement.parentElement : inp.parentElement;
      if (bar) {
        bar.style.setProperty("position", "fixed", "important");
        bar.style.setProperty("bottom", "0px", "important");
        bar.style.setProperty("left", "0px", "important");
        bar.style.setProperty("right", "0px", "important");
        bar.style.setProperty("z-index", "99998", "important");
        bar.style.setProperty("padding", "6px 10px", "important");
      }
    }
  }

  document.addEventListener("DOMContentLoaded", fixChatScreen);
  window.addEventListener("load", fixChatScreen);
  setInterval(fixChatScreen, 300);
})();
