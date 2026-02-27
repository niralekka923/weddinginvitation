AOS.init({ duration: 1000, once: true, offset: 50 });

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get('v');
    const MASTER_PASSWORD = "NIRALANUSHA";

    if (v) {
        try {
            const binaryStr = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
            const jsonStr = decodeURIComponent(escape(binaryStr));
            const data = JSON.parse(jsonStr);

            // Watermark Logic
            if (data.cardPassword && data.cardPassword === MASTER_PASSWORD) {
                const watermark = document.getElementById('watermarkOverlay');
                if (watermark) watermark.style.display = 'none';
            }

            // 1. Simple Text and Image Replacements
            const simpleKeys = ['couple-english-name', 'wedding-front-text', 'wedding-congrats-text', 'g-image', 'g-name', 'g-parents', 'g-address', 'b-image', 'b-name', 'b-parents', 'b-address', 'wedding-countdown-text', 'wedding-date-text', 'wedding-request-text', 'caller-name'];
            
            simpleKeys.forEach(key => {
                if(data[key]) {
                    document.querySelectorAll('.' + key).forEach(el => {
                        if (el.tagName === 'IMG') el.src = data[key];
                        else el.innerHTML = data[key].replace(/\n/g, '<br>');
                    });
                }
            });

            // 2. Religious Icon
            if(data.religiousIconHTML) {
                const iconEl = document.querySelector('.religious-icon');
                if(iconEl) iconEl.innerHTML = data.religiousIconHTML;
            }

            // 3. Religious Quotes (Animation Logic)
            if(data.quotes && data.quotes.length > 0) {
                const quoteEl = document.querySelector('.religious-animation-text');
                if(data.quotes.length === 1) {
                    quoteEl.innerHTML = data.quotes[0];
                } else {
                    let i = 0;
                    quoteEl.innerHTML = data.quotes[i];
                    setInterval(() => {
                        quoteEl.classList.add('fade-out');
                        setTimeout(() => {
                            i = (i + 1) % data.quotes.length;
                            quoteEl.innerHTML = data.quotes[i];
                            quoteEl.classList.remove('fade-out');
                        }, 800); // 800ms fade out time
                    }, 4000); // Change quote every 4 seconds
                }
            }

            // 4. Dynamic Functions Build
            const funcContainer = document.querySelector('.function-container');
            if(funcContainer && data.functions) {
                let funcHTML = '';
                data.functions.forEach(f => {
                    const addressHTML = f.link ? `<a class="function-link-address" href="${f.link}" target="_blank" style="color:var(--gold)">${f.icon || ''} <span class="function-address">${f.address}</span></a>` : `${f.icon || ''} <span class="function-address">${f.address}</span>`;
                    
                    funcHTML += `
                    <div class="event-box function-box" data-aos="fade-up">
                        <h3 class="function-name">${f.name}</h3>
                        <p class="function-time">${f.time}</p>
                        <p><small>${addressHTML}</small></p>
                    </div>`;
                });
                
                // Add Custom Function HTML if provided
                if(data.functionCustomHTML) {
                    funcHTML += `<div data-aos="fade-up">${data.functionCustomHTML}</div>`;
                }
                funcContainer.innerHTML = funcHTML;
            }

            // 5. Dynamic Relatives Build
            const relContainer = document.querySelector('.relatives-container');
            if(relContainer && data.relatives) {
                let relHTML = '';
                data.relatives.forEach(r => {
                    relHTML += `
                    <div class="relatives-section relatives-box" data-aos="fade-right" style="margin-bottom:20px;">
                        <h3 class="hindi-title" style="font-size: 1.6rem; margin-bottom: 15px;">
                            <span class="relatives-icon">${r.icon || ''}</span> 
                            <span class="relatives-box-name">${r.boxName}</span>
                        </h3>
                        <p class="relatives-name" style="line-height: 1.8; color: #444;">${r.name.replace(/\n/g, '<br>')}</p>
                    </div>`;
                });
                
                // Add Custom Relatives HTML if provided
                if(data.relativesCustomHTML) {
                    relHTML += `<div data-aos="fade-right">${data.relativesCustomHTML}</div>`;
                }
                relContainer.innerHTML = relHTML;
            }

            // 6. Timer
            if (data.timerDate) {
                startCountdown(data.timerDate);
            }

        } catch (e) {
            console.error("डिकोडिंग एरर:", e);
        }
    }
});

function startCountdown(targetDateString) {
    const targetDate = new Date(targetDateString).getTime();
    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            document.getElementById("timer").innerHTML = "<h3 style='color: white; font-family: Kalam;'>विवाह का शुभ दिन आ गया है!</h3>";
            return;
        }
        document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);
}
