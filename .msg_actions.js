(function () {
  const EMOJIS_MAIN = ["\uD83D\uDC4D", "\u2764\uFE0F", "\uD83D\uDE02", "\uD83D\uDE2E", "\uD83D\uDE22", "\uD83D\uDE4F"];
  const EMOJIS_MORE = ["\uD83D\uDD25", "\uD83C\uDF89", "\uD83D\uDE0D", "\uD83D\uDCAF", "\uD83E\uDD1D", "\uD83E\uDD73", "\uD83E\uDEF6", "\u2728", "\uD83D\uDE0E", "\uD83E\uDD2F", "\uD83D\uDE2D", "\uD83C\uDF39"];

  const starSvg = `<span class="cb-st" style="display:inline-flex;align-items:center;margin-left:5px;color:#eab308;vertical-align:middle;"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>`;
  const delSvg = `<span class="cb-deleted-msg" style="display:inline-flex;align-items:center;gap:6px;font-style:italic;opacity:0.65;font-size:13.5px;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> This message was deleted</span>`;

  const mainPillsHtml = EMOJIS_MAIN.map(e => `<span class="m-em" style="cursor:pointer;padding:2px 4px;">${e}</span>`).join("");
  const morePillsHtml = EMOJIS_MORE.map(e => `<span class="m-em" style="cursor:pointer;padding:4px;">${e}</span>`).join("");

  document.body.insertAdjacentHTML("beforeend", `
    <div id="msgTopBar" style="display:none;position:fixed;top:0;left:0;width:100%;height:60px;background:#075E54;color:#fff;padding:0 14px;justify-content:space-between;align-items:center;z-index:99999;box-shadow:0 2px 10px rgba(0,0,0,0.22);">
      <div style="display:flex;align-items:center;gap:18px;">
        <div id="mX" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></div>
        <span id="mCnt" style="font-size:19px;font-weight:600;">1</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <div id="mRep" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg></div>
        <div id="mStr" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div id="mDel" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div>
        <div id="mCpy" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></div>
        <div id="mShr" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg></div>
      </div>
    </div>

    <div id="msgReactBar" style="display:none;position:fixed;top:68px;left:50%;transform:translateX(-50%);background:#fff;padding:7px 14px;border-radius:30px;gap:10px;align-items:center;z-index:99998;box-shadow:0 4px 20px rgba(0,0,0,0.18);font-size:23px;">
      ${mainPillsHtml}
      <span id="mMoreEm" style="width:30px;height:30px;border-radius:50%;background:#f1f5f9;color:#475569;font-size:20px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;">+</span>
    </div>

    <div id="moreEmojiBox" style="display:none;position:fixed;top:124px;left:50%;transform:translateX(-50%);width:88%;max-width:330px;background:#fff;color:#0f172a;padding:14px;border-radius:20px;z-index:99999;box-shadow:0 10px 35px rgba(0,0,0,0.22);">
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;font-size:23px;margin-bottom:12px;">${morePillsHtml}</div>
      <div style="display:flex;gap:8px;">
        <input type="text" id="customEmInp" placeholder="Pick any emoji from keyboard..." style="flex:1;padding:9px 12px;border-radius:12px;border:1px solid #cbd5e1;background:#f8fafc;color:#0f172a;font-size:14px;outline:none;">
        <button id="sendCustomEm" style="padding:0 16px;border:none;border-radius:12px;background:#075E54;color:#fff;font-weight:600;font-size:13px;">Add</button>
      </div>
    </div>

    <div id="cbWaReplyBar" style="display:none;position:fixed;bottom:68px;left:10px;right:10px;background:#fff;border-left:4px solid #008069;padding:9px 14px;border-radius:12px;justify-content:space-between;align-items:center;z-index:99990;box-shadow:0 -2px 12px rgba(0,0,0,0.12);">
      <div style="min-width:0;flex:1;">
        <div style="font-size:11px;font-weight:700;color:#008069;">Replying to</div>
        <div id="cbWaReplyTxt" style="font-size:13px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
      </div>
      <span id="cbCancelWaRep" style="font-size:18px;color:#64748b;padding:4px 8px;cursor:pointer;font-weight:bold;">✕</span>
    </div>

    <div id="msgDelModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;padding:24px;z-index:100000;">
      <div style="background:#fff;width:100%;max-width:310px;border-radius:22px;padding:22px 20px 16px 20px;text-align:left;">
        <div style="font-size:16px;color:#0f172a;font-weight:600;margin-bottom:16px;">Delete message?</div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <button id="dAll" style="background:none;border:none;color:#008069;font-weight:700;font-size:14px;padding:9px 12px;">Delete for everyone</button>
          <button id="dMe" style="background:none;border:none;color:#008069;font-weight:700;font-size:14px;padding:9px 12px;">Delete for me</button>
          <button id="dNo" style="background:none;border:none;color:#008069;font-weight:700;font-size:14px;padding:9px 12px;">Cancel</button>
        </div>
      </div>
    </div>
  `);
  let sel = new Set(), tmr = null, justSelected = false;
  const bar = document.getElementById("msgTopBar");
  const rBar = document.getElementById("msgReactBar");
  const mBox = document.getElementById("moreEmojiBox");
  const dMod = document.getElementById("msgDelModal");
  const waRepBar = document.getElementById("cbWaReplyBar");

  const isDeleted = el => !!el.querySelector(".cb-deleted-msg") || el.innerText.includes("This message was deleted");
  const ensureMid = el => { if (!el.dataset.mid) el.dataset.mid = "m_" + Date.now() + "_" + Math.floor(Math.random() * 999); return el.dataset.mid; };
  const save = () => { const a = document.getElementById("chatArea"); if (a) localStorage.setItem("cb_saved_chat_" + (localStorage.getItem("active_chat_user") || "@friend"), a.innerHTML); };

  setInterval(() => {
    document.querySelectorAll("#chatArea .msg").forEach(m => { ensureMid(m); m.onclick = null; });
  }, 500);

  window.scrollToQuotedMsg = function (mid) {
    const target = document.querySelector(`[data-mid="${mid}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.style.transition = "box-shadow 0.3s";
    target.style.boxShadow = "0 0 0 4px rgba(0, 168, 132, 0.45)";
    setTimeout(() => { target.style.boxShadow = ""; }, 1200);
  };

  function openReplyFor(msgEl) {
    if (!msgEl || isDeleted(msgEl)) return;
    const mid = ensureMid(msgEl);
    const clone = msgEl.cloneNode(true);
    clone.querySelectorAll(".cb-wa-quote, .cb-rp, .cb-st").forEach(x => x.remove());
    const cleanTxt = clone.innerText.trim().slice(0, 60);

    window.cbReplyData = { mid: mid, text: cleanTxt };
    document.getElementById("cbWaReplyTxt").innerText = cleanTxt;
    waRepBar.style.display = "flex";
    const inp = document.getElementById("msgInput") || document.querySelector("input[type='text']");
    if (inp) inp.focus();
  }

  document.getElementById("cbCancelWaRep").onclick = () => { waRepBar.style.display = "none"; window.cbReplyData = null; };

    const clr = () => {
    sel.forEach(m => {
      m.style.outline = "";
      m.style.backgroundColor = "";
    });
    sel.clear();
    bar.style.display = "none"; rBar.style.display = "none"; mBox.style.display = "none";
  };

  const tog = el => {
    ensureMid(el);
    if (sel.has(el)) {
      sel.delete(el);
      el.style.outline = "";
      el.style.backgroundColor = "";
    } else {
      sel.add(el);
      el.style.outline = "2px solid rgba(0, 168, 132, 0.55)";
      el.style.backgroundColor = "rgba(0, 168, 132, 0.14)";
    }

    const anyDel = Array.from(sel).some(isDeleted);
    bar.style.display = sel.size > 0 ? "flex" : "none";
    rBar.style.display = (sel.size === 1 && !anyDel) ? "flex" : "none";
    document.getElementById("mRep").style.display = (sel.size === 1 && !anyDel) ? "flex" : "none";
    document.getElementById("mStr").style.display = anyDel ? "none" : "flex";
    document.getElementById("mCpy").style.display = anyDel ? "none" : "flex";
    document.getElementById("mShr").style.display = anyDel ? "none" : "flex";
    document.getElementById("mCnt").innerText = sel.size;
  };

  function applyReact(emoji) {
    if (!emoji) return;
    sel.forEach(m => {
      if (isDeleted(m)) return;
      const mid = ensureMid(m);
      m.querySelectorAll(".cb-rp").forEach(x => x.remove());
      m.insertAdjacentHTML("beforeend", `
        <div class="cb-rp" onclick="event.stopPropagation(); this.remove();" style="display:inline-flex;align-items:center;gap:5px;background:#fff;color:#1e293b;border:1px solid rgba(0,0,0,0.08);padding:2px 9px;border-radius:14px;font-size:11px;font-weight:600;margin-top:5px;box-shadow:0 1px 4px rgba(0,0,0,0.12);cursor:pointer;">
          <span style="font-size:14px;">${emoji}</span>
          <span>Reacted to your message</span>
        </div>
      `);
      if (window.socket) window.socket.emit("live_react", { to: localStorage.getItem("active_chat_user"), mid: mid, emoji: emoji });
    });
    save(); clr();
  }

  document.getElementById("mX").onclick = clr;
  document.getElementById("mMoreEm").onclick = () => { mBox.style.display = mBox.style.display === "none" ? "block" : "none"; document.getElementById("customEmInp").focus(); };
  document.getElementById("sendCustomEm").onclick = () => { const v = document.getElementById("customEmInp").value.trim(); if (v) { applyReact(v); document.getElementById("customEmInp").value = ""; } };
  document.querySelectorAll(".m-em").forEach(em => em.onclick = () => applyReact(em.innerText));

  document.getElementById("mCpy").onclick = () => { navigator.clipboard.writeText(Array.from(sel).map(m => m.innerText.replace("Reacted to your message", "").trim()).join("\n")); clr(); };
  document.getElementById("mStr").onclick = () => { sel.forEach(m => { if (!isDeleted(m)) { const o = m.querySelector(".cb-st"); if (o) o.remove(); else m.insertAdjacentHTML("beforeend", starSvg); } }); save(); clr(); };
  document.getElementById("mRep").onclick = () => { const f = Array.from(sel).item(0); clr(); openReplyFor(f); };
  document.getElementById("mShr").onclick = () => { const t = Array.from(sel).map(m => m.innerText.replace("Reacted to your message", "").trim()).join("\n"); if (navigator.share) navigator.share({ text: t }); else navigator.clipboard.writeText(t); clr(); };

  document.getElementById("mDel").onclick = () => { document.getElementById("dAll").style.display = Array.from(sel).some(isDeleted) ? "none" : "block"; dMod.style.display = "flex"; };
  document.getElementById("dNo").onclick = () => dMod.style.display = "none";
  document.getElementById("dMe").onclick = () => { sel.forEach(m => m.remove()); dMod.style.display = "none"; save(); clr(); };
  document.getElementById("dAll").onclick = () => {
    sel.forEach(m => {
      if (!isDeleted(m)) {
        const mid = ensureMid(m);
        m.innerHTML = delSvg;
        if (window.socket) window.socket.emit("delete_for_everyone", { to: localStorage.getItem("active_chat_user"), mid: mid });
      }
    });
    dMod.style.display = "none"; save(); clr();
  };

  function attachWaReply() {
    if (!window.cbReplyData) return;
    const data = window.cbReplyData;
    window.cbReplyData = null;
    waRepBar.style.display = "none";

    setTimeout(() => {
      const area = document.getElementById("chatArea");
      if (!area) return;
      const msgs = area.querySelectorAll(".msg");
      const last = msgs[msgs.length - 1];
      if (last && !last.querySelector(".cb-wa-quote")) {
        ensureMid(last);
        last.insertAdjacentHTML("afterbegin", `
          <div class="cb-wa-quote" onclick="event.stopPropagation(); window.scrollToQuotedMsg('${data.mid}');" style="background:rgba(0,0,0,0.09);border-left:3.5px solid #008069;padding:5px 9px;border-radius:7px;font-size:11.5px;margin-bottom:5px;text-align:left;cursor:pointer;">
            <div style="font-weight:700;font-size:10px;color:#008069;">Replying to</div>
            <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px;">${data.text}</div>
          </div>
        `);
        save();
      }
    }, 55);
  }

  // खाली स्क्रीन पर टैप करते ही सिलेक्शन और पॉप-अप बार तुरंत बंद करना
  document.addEventListener("click", e => {
    if (justSelected) { justSelected = false; return; }
    if (sel.size > 0) {
      if (e.target.closest("#msgTopBar, #msgReactBar, #moreEmojiBox, #msgDelModal")) return;
      const m = e.target.closest("#chatArea .msg");
      if (m) { e.preventDefault(); e.stopImmediatePropagation(); tog(m); }
      else { clr(); }
      return;
    }
    if (e.target.closest("button, .send-btn, [onclick*='send']")) attachWaReply();
  }, true);

  document.addEventListener("keydown", e => { if (e.key === "Enter") attachWaReply(); }, true);

  // Swipe Right to Reply + Long Press Selection
  let swEl = null, sX = 0, cX = 0;
  document.addEventListener("touchstart", e => {
    const m = e.target.closest("#chatArea .msg");
    if (!m || sel.size > 0) return;
    if (!isDeleted(m)) { swEl = m; sX = e.touches[0].clientX; cX = 0; }
    tmr = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(35);
      justSelected = true;
      tog(m);
      swEl = null;
    }, 380);
  }, { passive: true });

  document.addEventListener("touchmove", e => {
    clearTimeout(tmr);
    if (!swEl) return;
    const d = e.touches[0].clientX - sX;
    if (d > 8 && d < 85) { cX = d; swEl.style.transform = `translateX(${d}px)`; }
  }, { passive: true });

  document.addEventListener("touchend", () => {
    clearTimeout(tmr);
    if (!swEl) return;
    const targetMsg = swEl;
    targetMsg.style.transition = "transform 0.18s ease";
    targetMsg.style.transform = "translateX(0px)";
    if (cX > 45) { if (navigator.vibrate) navigator.vibrate(35); openReplyFor(targetMsg); }
    setTimeout(() => { targetMsg.style.transition = ""; }, 190);
    swEl = null; cX = 0;
  }, { passive: true });

  document.addEventListener("contextmenu", e => { if (e.target.closest("#chatArea")) e.preventDefault(); });
})();
