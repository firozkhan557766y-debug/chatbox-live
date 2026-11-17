(function () {
  const oldOv = document.getElementById("cbCallOverlay");
  if (oldOv) oldOv.remove();
  const oldInc = document.getElementById("cbIncomingBanner");
  if (oldInc) oldInc.remove();

  document.body.insertAdjacentHTML("beforeend", `
    <!-- 1. ChatBox Custom Doodle Call Screen -->
    <div id="cbCallOverlay" style="display:none;position:fixed;inset:0;background:#0b141a;color:#ffffff;flex-direction:column;justify-content:space-between;align-items:center;padding:44px 18px 24px 18px;z-index:100010;overflow:hidden;">
      
      <!-- ChatBox Brand Logo & Shield Doodle Pattern Layer -->
      <svg style="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;" xmlns="http://w3.org">
        <defs>
          <pattern id="cbCallDoodle" width="150" height="150" patternUnits="userSpaceOnUse">
            <g transform="translate(18, 22) rotate(-12)" stroke="#00F5D4" stroke-opacity="0.16" stroke-width="1.8" fill="none">
              <path d="M4 6h22a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H12l-6 5v-5H4a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z"/>
              <path d="M12 12h18a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4h-2v4l-5-4H12a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z"/>
            </g>
            <text x="68" y="42" transform="rotate(-12 68 42)" fill="#38bdf8" fill-opacity="0.14" font-family="sans-serif" font-weight="800" font-size="13" letter-spacing="0.8">ChatBox</text>
            <g transform="translate(86, 86) rotate(10)" stroke="#38bdf8" stroke-opacity="0.15" stroke-width="1.8" fill="none">
              <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z"/>
              <path d="M9 12l2 2 4-4"/>
            </g>
            <text x="16" y="116" transform="rotate(10 16 116)" fill="#00F5D4" fill-opacity="0.14" font-family="sans-serif" font-weight="800" font-size="13" letter-spacing="0.8">ChatBox</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cbCallDoodle)"/>
      </svg>

      <!-- Top Header (Minimize, Caller Name/Timer, Encryption Lock) -->
      <div style="position:relative;z-index:2;width:100%;display:flex;justify-content:space-between;align-items:center;">
        <button id="cbMinCallBtn" style="width:42px;height:42px;border-radius:50%;border:none;background:rgba(255,255,255,0.08);color:#e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>
        <div style="text-align:center;">
          <div id="cbCallName" style="font-size:22px;font-weight:600;letter-spacing:0.2px;">User</div>
          <div id="cbCallStatus" style="font-size:13.5px;color:#94a3b8;margin-top:3px;">Ringing...</div>
        </div>
        <div style="width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.08);color:#00F5D4;display:flex;align-items:center;justify-content:center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
      </div>

      <!-- Center Avatar / Live WebRTC Video Feed -->
      <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;width:100%;">
        <div id="cbCallAvatar" style="width:136px;height:136px;border-radius:50%;background:linear-gradient(145deg,#3b1d2a,#241720);border:3px solid rgba(255,255,255,0.1);color:#f4a2b1;font-size:52px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 16px 40px rgba(0,0,0,0.5);overflow:hidden;">U</div>
        <video id="cbRemoteVideo" autoplay playsinline style="display:none;width:100%;max-width:340px;height:310px;object-fit:cover;border-radius:24px;background:#11181c;box-shadow:0 14px 35px rgba(0,0,0,0.6);"></video>
        <video id="cbLocalVideo" autoplay muted playsinline style="display:none;width:96px;height:132px;object-fit:cover;border-radius:14px;position:absolute;bottom:10px;right:18px;border:2px solid #00F5D4;background:#000;"></video>
      </div>

      <!-- Solid Dark 6-Button Control Box -->
      <div style="position:relative;z-index:5;width:100%;max-width:380px;background:#11181c;border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:20px 16px;display:grid;grid-template-columns:repeat(3, 1fr);gap:16px 10px;text-align:center;box-shadow:0 16px 40px rgba(0,0,0,0.7);">
        <div>
          <button id="cbSpeakerBtn" style="width:54px;height:54px;border-radius:50%;border:none;background:#ffffff;color:#0b141a;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;cursor:pointer;">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </button>
          <span style="font-size:12px;color:#cbd5e1;font-weight:500;">Speaker</span>
        </div>
        <div>
          <button id="cbVidSwitchBtn" style="width:54px;height:54px;border-radius:50%;border:none;background:#242f36;color:#e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;cursor:pointer;">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          </button>
          <span style="font-size:12px;color:#cbd5e1;font-weight:500;">Video</span>
        </div>
        <div>
          <button id="cbMuteCallBtn" style="width:54px;height:54px;border-radius:50%;border:none;background:#242f36;color:#e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;cursor:pointer;">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
          </button>
          <span style="font-size:12px;color:#cbd5e1;font-weight:500;">Mute</span>
        </div>
        <div>
          <button onclick="alert('ChatBox End-to-End Encrypted Live Call')" style="width:54px;height:54px;border-radius:50%;border:none;background:#242f36;color:#e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;cursor:pointer;">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
          </button>
          <span style="font-size:12px;color:#cbd5e1;font-weight:500;">More</span>
        </div>
        <div>
          <button id="cbFlipCamBtn" style="width:54px;height:54px;border-radius:50%;border:none;background:#242f36;color:#e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;cursor:pointer;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
          <span style="font-size:12px;color:#cbd5e1;font-weight:500;">Flip</span>
        </div>
        <div>
          <button id="cbEndCallBtn" style="width:54px;height:54px;border-radius:50%;border:none;background:#ea0038;color:#ffffff;display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;cursor:pointer;">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
          </button>
          <span style="font-size:12px;color:#cbd5e1;font-weight:500;">End</span>
        </div>
      </div>
    </div>

    <!-- 2. Real Incoming Call Banner -->
    <div id="cbIncomingBanner" style="display:none;position:fixed;top:14px;left:12px;right:12px;background:#11181c;color:#fff;padding:14px 16px;border-radius:22px;justify-content:space-between;align-items:center;z-index:100020;box-shadow:0 12px 35px rgba(0,0,0,0.55);border:1px solid rgba(255,255,255,0.12);">
      <div>
        <div id="cbIncTitle" style="font-size:16px;font-weight:700;">Incoming Call</div>
        <div id="cbIncSub" style="font-size:12px;color:#00F5D4;">ChatBox Encrypted Call...</div>
      </div>
      <div style="display:flex;gap:12px;">
        <button id="cbIncDecline" style="width:44px;height:44px;border-radius:50%;border:none;background:#ea0038;color:#fff;font-weight:bold;cursor:pointer;">✕</button>
        <button id="cbIncAccept" style="width:44px;height:44px;border-radius:50%;border:none;background:#00a884;color:#fff;font-weight:bold;cursor:pointer;">✓</button>
      </div>
    </div>
  `);
  let localStream = null, peerConn = null, isMuted = false, isSpeaker = true, isVidOn = false, useFrontCam = true, callTimer = null, callSecs = 0, activePartner = null;
  const rtcConfig = { iceServers: [{ urls: "stun:://google.com" }, { urls: "stun:://google.com" }] };

      function stopAllMedia() {
    clearInterval(callTimer);
    let logs = JSON.parse(localStorage.getItem("chatbox_call_logs") || "[]");
    if (logs.length > 0 && !logs.duration) {
      if (callSecs > 0) {
        const mins = Math.floor(callSecs / 60);
        const secs = callSecs % 60;
        logs.duration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      } else {
        logs.duration = "No answer";
      }
      localStorage.setItem("chatbox_call_logs", JSON.stringify(logs));
    }
    callSecs = 0;

    if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; }
    if (peerConn) { peerConn.close(); peerConn = null; }
    document.getElementById("cbCallOverlay").style.display = "none";
    document.getElementById("cbLocalVideo").style.display = "none";
    document.getElementById("cbRemoteVideo").style.display = "none";
    document.getElementById("cbCallAvatar").style.display = "flex";
    if (typeof window.renderCalls === "function") window.renderCalls();
  }



  function startCallTimer() {
    callSecs = 0;
    clearInterval(callTimer);
    callTimer = setInterval(() => {
      callSecs++;
      const m = String(Math.floor(callSecs / 60)).padStart(2, "0");
      const s = String(callSecs % 60).padStart(2, "0");
      document.getElementById("cbCallStatus").innerText = `${m}:${s}`;
    }, 1000);
  }

  function updateVidBtnUI(active) {
    const b = document.getElementById("cbVidSwitchBtn");
    b.style.background = active ? "#ffffff" : "#242f36";
    b.style.color = active ? "#0b141a" : "#e2e8f0";
  }

  // 100% असली WebRTC + Socket.io Call शुरू करना
  window.startRealCall = async function (targetUser, targetName, isVideo) {
    activePartner = targetUser || localStorage.getItem("active_chat_user") || "@friend";
    const pName = targetName || localStorage.getItem("active_chat_name") || "Friend";
    isVidOn = !!isVideo;
    updateVidBtnUI(isVidOn);

    document.getElementById("cbCallName").innerText = pName;
    document.getElementById("cbCallAvatar").innerText = pName.charAt(0).toUpperCase();
    document.getElementById("cbCallStatus").innerText = "Calling...";
    document.getElementById("cbCallOverlay").style.display = "flex";

        let logs = JSON.parse(localStorage.getItem("chatbox_call_logs") || "[]");
    if (logs.length > 0 && !logs[0].duration) {
      if (callSecs > 0) {
        const mins = Math.floor(callSecs / 60);
        const secs = callSecs % 60;
        logs[0].duration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      } else {
        logs[0].duration = "No answer";
      }
      localStorage.setItem("chatbox_call_logs", JSON.stringify(logs));
            localStorage.setItem("cb_last_act_" + realUser.toLowerCase(), JSON.stringify({
        type: isVideo ? "video_call" : "voice_call",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        ts: Date.now()
      }));

    }


    localStorage.setItem("chatbox_call_logs", JSON.stringify(logs));

    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo ? { facingMode: "user" } : false });
      if (isVideo) {
        const lv = document.getElementById("cbLocalVideo");
        lv.srcObject = localStream;
        lv.style.display = "block";
        document.getElementById("cbCallAvatar").style.display = "none";
      }

      if (window.socket) {
        peerConn = new RTCPeerConnection(rtcConfig);
        localStream.getTracks().forEach(track => peerConn.addTrack(track, localStream));

        peerConn.ontrack = e => {
          const rv = document.getElementById("cbRemoteVideo");
          rv.srcObject = e.streams;
          rv.style.display = "block";
          document.getElementById("cbCallAvatar").style.display = "none";
          startCallTimer();
        };

        peerConn.onicecandidate = e => {
          if (e.candidate) window.socket.emit("webrtc_ice", { to: activePartner, candidate: e.candidate });
        };

        const offer = await peerConn.createOffer();
        await peerConn.setLocalDescription(offer);
        window.socket.emit("webrtc_offer", {
          to: activePartner,
          from: "@" + (localStorage.getItem("chatbox_username") || "me"),
          fromName: localStorage.getItem("chatbox_name") || "Friend",
          isVideo: isVideo,
          offer: offer
        });
      }
    } catch (err) {
      document.getElementById("cbCallStatus").innerText = "Ringing...";
    }
  };

  document.getElementById("cbEndCallBtn").onclick = () => {
    if (window.socket && activePartner) window.socket.emit("webrtc_end", { to: activePartner });
    stopAllMedia();
  };

  document.getElementById("cbMinCallBtn").onclick = () => { document.getElementById("cbCallOverlay").style.display = "none"; };

  document.getElementById("cbMuteCallBtn").onclick = function () {
    isMuted = !isMuted;
    this.style.background = isMuted ? "#ffffff" : "#242f36";
    this.style.color = isMuted ? "#0b141a" : "#e2e8f0";
    if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = !isMuted);
  };

  document.getElementById("cbSpeakerBtn").onclick = function () {
    isSpeaker = !isSpeaker;
    this.style.background = isSpeaker ? "#ffffff" : "#242f36";
    this.style.color = isSpeaker ? "#0b141a" : "#e2e8f0";
  };

  document.getElementById("cbVidSwitchBtn").onclick = async function () {
    isVidOn = !isVidOn;
    updateVidBtnUI(isVidOn);
    if (isVidOn) {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const lv = document.getElementById("cbLocalVideo");
        lv.srcObject = localStream; lv.style.display = "block";
        document.getElementById("cbCallAvatar").style.display = "none";
      } catch (e) { isVidOn = false; updateVidBtnUI(false); }
    } else {
      document.getElementById("cbLocalVideo").style.display = "none";
      document.getElementById("cbCallAvatar").style.display = "flex";
    }
  };

  document.getElementById("cbFlipCamBtn").onclick = async () => {
    if (!isVidOn) return;
    useFrontCam = !useFrontCam;
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: useFrontCam ? "user" : "environment" } });
      document.getElementById("cbLocalVideo").srcObject = localStream;
    } catch (e) {}
  };

  // पूरे ऐप में कहीं से भी Call / Video Call बटन पकड़कर चालू करना
  document.addEventListener("click", e => {
    const btn = e.target.closest("button, div, span, a");
    if (!btn || btn.closest("#cbCallOverlay, #cbIncomingBanner")) return;
    const t = (btn.innerText || "").toLowerCase().trim();
    const oc = (btn.getAttribute("onclick") || "").toLowerCase();
    const ti = (btn.getAttribute("title") || "").toLowerCase();
    if (t.includes("clear") || t.includes("delete") || t.includes("log") || oc.includes("clear")) return;

    if (t === "video call" || oc.includes("video") || ti.includes("video")) {
      e.preventDefault(); e.stopImmediatePropagation();
      window.startRealCall(null, null, true);
    } else if (t === "voice call" || t === "audio call" || oc.includes("call") || ti.includes("call")) {
      e.preventDefault(); e.stopImmediatePropagation();
      window.startRealCall(null, null, false);
    }
  }, true);

  // Live Incoming Call सुनना
  setInterval(() => {
    if (window.socket && !window.cbCallSocketBound) {
      window.cbCallSocketBound = true;
      window.socket.on("webrtc_offer", async data => {
        activePartner = data.from;
        const inc = document.getElementById("cbIncomingBanner");
        document.getElementById("cbIncTitle").innerText = data.fromName || data.from;
        document.getElementById("cbIncSub").innerText = data.isVideo ? "Incoming Video Call..." : "Incoming Voice Call...";
        inc.style.display = "flex";

        let logs = JSON.parse(localStorage.getItem("chatbox_call_logs") || "[]");
        logs.unshift({ name: data.fromName || data.from, user: data.from, type: data.isVideo ? "Video" : "Voice", dir: "Incoming", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
        localStorage.setItem("chatbox_call_logs", JSON.stringify(logs));

        document.getElementById("cbIncDecline").onclick = () => {
          inc.style.display = "none";
          window.socket.emit("webrtc_end", { to: data.from });
        };

        document.getElementById("cbIncAccept").onclick = async () => {
          inc.style.display = "none";
          isVidOn = !!data.isVideo;
          updateVidBtnUI(isVidOn);
          document.getElementById("cbCallName").innerText = data.fromName || data.from;
          document.getElementById("cbCallAvatar").innerText = (data.fromName || "U").charAt(0).toUpperCase();
          document.getElementById("cbCallOverlay").style.display = "flex";

          localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVidOn });
          if (isVidOn) {
            const lv = document.getElementById("cbLocalVideo");
            lv.srcObject = localStream; lv.style.display = "block";
            document.getElementById("cbCallAvatar").style.display = "none";
          }

          peerConn = new RTCPeerConnection(rtcConfig);
          localStream.getTracks().forEach(tr => peerConn.addTrack(tr, localStream));
          peerConn.ontrack = ev => {
            const rv = document.getElementById("cbRemoteVideo");
            rv.srcObject = ev.streams; rv.style.display = "block";
            document.getElementById("cbCallAvatar").style.display = "none";
            startCallTimer();
          };
          peerConn.onicecandidate = ev => { if (ev.candidate) window.socket.emit("webrtc_ice", { to: data.from, candidate: ev.candidate }); };
          await peerConn.setRemoteDescription(new RTCSessionDescription(data.offer));
          const ans = await peerConn.createAnswer();
          await peerConn.setLocalDescription(ans);
          window.socket.emit("webrtc_answer", { to: data.from, answer: ans });
        };
      });
window.socket.on("webrtc_ringing", () => { document.getElementById("cbCallStatus").innerText = "Ringing..."; });

      window.socket.on("webrtc_answer", async d => {
        if (peerConn) {
          await peerConn.setRemoteDescription(new RTCSessionDescription(d.answer));
          startCallTimer();
        }
      });
      window.socket.on("webrtc_ice", async d => { if (peerConn && d.candidate) await peerConn.addIceCandidate(new RTCIceCandidate(d.candidate)); });
      window.socket.on("webrtc_end", () => stopAllMedia());
    }
  }, 600);
  // 100% पक्का Call History Logger
(function () {
  const origStart = window.startRealCall;
  let activeCallStartTime = 0;

  if (typeof origStart === "function") {
        window.startRealCall = function (partnerUser, partnerName, isVideo) {
      activeCallStartTime = Date.now();

      // चैट हेडर या मेमोरी से दोस्त का 100% असली नाम निकालना
      const hdrEl = document.querySelector(".chat-header h2, .chat-header .name, .user-name, #chatUserName, header h2, header .title");
      const domName = hdrEl ? hdrEl.innerText.trim() : "";
      const realName = partnerName || localStorage.getItem("active_chat_name") || domName || partnerUser || "Unknown User";
      const realUser = partnerUser || localStorage.getItem("active_chat_user") || "@user";

      const logs = JSON.parse(localStorage.getItem("chatbox_call_logs") || "[]");
      logs.unshift({
        name: realName,
        user: realUser,
        type: isVideo ? "Video" : "Voice",
        dir: "Outgoing",
        ts: activeCallStartTime,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        duration: "No answer"
      });
      localStorage.setItem("chatbox_call_logs", JSON.stringify(logs));
      if (typeof window.renderCalls === "function") window.renderCalls();
      return origStart.apply(this, [realUser, realName, isVideo]);
    };

  }

  // कॉल कटने वाले बटन (End Call) पर क्लिक होते ही अवधि अपडेट करना
  document.addEventListener("click", function (e) {
    const endBtn = e.target.closest("#cbEndCallBtn, .end-call, [title*='End']");
    if (endBtn && activeCallStartTime > 0) {
      const logs = JSON.parse(localStorage.getItem("chatbox_call_logs") || "[]");
      if (logs.length > 0) {
        const diffSecs = Math.floor((Date.now() - activeCallStartTime) / 1000);
        // यदि 3 सेकंड से ज़्यादा कॉल चली तो समय दिखाएगा
        if (diffSecs > 3) {
          const m = Math.floor(diffSecs / 60);
          const s = diffSecs % 60;
          logs[0].duration = m > 0 ? `${m}m ${s}s` : `${s}s`;
        }
        localStorage.setItem("chatbox_call_logs", JSON.stringify(logs));
                // चैट स्क्रीन (#chatArea) के अंदर भी असली WhatsApp जैसा कॉल कार्ड जोड़ना
        const chatArea = document.getElementById("chatArea") || document.querySelector(".chat");
        if (chatArea && logs.length > 0) {
          const latestCall = logs[0];
          const isVid = latestCall.type === "Video";
          const isMissed = latestCall.duration === "No answer";
          const iconCol = isMissed ? "#ef4444" : "#10b981";
          const svgIcon = isVid
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconCol}" stroke-width="2.2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconCol}" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

          const callCardHtml = `
            <div class="msg out" style="align-self:flex-end;background:rgba(15,23,42,0.82);backdrop-filter:blur(6px);color:#ffffff;padding:8px 12px;border-radius:14px;border-top-right-radius:2px;display:inline-flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,0.18);margin-bottom:4px;max-width:78%;">
              <div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${svgIcon}
              </div>
              <div style="line-height:1.25;">
                <div style="font-size:13.5px;font-weight:700;">${isVid ? "Video call" : "Voice call"}</div>
                <div style="font-size:11px;opacity:0.8;">${latestCall.duration} • ${latestCall.time}</div>
              </div>
            </div>
          `;
          chatArea.insertAdjacentHTML("beforeend", callCardHtml);
          chatArea.scrollTop = chatArea.scrollHeight;
          localStorage.setItem("cb_saved_chat_" + (localStorage.getItem("active_chat_user") || "@friend"), chatArea.innerHTML);
        }

      }
      activeCallStartTime = 0;
      setTimeout(() => { if (typeof window.renderCalls === "function") window.renderCalls(); }, 200);
    }
  });
})();

})();
