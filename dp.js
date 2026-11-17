(function () {
  const savedDp = localStorage.getItem("chatbox_dp");
  const savedName = localStorage.getItem("chatbox_name") || "U";

  // जिन जगहों पर यूजर की अपनी प्रोफ़ाइल फोटो दिखनी चाहिए, उन्हें अपडेट करना
  document.querySelectorAll(".my-dp, #myAvatar, #dpBox, #profilePic, .user-avatar").forEach(el => {
    if (savedDp) {
      el.innerHTML = `<img src="${savedDp}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit; display:block;">`;
    } else if (el.innerText.trim() === "") {
      el.innerText = savedName.charAt(0).toUpperCase();
    }
  });
})();
