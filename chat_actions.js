(function () {
  const pinIco = `<span class="cb-tag" style="display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;border-radius:6px;background:rgba(56,189,248,0.18);color:#0284c7;margin-right:6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3H8v2h1v5l-2 2v2h4v7l1 1 1-1v-7h4v-2l-2-2V5h1V3z"/></svg></span>`;
  const muteIco = `<span class="cb-tag" style="display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;border-radius:6px;background:rgba(245,158,11,0.18);color:#d97706;margin-right:6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg></span>`;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="selTopBar" style="display:none;position:fixed;top:12px;left:14px;right:14px;max-width:440px;margin:0 auto;background:rgba(15,23,42,0.96);backdrop-filter:blur(16px);color:#fff;padding:11px 15px;border-radius:24px;justify-content:space-between;align-items:center;z-index:99999;border:1px solid rgba(255,255,255,0.16);box-shadow:0 16px 40px rgba(15,23,42,0.45);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div id="btnCancelSel" style="width:36px;height:36px;border-radius:13px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
        <span id="selCountText" style="background:linear-gradient(135deg,#00F5D4,#2979FF);color:#0f172a;font-weight:900;font-size:13px;padding:5px 12px;border-radius:13px;">1 Selected</span>
      </div>
      <div style="display:flex;align-items:center;gap:9px;">
        <div id="btnActPin" style="width:40px;height:40px;border-radius:14px;background:rgba(56,189,248,0.16);border:1px solid rgba(56,189,248,0.35);display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg></div>
        <div id="btnActMute" style="width:40px;height:40px;border-radius:14px;background:rgba(251,191,36,0.16);border:1px solid rgba(251,191,36,0.35);display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg></div>
        <div id="btnActDel" style="width:40px;height:40px;border-radius:14px;background:rgba(239,68,68,0.22);border:1px solid rgba(239,68,68,0.45);display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div>
      </div>
    </div>
    <div id="luxDeleteModal" style="display:none;position:fixed;inset:0;background:rgba(15,23,42,0.72);backdrop-filter:blur(8px);justify-content:center;align-items:center;padding:20px;z-index:100000;">
      <div style="background:#fff;width:100%;max-width:330px;border-radius:28px;padding:24px 20px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.4);">
        <div style="width:62px;height:62px;border-radius:22px;background:#fee2e2;color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div>
        <h3 style="font-size:19px;color:#0f172a;font-weight:800;">Delete Selected Chat?</h3>
        <p id="delModalDesc" style="font-size:13px;color:#64748b;margin-top:6px;">This chat will be permanently removed.</p>
        <div style="display:flex;gap:10px;margin-top:20px;">
          <button id="btnDelCancel" style="flex:1;padding:13px;border:none;border-radius:14px;background:#f1f5f9;color:#475569;font-weight:700;">Cancel</button>
          <button id="btnDelConfirm" style="flex:1;padding:13px;border:none;border-radius:14px;background:#ef4444;color:#fff;font-weight:700;">Yes, Delete</button>
        </div>
      </div>
    </div>
  `);

  let sel = new Set(), tmr = null;
  const bar = document.getElementById("selTopBar"), box = document.getElementById("luxDeleteModal");

  function getUid(c) {
    if (c.dataset.uid) return c.dataset.uid;
    const nameEl = c.querySelector(".chat-name, h3, h4, b");
    const cleanName = nameEl ? nameEl.innerText.trim().toLowerCase().replace(/[^a-z0-9]/g, "_") : "";
    c.dataset.uid = cleanName || ("item_" + Math.random().toString(36).slice(2, 7));
    return c.dataset.uid;
  }

  function applyMeta(c) {
    const uid = getUid(c);
    const m = JSON.parse(localStorage.getItem("cb_meta_" + uid) || "{}");
    if (m.del) {
      c.style.setProperty("display", "none", "important");
      return;
    }

    const container = document.getElementById("chatContainer") || c.parentElement;
    if (container) {
      container.style.display = "flex";
      container.style.flexDirection = "column";
      const lbl = container.querySelector(".section-label");
      if (lbl) lbl.style.order = "-100";
    }
    c.style.order = m.pin ? "-50" : "0";

    const t = c.querySelector(".chat-name, h3, h4, b");
    if (t) {
      t.querySelectorAll(".cb-tag").forEach(x => x.remove());
      t.insertAdjacentHTML("afterbegin", (m.pin ? pinIco : "") + (m.mute ? muteIco : ""));
    }
  }

  function clearAll() {
    sel.forEach(c => { c.style.background = ""; c.style.boxShadow = ""; });
    sel.clear();
    bar.style.display = "none";
  }

  function toggleCard(c) {
    if (sel.has(c)) { sel.delete(c); c.style.background = ""; c.style.boxShadow = ""; }
    else { sel.add(c); c.style.background = "rgba(41,121,255,0.18)"; c.style.boxShadow = "inset 4px 0 0 #2979FF"; }
    bar.style.display = sel.size > 0 ? "flex" : "none";
    document.getElementById("selCountText").innerText = sel.size + " Selected";
  }

  function runAct(act) {
    sel.forEach(c => {
      const uid = getUid(c);
      let m = JSON.parse(localStorage.getItem("cb_meta_" + uid) || "{}");
      if (act === "pin") m.pin = !m.pin;
      if (act === "mute") m.mute = !m.mute;
            if (act === "del") {
        m.del = true;
        c.style.setProperty("display", "none", "important");
        const oc = c.getAttribute("onclick") || "";
        const uMatch = oc.match(/@[a-zA-Z0-9_]+/);
        const targetUser = uMatch ? uMatch[0].toLowerCase() : uid;

        localStorage.removeItem("cb_saved_chat_" + targetUser);
        localStorage.removeItem("chat_history_" + targetUser);

        let dList = JSON.parse(localStorage.getItem("cb_direct_friends") || "[]");
        dList = dList.filter(x => (x.username || "").toLowerCase() !== targetUser && (x.name || "").toLowerCase() !== uid);
        localStorage.setItem("cb_direct_friends", JSON.stringify(dList));

        let aList = JSON.parse(localStorage.getItem("chatbox_accepted_friends") || "[]");
        aList = aList.filter(x => x.toLowerCase() !== targetUser);
        localStorage.setItem("chatbox_accepted_friends", JSON.stringify(aList));
      }

      localStorage.setItem("cb_meta_" + uid, JSON.stringify(m));
      if (act !== "del") applyMeta(c);
    });
    clearAll();
  }

  document.getElementById("btnCancelSel").onclick = clearAll;
  document.getElementById("btnActPin").onclick = () => runAct("pin");
  document.getElementById("btnActMute").onclick = () => runAct("mute");
  document.getElementById("btnActDel").onclick = () => {
    document.getElementById("delModalDesc").innerText = `Delete ${sel.size} selected chat(s)?`;
    box.style.display = "flex";
  };
  document.getElementById("btnDelCancel").onclick = () => box.style.display = "none";
  document.getElementById("btnDelConfirm").onclick = () => {
    box.style.display = "none";
    runAct("del");
  };

  document.addEventListener("touchstart", e => {
    const c = e.target.closest(".chat-item");
    if (!c) return;
    tmr = setTimeout(() => { if (navigator.vibrate) navigator.vibrate(45); toggleCard(c); }, 380);
  }, { passive: true });
  document.addEventListener("touchend", () => clearTimeout(tmr), { passive: true });
  document.addEventListener("touchmove", () => clearTimeout(tmr), { passive: true });
  document.addEventListener("contextmenu", e => { if (e.target.closest(".chat-item")) e.preventDefault(); });
  document.addEventListener("click", e => {
    if (sel.size > 0) {
      const c = e.target.closest(".chat-item");
      if (c) { e.preventDefault(); e.stopImmediatePropagation(); toggleCard(c); }
    }
  }, true);

  setInterval(() => {
    document.querySelectorAll(".chat-item").forEach(applyMeta);
  }, 350);
  // पिन (📎) बटन पर असली WhatsApp अटैचमेंट मेन्यू जोड़ना
const pinIcon = document.querySelector(".input-area button, .chat-input button, footer button, .attach-btn");
if (pinIcon && !pinIcon.dataset.waMenuReady) {
  pinIcon.dataset.waMenuReady = "1";
  pinIcon.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const box = document.getElementById("waAttachBox");
    if (box) box.style.display = box.style.display === "grid" ? "none" : "grid";
  }, true);
}
  
})();
