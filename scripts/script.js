// Scroll Animation ke liye script
AOS.init({
    duration: 1000, once: true, offset: 50
});










// countdown ya fir Timer ka script
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get('v');

    if (v) {
        try {
            const binaryStr = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
            const jsonStr = decodeURIComponent(escape(binaryStr));
            const data = JSON.parse(jsonStr);

            // 1. सभी IDs में डेटा भरना (टेक्स्ट और इमेज के लिए)
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.tagName === 'IMG') {
                        element.src = data[key];
                    } else {
                        element.innerText = data[key];
                    }
                }
            });

            // 2. 'marriageDate' क्लास वाली जगहों के लिए
            if (data.marriageDate) {
                const dateClasses = document.getElementsByClassName('marriageDate');
                for (let el of dateClasses) {
                    el.innerText = data.marriageDate;
                }
            }

            // 3. यहाँ से टाइमर का लॉजिक शुरू होता है ⏳
            if (data.timerDate) {
                startCountdown(data.timerDate);
            }

        } catch (e) {
            console.error("डिकोडिंग एरर:", e);
        }
    }
});

// टाइमर कैलकुलेट करने वाला फंक्शन
function startCountdown(targetDateString) {
    const targetDate = new Date(targetDateString).getTime();

    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // अगर शादी का समय पार हो गया है, तो टाइमर 00 पर रोक दें
        if (distance < 0) {
            clearInterval(interval);
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            return;
        }

        // दिन, घंटे, मिनट और सेकंड की गणना
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // HTML में डेटा दिखाना (padStart का इस्तेमाल '0' लगाने के लिए ताकि 9 '09' दिखे)
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    },
        1000);
}





// URL Parameter method script jisme data pass through form to URL encrypted, short link, and direct link of image with image database
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get('v');

    if (v) {
        try {
            // URL Safe Base64 को वापस डिकोड करने का सबसे सटीक तरीका
            const binaryStr = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
            const jsonStr = decodeURIComponent(escape(binaryStr));
            const data = JSON.parse(jsonStr);

            console.log("Data Received:", data); // चेक करने के लिए Console में देखें

            // सभी IDs में डेटा भरना (टेक्स्ट और इमेज दोनों के लिए)
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    // चेक करें कि क्या एलीमेंट इमेज (IMG) टैग है
                    if (element.tagName === 'IMG') {
                        element.src = data[key]; // फोटो का लिंक (URL) अपडेट करें
                    } else {
                        element.innerText = data[key]; // नॉर्मल टेक्स्ट अपडेट करें
                    }
                }
            });



            // 'marriageDate' क्लास वाली जगहों के लिए
            if (data.marriageDate) {
                const dateClasses = document.getElementsByClassName('marriageDate');
                for (let el of dateClasses) {
                    el.innerText = data.marriageDate;
                }
            }

        } catch (e) {
            console.error("डिकोडिंग एरर:", e);
            // अगर डेटा गलत है तो पुराना डेटा ही दिखेगा, पेज क्रैश नहीं होगा
        }
    }
});