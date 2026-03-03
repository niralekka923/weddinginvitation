// AOS Animation चालू करने के लिए
AOS.init({ duration: 1000, once: true, offset: 50 });

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. कार्ड लोड होते ही तैरते हुए बैकग्राउंड कण चालू करें
    createFloatingGraphics();

    // 2. URL से एन्क्रिप्टेड डेटा निकालें
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get('v');
    const MASTER_PASSWORD = "NIRALANUSHA";

    if (v) {
        try {
            const binaryStr = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
            const jsonStr = decodeURIComponent(escape(binaryStr));
            const data = JSON.parse(jsonStr);

            // Watermark हटाना (अगर पासवर्ड सही है)
            if (data.cardPassword && data.cardPassword === MASTER_PASSWORD) {
                const watermark = document.getElementById('watermarkOverlay');
                if (watermark) watermark.style.display = 'none';
            }

            // 3. साधारण टेक्स्ट और इमेज अपडेट करना
            const simpleKeys = ['couple-english-name', 'wedding-front-text', 'wedding-congrats-text', 'g-image', 'g-name', 'g-parents', 'g-address', 'b-image', 'b-name', 'b-parents', 'b-address', 'wedding-countdown-text', 'wedding-date-text', 'wedding-request-text', 'caller-name'];
            
            simpleKeys.forEach(key => {
                if(data[key]) {
                    document.querySelectorAll('.' + key).forEach(el => {
                        if (el.tagName === 'IMG') el.src = data[key];
                        else el.innerHTML = data[key].replace(/\n/g, '<br>');
                    });
                }
            });

            // 4. धार्मिक आइकॉन (URL से आया हुआ) सेट करना
            if(data.religiousIconHTML) {
                const iconEl = document.querySelector('.religious-icon');
                if(iconEl) iconEl.innerHTML = data.religiousIconHTML;
            }

            // 5. धार्मिक Quotes (Fade In और Fade Out एनीमेशन के साथ)
            if(data.quotes && data.quotes.length > 0) {
                const quoteEl = document.querySelector('.religious-animation-text');
                if(data.quotes.length === 1) {
                    quoteEl.innerHTML = data.quotes[0];
                } else {
                    let i = 0;
                    quoteEl.innerHTML = data.quotes[i];
                    
                    setInterval(() => {
                        // पुराना कोट ऊपर की तरफ धुंधला (Fade-out) करें
                        quoteEl.classList.add('fade-out');
                        
                        setTimeout(() => {
                            // नया कोट बदलें
                            i = (i + 1) % data.quotes.length;
                            quoteEl.innerHTML = data.quotes[i];
                            
                            // कोट को नीचे की तरफ सेट करें बिना दिखाए
                            quoteEl.classList.remove('fade-out');
                            quoteEl.classList.add('prepare-in');
                            
                            // कुछ मिलीसेकंड बाद उसे अपनी जगह पर लाएं (Fade In)
                            setTimeout(() => {
                                quoteEl.classList.remove('prepare-in');
                            }, 50); 
                            
                        }, 1000); // 1 सेकंड तक फेड आउट का इंतज़ार करें
                        
                    }, 5000); // हर 5 सेकंड में कोट बदलेगा
                }
            }

            // 6. वैवाहिक कार्यक्रम (Functions) बनाना
            const funcContainer = document.querySelector('.function-container');
            if(funcContainer && data.functions) {
                let funcHTML = '';
                data.functions.forEach(f => {
                    const addressHTML = f.link ? `<a class="function-link-address" href="${f.link}" target="_blank">${f.icon || ''} <span class="function-address">${f.address}</span></a>` : `${f.icon || ''} <span class="function-address">${f.address}</span>`;
                    
                    funcHTML += `
                    <div class="event-box function-box" data-aos="fade-up">
                        <h3 class="function-name">${f.name}</h3>
                        <p class="function-time">${f.time}</p>
                        <p><small>${addressHTML}</small></p>
                    </div>`;
                });
                
                if(data.functionCustomHTML) {
                    funcHTML += `<div data-aos="fade-up">${data.functionCustomHTML}</div>`;
                }
                funcContainer.innerHTML = funcHTML;
            }

            // 7. रिश्तेदार (Relatives) बनाना
            const relContainer = document.querySelector('.relatives-container');
            if(relContainer && data.relatives) {
                let relHTML = '';
                data.relatives.forEach(r => {
                    relHTML += `
                    <div class="relatives-section relatives-box relatives-box-wrapper" data-aos="fade-right">
                        <h3 class="hindi-title relatives-title">
                            <span class="relatives-icon">${r.icon || ''}</span> 
                            <span class="relatives-box-name">${r.boxName}</span>
                        </h3>
                        <p class="relatives-name relatives-desc">${r.name.replace(/\n/g, '<br>')}</p>
                    </div>`;
                });
                
                if(data.relativesCustomHTML) {
                    relHTML += `<div data-aos="fade-right">${data.relativesCustomHTML}</div>`;
                }
                relContainer.innerHTML = relHTML;
            }

            // 8. टाइमर चालू करना
            if (data.timerDate) {
                startCountdown(data.timerDate);
            }

        } catch (e) {
            console.error("डिकोडिंग एरर:", e);
        }
    }
});

// --- Timer Function (उलटी गिनती का कोड) ---
function startCountdown(targetDateString) {
    const targetDate = new Date(targetDateString).getTime();
    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            document.getElementById("timer").innerHTML = "<h3 class='timer-end-msg'>विवाह का शुभ दिन आ गया है!</h3>";
            return;
        }
        document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);
}

// --- Floating Graphics Generator (तैरते हुए बैकग्राउंड कण बनाने का कोड) ---
function createFloatingGraphics() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none'; // ताकि क्लिक करने में दिक्कत न हो
    container.style.zIndex = '0'; 
    document.body.appendChild(container);

    // 20 तैरते हुए सुनहरे कण (Particles) बनाएं
    for(let i = 0; i < 20; i++) {
        let particle = document.createElement('div');
        particle.className = 'bg-particle'; // यह क्लास CSS से डिज़ाइन लेगी
        
        // रैंडम साइज़
        let size = Math.random() * 25 + 10; 
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // स्क्रीन पर रैंडम जगह से शुरुआत
        particle.style.left = Math.random() * 100 + 'vw';
        
        // रैंडम स्पीड
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's'; 
        
        // रैंडम डिले (ताकि एक साथ न निकलें)
        particle.style.animationDelay = (Math.random() * 5) + 's';
        
        container.appendChild(particle);
    }
}
