(function () {
  // 1. WhatsApp जैसा Home 3-Dot Dropdown CSS
  const style = document.createElement("style");
  style.innerHTML = `
    .cb-inline-menu-btn {
      width: 38px; height: 38px; border-radius: 50%; border: none;
      background: rgba(255, 255, 255, 0.22); backdrop-filter: blur(8px);
      color: #ffffff; display: inline-flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0; margin-left: 6px;
    }
    .cb-inline-menu-btn:active { background: rgba(255, 255, 255, 0.35); }
    #cbHomeDrop {
      display: none; position: fixed; top: 64px; right: 16px; width: 220px;
      background: #ffffff; border-radius: 5px; padding: 8px 0;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.22); z-index: 9999;
      transform-origin: top right; animation: cbDropIn 0.16s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .cb-d-item {
      padding: 13px 18px; font-size: 15px; font-weight: 500; color: #0f172a;
      display: flex; align-items: center; justify-content: space-between; cursor: pointer;
    }
    .cb-d-item:active { background: #f1f5f9; }
    #cbGroupPromptBg {
      display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px); justify-content: center; align-items: center;
      padding: 24px; z-index: 2147483647;
    }
    .cb-gp-box {
      background: #ffffff; width: 100%; max-width: 320px; border-radius: 22px;
      padding: 22px 20px 18px 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    }
    @keyframes cbDropIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);

  // 2. घंटी और पैलेट आइकन की लाइन में ही 3-Dot बटन जोड़ना
  const btnHtml = `
    <button id="cbHomeMenuBtn" class="cb-inline-menu-btn" title="Menu">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
      </svg>
    </button>
  `;

  // हेडर के दाईं तरफ वाले आइकन बॉक्स को ढूँढकर उसके अंदर जोड़ना
  const topIcons = document.querySelectorAll("header button, .header button, .top-bar button, .icon-btn, .circle-btn");
  if (topIcons.length > 0) {
    const lastIcon = topIcons[topIcons.length - 1];
    lastIcon.parentElement.appendChild(document.createRange().createContextualFragment(btnHtml));
  } else {
    document.body.insertAdjacentHTML("beforeend", `<div style="position:fixed;top:16px;right:14px;z-index:9995;">${btnHtml}</div>`);
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div id="cbHomeDrop">
      <div class="cb-d-item" id="hmNewGroup">New group</div>
      <div class="cb-d-item" id="hmBroadcast">Broadcast lists</div>
      <div class="cb-d-item" id="hmStarred">Starred messages</div>
      <div class="cb-d-item" id="hmReadAll">Read all</div>
      <div class="cb-d-item" onclick="window.location.href='setting.html'">
        <span>Settings</span>
        <span style="width:8px;height:8px;border-radius:50%;background:#25D366;"></span>
      </div>
    </div>

    <div id="cbGroupPromptBg">
      <div class="cb-gp-box">
        <h3 style="font-size:17px;color:#0f172a;margin-bottom:12px;">Create New Group</h3>
        <input type="text" id="cbNewGpInp" placeholder="Enter group name..." style="width:100%;padding:12px 14px;border-radius:14px;border:1px solid #cbd5e1;font-size:14.5px;outline:none;margin-bottom:16px;">
        <div style="display:flex;gap:10px;">
          <button id="cbGpCancel" style="flex:1;padding:11px;border:none;border-radius:12px;background:#f1f5f9;color:#475569;font-weight:700;cursor:pointer;">Cancel</button>
          <button id="cbGpCreate" style="flex:1;padding:11px;border:none;border-radius:12px;background:#008069;color:#ffffff;font-weight:700;cursor:pointer;">Create</button>
        </div>
      </div>
    </div>
  `);


  const menuBtn = document.getElementById("cbHomeMenuBtn");
  const dropBox = document.getElementById("cbHomeDrop");

  menuBtn.onclick = function (e) {
    e.stopPropagation();
    dropBox.style.display = dropBox.style.display === "block" ? "none" : "block";
  };

  document.addEventListener("click", function () {
    dropBox.style.display = "none";
  });

  // Read All
    // 1. Read All (सभी अनरीड बैज साफ़ करना)
  document.getElementById("hmReadAll").onclick = function () {
    document.querySelectorAll(".unread-badge, .badge").forEach(b => b.style.display = "none");
  };

  // 2. New Group (सीधे आपकी ग्रुप स्क्रीन खोलेगा)
  document.getElementById("hmNewGroup").onclick = function () {
    window.location.href = "groups.html"; // अगर आपकी फाइल का नाम new_group.html है, तो वह लिख दें
  };

  // 3. Broadcast Lists (सीधे आपकी ब्रॉडकास्ट स्क्रीन खोलेगा)
  document.getElementById("hmBroadcast").onclick = function () {
    window.location.href = "broadcast.html"; // अपनी ब्रॉडकास्ट फाइल का नाम लिख दें
  };

  // 4. Starred Messages (सीधे आपकी Starred स्क्रीन खोलेगा)
  document.getElementById("hmStarred").onclick = function () {
    window.location.href = "starred.html"; // अपनी Starred फाइल का नाम लिख दें
  };



  // Starred Messages
  
})();
