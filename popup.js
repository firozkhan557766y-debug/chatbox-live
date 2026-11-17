(function () {
  // आधुनिक कस्टम पॉप-अप के लिए CSS
  const style = document.createElement("style");
  style.innerHTML = `
    #cbCustomModalBg {
      display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px); justify-content: center; align-items: center;
      padding: 24px; z-index: 2147483647; animation: cbFadeIn 0.18s ease-out;
    }
    .cb-modal-box {
      background: #ffffff; width: 100%; max-width: 320px; border-radius: 24px;
      padding: 24px 20px 18px 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
      text-align: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .cb-modal-icon {
      width: 52px; height: 52px; border-radius: 16px; margin: 0 auto 14px auto;
      display: flex; align-items: center; justify-content: center;
      background: #f0fdf4; color: #008069;
    }
    .cb-modal-icon.danger { background: #fee2e2; color: #dc2626; }
    .cb-modal-msg { font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.45; margin-bottom: 20px; }
    .cb-modal-btns { display: flex; gap: 10px; justify-content: center; }
    .cb-m-btn {
      flex: 1; padding: 12px; border: none; border-radius: 14px; font-size: 14px;
      font-weight: 700; cursor: pointer; transition: 0.15s;
    }
    .cb-m-cancel { background: #f1f5f9; color: #475569; }
    .cb-m-ok { background: #008069; color: #ffffff; }
    .cb-m-ok.danger { background: #dc2626; color: #ffffff; }
    @keyframes cbFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);

  // पॉप-अप HTML
  document.body.insertAdjacentHTML("beforeend", `
    <div id="cbCustomModalBg">
      <div class="cb-modal-box">
        <div id="cbModalIco" class="cb-modal-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div id="cbModalTxt" class="cb-modal-msg">Message</div>
        <div class="cb-modal-btns">
          <button id="cbModalCancel" class="cb-m-btn cb-m-cancel">Cancel</button>
          <button id="cbModalOk" class="cb-m-btn cb-m-ok">OK</button>
        </div>
      </div>
    </div>
  `);

  const bg = document.getElementById("cbCustomModalBg");
  const txtEl = document.getElementById("cbModalTxt");
  const icoEl = document.getElementById("cbModalIco");
  const cancelBtn = document.getElementById("cbModalCancel");
  const okBtn = document.getElementById("cbModalOk");

  // 1. नया कस्टम Alert फंक्शन
  window.showAppAlert = function (msg) {
    txtEl.innerText = msg;
    icoEl.className = "cb-modal-icon";
    icoEl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    okBtn.className = "cb-m-btn cb-m-ok";
    okBtn.innerText = "Got it";
    cancelBtn.style.display = "none";
    bg.style.display = "flex";
    okBtn.onclick = () => { bg.style.display = "none"; };
  };

  // 2. नया कस्टम Confirm फंक्शन (Promise आधारित)
  window.showAppConfirm = function (msg, isDanger = true, okText = "Yes, Proceed") {
    return new Promise((resolve) => {
      txtEl.innerText = msg;
      icoEl.className = isDanger ? "cb-modal-icon danger" : "cb-modal-icon";
      icoEl.innerHTML = isDanger
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
      okBtn.className = isDanger ? "cb-m-btn cb-m-ok danger" : "cb-m-btn cb-m-ok";
      okBtn.innerText = okText;
      cancelBtn.style.display = "block";
      bg.style.display = "flex";

      cancelBtn.onclick = () => { bg.style.display = "none"; resolve(false); };
      okBtn.onclick = () => { bg.style.display = "none"; resolve(true); };
    });
  };

  // पुराने alert() को अपने आप नए पॉप-अप में बदलना
  window.alert = function (msg) {
    window.showAppAlert(msg);
  };
})();
