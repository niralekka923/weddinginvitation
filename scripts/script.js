        // Initialize Scroll Animations
        AOS.init({
            duration: 1000, once: true, offset: 50
        });

        // Premium Countdown Logic
        const targetDate = new Date("April 23, 2026 10:00:00").getTime();

        function updateTimer() {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff > 0) {
                document.getElementById("days").innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
                document.getElementById("hours").innerText = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                document.getElementById("minutes").innerText = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                document.getElementById("seconds").innerText = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
            } else {
                document.getElementById("timer").innerHTML = "<h3 style='color:var(--gold); font-size: 2rem; width: 100%; text-align: center;'>शादी का शुभ दिन आ गया है!</h3>";
            }
        }

        // Run timer immediately then set interval
        updateTimer();
        setInterval(updateTimer, 1000);