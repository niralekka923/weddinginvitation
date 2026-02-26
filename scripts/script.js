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
    // URL से एन्क्रिप्टेड डेटा निकालना
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get('v');

    if (v) {
        try {
            // डेटा को डिकोड करना
            const binaryStr = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
            const jsonStr = decodeURIComponent(escape(binaryStr));
            const data = JSON.parse(jsonStr);

            console.log("Data Received:", data); // चेक करने के लिए

            // 1. Class के आधार पर डेटा और इमेज अपडेट करना (ID की जगह Class)
            Object.keys(data).forEach(key => {
                // यहाँ हम id की जगह class (.) का उपयोग कर रहे हैं
                const elements = document.querySelectorAll('.' + key);

                // चूँकि एक क्लास कई जगह हो सकती है, इसलिए सब पर लूप चला रहे हैं
                elements.forEach(element => {
                    if (element.tagName === 'IMG') {
                        element.src = data[key]; // अगर इमेज टैग है तो लिंक (src) बदलें
                    } else {
                        element.innerText = data[key]; // अगर टेक्स्ट है तो टेक्स्ट बदलें
                    }
                });
            });

            // 2. टाइमर चालू करना (अगर form से timerDate आया है)
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

        // अगर शादी का समय आ गया है या पार हो गया है
        if (distance < 0) {
            clearInterval(interval);
            // टाइमर की जगह एक प्यारा सा मैसेज दिखाएं
            document.getElementById("timer").innerHTML = "<h3 style='color: white; font-family: Kalam;'>विवाह का शुभ दिन आ गया है!</h3>";
            return;
        }

        // दिन, घंटे, मिनट और सेकंड की गणना
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // HTML में टाइमर के नंबर अपडेट करना (यहाँ ID ही ठीक है क्योंकि टाइमर एक ही जगह है)
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    },
        1000);
}