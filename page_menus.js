(function () {
  const path = window.location.pathname.toLowerCase();
  const isStatus = path.includes("status");
  const isCalls = path.includes("calls");
  if (!isStatus && !isCalls) return;

  const style = document.createElement("style");
  style.innerHTML = `
    #cbPageDotBtn {
      position: fixed; top: 11px; right: 12px; width: 38px; height: 38px;
      border-radius: 50%; border: none; background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 9995;
    }
    #cbPageDrop {
      display: none; position: fixed; top: 54px; right: 14px; width: 205px;
      background: #ffffff; border-radius: 18px; padding: 8px 0;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.25); z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .cb-pm-item {
      padding: 13px 18px; font-size: 15px; font-weight: 500; color: #0f172a;
      display: flex; align-items: center; justify-content: space-between; cursor: pointer;
    }
    .cb-pm-item:active { background: #f1f5f9; }
  `;
  document.head.appendChild(style);

  const items = isStatus
    ? `<div class="cb-pm-item" onclick="if(window.showAppAlert)showAppAlert('Status Privacy: Only Accepted Friends can view your updates.')">Status privacy</div>
       <div class="cb-pm-item" onclick="window.location.href='starred.html'">Starred</div>
       <div class="cb-pm-item" onclick="window.location.href='setting.html'"><span>Settings</span><span style="width:8px;height:8px;border-radius:50%;background:#25D366;"></span></div>`
    : `<div class="cb-pm-item" id="pmClearCallLog">Clear call log</div>
       <div class="cb-pm-item" onclick="window.location.href='setting.html'"><span>Settings</span><span style="width:8px;height:8px;border-radius:50%;background:#25D366;"></span></div>`;

  document.body.insertAdjacentHTML("beforeend", `
    <button id="cbPageDotBtn" title="Menu">
      <svg width="22" height="22" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2.2" fill="#ffffff"/>
        <circle cx="12" cy="12" r="2.2" fill="#ffffff"/>
        <circle cx="12" cy="19" r="2.2" fill="#ffffff"/>
      </svg>
    </button>
    <div id="cbPageDrop">${items}</div>
  `);

  const pill = document.getElementById("pPill");
  if (pill) {
    pill.style.marginRight = "36px";
    pill.style.setProperty("color", "#ffffff", "important");
    pill.style.setProperty("background", "rgba(255, 255, 255, 0.16)", "important");
  }

  const btn = document.getElementById("cbPageDotBtn");
  const drop = document.getElementById("cbPageDrop");
  btn.onclick = e => { e.stopPropagation(); drop.style.display = drop.style.display === "block" ? "none" : "block"; };
  document.addEventListener("click", () => { drop.style.display = "none"; });

  const clr = document.getElementById("pmClearCallLog");
  if (clr) {
    clr.onclick = () => {
      if (typeof window.clearLogs === "function") window.clearLogs();
      else if (window.showAppConfirm) showAppConfirm("Clear all call history?", true, "Clear").then(y => { if (y) { localStorage.setItem("chatbox_call_logs", "[]"); location.reload(); } });
    };
  }
})();

