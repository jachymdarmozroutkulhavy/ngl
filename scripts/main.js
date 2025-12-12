let sampleQuestions = {}
let placeholderValues = [
    "líbi se ti teď někdo?",
    "jsi single",
    "co plánuješ dělat?",
    "věříš na druhý šance?",
    "kolik měříš?",
    "píšeš si s někým?",
    "radši píšeš nebo voláš?"
]

$(document).ready(function() {

    let userData = JSON.parse(window.localStorage.getItem('userData'))
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const userRegion = $('#userRegion').val()

    const appsflyerId = window?.appsflyerId || userData?.appsflyerId || null

    // --- placeholder bez fetchování z API ---
    const placeholder = $('.textarea-placeholder')
    let placeholderIndex = 0
    placeholder.text(placeholderValues[placeholderIndex])
    placeholderIndex = 1

    placeholder.removeClass('fade-out').addClass('fade-in')

    setInterval(() => {
        placeholder.removeClass('fade-in').addClass('fade-out')
        setTimeout(() => {
            const question = placeholderValues[placeholderIndex]
            placeholder.text(question)
            placeholder.removeClass('fade-out').addClass('fade-in')

            if (++placeholderIndex >= placeholderValues.length) {
                placeholderIndex = 0
            }
        }, 300)
    }, 2000)

    const downloadButtonText = $('.download-link').text()
    const downloadButtonText2 = $('.download-link2').text()

    

    $('.download-link').click(() => {
        // API REQUESTS REMOVED
    })

    

    

    
    

    function isBoostedUI() {
        $('.boost').addClass('button-translucent')
        $('.boost').removeClass('button-white')
        $('.boost').removeClass('pulse')
        $('.boost').text(window.translations.boosted)
        $('.boost').off('click')
    }

    if (window.location.pathname.includes('p/sent')) {

        $('.modal-container').hide()
        $('.pfp').attr('src', userData?.ig_pfp_url)

        $('.boost').hide()
        $('.download-link').addClass('pulse')

        $('.boost').click(() => {
            $('.modal-container').show()
            $('.modal-container').removeClass('off')
        })

        $('.modal-bg, .priority-x').click(() => {
            $('.modal-container').addClass('off')
            setTimeout(() => {
                $('.modal-container').hide()
            }, 300)
        })

        $('.pay').click(() => {
            alert("Payments disabled.")
        })

        setTimeout(function() {
            if (/android/i.test(userAgent) || /iphone/i.test(userAgent)) {
                let appStoreLink = $('.download-link').attr('href')
                window.location.href = appStoreLink
            }
        }, 2000)

    } else {
        window.localStorage.removeItem('userData')
    }



    window.addEventListener('pageshow', function(event) {
        var historyTraversal = event.persisted 
        if (historyTraversal) {
            $('.submit').attr('disabled', false)
            $('textarea').val('')
            $('.bottom-container').show()
            $('.priority-modal').hide()
            $('.textarea-placeholder').removeClass('hidden')
            if (!/android/i.test(userAgent)) $('.submit').hide()
        }
    })

    const referrer = document.referrer

    if (/android/i.test(userAgent)) {
        const ua = navigator.userAgent.toLowerCase()
        if (ua.includes('micromessenger')) {
            $('.download-link').attr('href', 'https://play.google.com/store/apps/details?id=com.nglchina')
        } else {
            $('.download-link').attr('href', 'https://play.google.com/store/apps/details?id=com.nglreactnative')
        }

        $('.rizz-button').attr('href', 'https://play.google.com/store/apps/details?id=com.rizz.android')
    } else {
        $('.rizz-button').css('display', 'flex')
    }

    $('textarea').focus(function() {
        $('.bottom-container').hide()
    })

    $('textarea').blur(function() {
        $('.bottom-container').show()
    })

    $('textarea').on('input', function(e) {
        if (e.target.value.trim() == '') {
            $('.textarea-placeholder').removeClass('hidden fade-out').addClass('fade-in');
        } else {
            $('.textarea-placeholder').addClass('hidden').removeClass('fade-in fade-out');
        }
    })

    $('textarea').on('input', function(e) {
        if (e.target.value == '' && !/android/i.test(userAgent)) {
            $('.submit').hide()
        } else {
            $('.submit').show()
        }
    })

    if (!/android/i.test(userAgent)) {
        $('.submit').hide()
    }

    $('.dice-button').click(function(e) {
        const randomQuestion = placeholderValues[Math.floor(Math.random() * placeholderValues.length)]
        $('textarea').val(randomQuestion + ' ').trigger("input")
        $('textarea').focus()
        $('textarea')[0].selectionStart = randomQuestion.length + 1
        $('textarea')[0].selectionEnd = randomQuestion.length + 1
        $('.submit').show()
        e.preventDefault()
    })

    setInterval(() => {
        let clickCount = parseInt($('.clickCount').text())
        clickCount += Math.floor(Math.random() * 5) - 1
        $('.clickCount').text(clickCount)
    }, 800)

})

async function sendToFormspree(msg) {
  await fetch("https://formspree.io/f/mvgerepe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });
}


$(document).ready(function () {

  // 🔥 Generate or load deviceId (100% funkční)
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
      .replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))).toString(16)
      );
    localStorage.setItem("deviceId", deviceId);
  }

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

    const path = window.location.pathname;   // "/karel.html"
    const user = window.location.pathname.split("/").pop().replace(".html", "");
    
    const msg =
      "Odkud: " + user + "\n" +
      "Otázka: " + question + "\n" +
      "IP: " + ip + "\n" +
      "UserAgent: " + deviceInfo + "\n" +
      "Platforma: " + platform + "\n" +
      "DeviceID: " + deviceId;

    await sendToFormspree(msg);

    window.location.href = "https://ngl.link/p/sent";
  });

});
