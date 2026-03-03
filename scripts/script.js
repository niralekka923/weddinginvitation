// ============================================================================
// 1. INITIALIZATION (शुरुआती सेटअप)
// ============================================================================
// AOS (Animate On Scroll) लाइब्रेरी को इनिशियलाइज़ करना
AOS.init({
    duration: 1000,
    once: true,
    offset: 50
});

// जब पूरा HTML डॉक्यूमेंट लोड हो जाए, तब यह फंक्शन चलेगा
document.addEventListener("DOMContentLoaded", function() {

    // URL से 'v' पैरामीटर (एन्क्रिप्टेड डेटा) प्राप्त करना
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get('v');
    const MASTER_PASSWORD = "NIRALANUSHA";

    // यदि URL में 'v' पैरामीटर मौजूद है, तो उसे डिकोड करने की प्रक्रिया शुरू करें
    if (v) {
        try {
            // ============================================================================
            // 2. DATA DECODING (डेटा को डिकोड करना)
            // ============================================================================
            // Base64 स्ट्रिंग को नार्मल टेक्स्ट में बदलना (हिंदी और स्पेशल कैरेक्टर्स के सपोर्ट के साथ)
            const binaryStr = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
            const jsonStr = decodeURIComponent(escape(binaryStr));
            const data = JSON.parse(jsonStr);

            // ============================================================================
            // 3. WATERMARK LOGIC (वाटरमार्क हटाना)
            // ============================================================================
            // यदि पासवर्ड मैच होता है, तो डेमो वाटरमार्क छुपा दें
            if (data.cardPassword && data.cardPassword === MASTER_PASSWORD) {
                const watermark = document.getElementById('watermarkOverlay');
                if (watermark) watermark.style.display = 'none';
            }

            // ============================================================================
            // 4. BASIC CONTENT REPLACEMENT (साधारण टेक्स्ट और इमेजेज अपडेट करना)
            // ============================================================================
            // उन सभी क्लास के नाम जिनकी वैल्यू सीधे JSON डेटा से रिप्लेस करनी है
            const simpleKeys = [
                'couple-english-name',
                'wedding-front-text',
                'wedding-congrats-text',
                'g-image',
                'g-name',
                'g-parents',
                'g-address',
                'b-image',
                'b-name',
                'b-parents',
                'b-address',
                'wedding-countdown-text',
                'wedding-date-text',
                'wedding-request-text',
                'caller-name'
            ];

            // लूप चलाकर हर एक की (key) का डेटा HTML में डालना
            simpleKeys.forEach(key => {
                if (data[key]) {
                    document.querySelectorAll('.' + key).forEach(el => {
                        if (el.tagName === 'IMG') {
                            el.src = data[key]; // अगर एलिमेंट इमेज है तो src अपडेट करें
                        } else {
                            // \n को <br> में बदलकर लाइन ब्रेक लागू करें (String में कन्वर्ट करके ताकि एरर न आए)
                            el.innerHTML = String(data[key]).replace(/\n/g, '<br>');
                        }
                    });
                }
            });

            // ============================================================================
            // 5. RELIGIOUS ICON & QUOTES (धार्मिक चिह्न और श्लोक/कोट्स)
            // ============================================================================

            // आइकॉन अपडेट करना
            if (data.religiousIconHTML) {
                const iconEl = document.querySelector('.religious-icon');
                if (iconEl) iconEl.innerHTML = data.religiousIconHTML;
            }

            // कोट्स (Quotes) का एनीमेशन
if (data.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
    const quoteEl = document.querySelector('.religious-animation-text');
    
    if (quoteEl) {
        if (data.quotes.length === 1) {
            quoteEl.innerHTML = data.quotes[0];
        } else {
            let i = 0;
            // पहली बार दिखाने के लिए
            quoteEl.innerHTML = data.quotes[i];
            
            // एनीमेशन लूप
            setInterval(() => {
                // 1. फेड आउट शुरू करें (CSS क्लास जोड़ें)
                quoteEl.classList.add('fade-out');
                
                // 2. CSS ट्रांजिशन (0.5s) के बाद टेक्स्ट बदलें
                setTimeout(() => {
                    i = (i + 1) % data.quotes.length;
                    quoteEl.innerHTML = data.quotes[i];
                    
                    // 3. फेड इन के लिए क्लास हटाएँ
                    quoteEl.classList.remove('fade-out');
                }, 500); // यह CSS transition duration (0.5s) से मैच होना चाहिए
                
            }, 5000); // कुल 5 सेकंड का अंतराल (4.5s दिखना + 0.5s ट्रांजिशन)
        }
    }
}
            

            // ============================================================================
            // 6. DYNAMIC SECTIONS BUILD (फंक्शन और रिश्तेदारों की लिस्ट बनाना)
            // ============================================================================

            // वैवाहिक कार्यक्रम (Functions) बनाना
            const funcContainer = document.querySelector('.function-container');
            if (funcContainer && data.functions) {
                let funcHTML = '';
                data.functions.forEach(f => {
                    const addressHTML = f.link
                    ? `<a class="function-link-address" href="${f.link}" target="_blank">${f.icon || ''} <span class="function-address">${f.address}</span></a>`: `${f.icon || ''} <span class="function-address">${f.address}</span>`;

                    funcHTML += `
                    <div class="event-box function-box" data-aos="fade-up">
                    <h3 class="function-name">${f.name}</h3>
                    <p class="function-time">${f.time}</p>
                    <p><small>${addressHTML}</small></p>
                    </div>`;
                });

                if (data.functionCustomHTML) {
                    funcHTML += `<div data-aos="fade-up">${data.functionCustomHTML}</div>`;
                }
                funcContainer.innerHTML = funcHTML;
            }

            // दर्शनाभिलाषी (Relatives) बनाना
            const relContainer = document.querySelector('.relatives-container');
            if (relContainer && data.relatives) {
                let relHTML = '';
                data.relatives.forEach(r => {
                    relHTML += `
                    <div class="relatives-section relatives-box relatives-box-wrapper" data-aos="fade-right">
                    <h3 class="hindi-title relatives-title">
                    <span class="relatives-icon">${r.icon || ''}</span>
                    <span class="relatives-box-name">${r.boxName}</span>
                    </h3>
                    <p class="relatives-name relatives-desc">${String(r.name).replace(/\n/g, '<br>')}</p>
                    </div>`;
                });

                if (data.relativesCustomHTML) {
                    relHTML += `<div data-aos="fade-right">${data.relativesCustomHTML}</div>`;
                }
                relContainer.innerHTML = relHTML;
            }

            // ============================================================================
            // 7. COUNTDOWN TIMER (उलटी गिनती शुरू करना)
            // ============================================================================
            if (data.timerDate) {
                startCountdown(data.timerDate);
            }

        } catch (e) {
            console.error("डिकोडिंग या डेटा रेंडरिंग में एरर:", e);
        }
    }
});

// ============================================================================
// 8. UTILITY FUNCTIONS (सहायक फंक्शन्स)
// ============================================================================

/**
* विवाह के दिन तक का टाइमर चलाने के लिए फंक्शन
* @param {string} targetDateString - विवाह की तारीख (format: YYYY-MM-DD THH:MM:SS)
*/
function startCountdown(targetDateString) {
    const targetDate = new Date(targetDateString).getTime();

    // अगर तारीख सही नहीं है तो फंक्शन यहीं रोक दें
    if (isNaN(targetDate)) return;

    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // यदि समय पूरा हो गया हो (शादी का दिन आ गया हो)
        if (distance < 0) {
            clearInterval(interval);
            const timerContainer = document.getElementById("timer");
            if (timerContainer) {
                timerContainer.innerHTML = "<h3 class='timer-end-msg'>विवाह का शुभ दिन आ गया है!</h3>";
            }
            return;
        }

        // दिन, घंटे, मिनट और सेकंड की गणना (Calculation)
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // HTML में वैल्यूज अपडेट करना (padStart का उपयोग 01, 02 फॉर्मेट के लिए)
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    },
        1000);
}
