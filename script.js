document.addEventListener('DOMContentLoaded', () => {
    const mascot = document.getElementById('mascot');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const arena = document.getElementById('forgive-arena');
    const steamSelect = document.getElementById('steam-select');
    const steamNextBtn = document.getElementById('steam-next-btn');
    const daySelect = document.getElementById('day-select');
    const treatNextBtn = document.getElementById('treat-next-btn');
    const confirmDay = document.getElementById('confirm-day');

    let chosenDay = '';

    /* ---------- mascot moods ---------- */
    function setMood(mood) {
        mascot.className = 'mood-' + mood;
    }
    function shakeMascot() {
        mascot.classList.add('shake');
        setTimeout(() => mascot.classList.remove('shake'), 550);
    }
    setMood('plead');

    /* ---------- floating leaves ---------- */
    const leavesBox = document.querySelector('.leaves');
    const leafChars = ['🍃', '🌿', '🍵'];
    for (let i = 0; i < 10; i++) {
        const leaf = document.createElement('span');
        leaf.className = 'leaf';
        leaf.textContent = leafChars[i % leafChars.length];
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDuration = (9 + Math.random() * 10) + 's';
        leaf.style.animationDelay = (Math.random() * 9) + 's';
        leaf.style.fontSize = (14 + Math.random() * 14) + 'px';
        leavesBox.appendChild(leaf);
    }

    /* ---------- the No button that refuses to be pressed ---------- */
    const noTexts = ['No 😤', 'Wait!', 'Pls 🥺', "I'll pay!", 'Extra treat??', "Don't leaf me", 'Brew-tal…', 'Okay ouch'];
    let dodges = 0;

    function dodge() {
        dodges++;
        // switch to absolute positioning inside the arena on first dodge
        if (noBtn.style.position !== 'absolute') {
            arena.style.position = 'relative';
            noBtn.style.position = 'absolute';
        }
        const maxX = arena.clientWidth - noBtn.offsetWidth;
        const maxY = arena.clientHeight - noBtn.offsetHeight;
        noBtn.style.left = Math.max(0, Math.random() * maxX) + 'px';
        noBtn.style.top = Math.max(0, Math.random() * maxY) + 'px';
        noBtn.textContent = noTexts[Math.min(dodges, noTexts.length - 1)];

        // Yes grows, No shrinks, resistance is futile
        const grow = Math.min(1 + dodges * 0.06, 1.5);
        yesBtn.style.fontSize = 16 * grow + 'px';
        noBtn.style.fontSize = Math.max(11, 16 - dodges) + 'px';

        setMood(dodges > 4 ? 'question' : 'plead');
        shakeMascot();
    }

    noBtn.addEventListener('mouseover', dodge);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });
    noBtn.addEventListener('click', () => {
        dodge();
        alert(randomFrom([
            'Error 404: grudge not found.',
            'That button is brew-tally out of service.',
            'This app runs on forgiveness only. Nice try.',
            'HR has ruled this a bestie-level offense, punishable by matcha.'
        ]));
    });

    /* ---------- Yes → step 2 ---------- */
    yesBtn.addEventListener('click', () => {
        setMood('excited');
        step1.style.display = 'none';
        step2.style.display = 'block';
    });

    /* ---------- steam level → step 3 (if survivable) ---------- */
    steamNextBtn.addEventListener('click', () => {
        const level = steamSelect.value;
        if (!level) {
            setMood('question');
            alert('Pick a steam level first! Mat-chan needs to know the damage.');
            return;
        }
        if (level === 'zero' || level === 'mild') {
            setMood('excited');
            step2.style.display = 'none';
            step3.style.display = 'block';
        } else if (level === 'medium') {
            setMood('question');
            shakeMascot();
            alert("50%? Acceptable-ish. Let's round down and never speak of it again.");
            step2.style.display = 'none';
            step3.style.display = 'block';
        } else if (level === 'high') {
            setMood('angry');
            shakeMascot();
            alert(randomFrom(['Have some mer-tea!', "Okay that's steep. Try again?", 'Whisk you would reconsider…']));
        } else {
            setMood('dead');
            shakeMascot();
            alert(randomFrom([
                'Mat-chan has passed away. Hope you\'re happy.',
                'HR said this falls under "bestie jurisdiction." Denied.',
                'Switching desks?? In THIS economy??'
            ]));
        }
    });

    /* ---------- pick a day, then the final letter ---------- */
    treatNextBtn.addEventListener('click', () => {
        chosenDay = daySelect.value;

        if (!chosenDay) {
            setMood('question');
            alert('Pick a day! The matcha waits for no one.');
            return;
        }
        if (chosenDay === 'never') {
            setMood('dead');
            shakeMascot();
            alert('"Never" is not on the menu. Please order again.');
            return;
        }

        setMood('love');
        step3.style.display = 'none';
        step4.style.display = 'block';
        confirmDay.textContent = chosenDay;
        confettiLeaves();
        sendEmail(chosenDay);
    });

    /* ---------- tea-leaf confetti ---------- */
    function confettiLeaves() {
        const chars = ['🍃', '🌿', '🍵', '💚', '🥐', '🍰'];
        for (let i = 0; i < 26; i++) {
            const bit = document.createElement('span');
            bit.className = 'leaf';
            bit.textContent = chars[Math.floor(Math.random() * chars.length)];
            bit.style.left = Math.random() * 100 + 'vw';
            bit.style.animationDuration = (3 + Math.random() * 4) + 's';
            bit.style.animationDelay = (Math.random() * 1.2) + 's';
            bit.style.fontSize = (16 + Math.random() * 16) + 'px';
            bit.style.opacity = '0.9';
            leavesBox.appendChild(bit);
            setTimeout(() => bit.remove(), 9000);
        }
    }

    /* ---------- optional EmailJS (configure in index.html first) ---------- */
    function sendEmail(day) {
        if (typeof emailjs === 'undefined') return; // not configured, skip quietly
        const templateParams = {
            to_name: 'Neil',
            to_email: 'neiljaviya4@gmail.com',
            availability: day
        };
        emailjs.send('service_kglqx7k', 'template_fpy829l', templateParams)
            .then(res => console.log('SUCCESS!', res.status))
            .catch(err => console.log('FAILED...', err));
    }

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
});
