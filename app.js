const firebaseConfig = {
    apiKey: "AIzaSyDSc42XmFPUeWevgpYiVG61eaigEHna-G4",
    authDomain: "karsan-kariyer-gunu-ajanda.firebaseapp.com",
    databaseURL: "https://karsan-kariyer-gunu-ajanda-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "karsan-kariyer-gunu-ajanda",
    storageBucket: "karsan-kariyer-gunu-ajanda.firebasestorage.app",
    messagingSenderId: "370590417461",
    appId: "1:370590417461:web:e6903ef974571de133277c",
    measurementId: "G-HGNZVWPEQ6"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function() {
    AOS.init({ duration: 800, once: true });
    checkDarkMode();
    initCountdown();
});

function toggleNav() {
    const nav = document.getElementById('nav-links');
    if(nav) nav.classList.toggle('show');
}

function checkDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.checked = isDark;
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.checked = isDark;
    }
}

function initCountdown() {
    const cdElement = document.getElementById('countdown');
    if (!cdElement) return;
    const targetDate = new Date('May 21, 2026 09:00:00').getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const d = targetDate - now;
        if (d < 0) { cdElement.innerHTML = "Etkinlik Başladı!"; return; }
        const days = Math.floor(d / (1000 * 60 * 60 * 24));
        const hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        cdElement.innerHTML = `${days} Gün ${hours} Saat ${mins} Dakika`;
    }, 1000);
}

function isCurrentEvent(timeStr) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const times = timeStr.split(' - ');
    if (times.length !== 2) return false;
    const [start, end] = times;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    return currentMinutes >= (startH * 60 + startM) && currentMinutes < (endH * 60 + endM);
}

database.ref('agenda').on('value', (snapshot) => {
    const tbody = document.getElementById('agenda-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const data = snapshot.val();
    if (data) {
        Object.keys(data).sort((a,b) => data[a].time.localeCompare(data[b].time)).forEach(key => {
            const activeClass = isCurrentEvent(data[key].time) ? 'class="active-event"' : '';
            tbody.innerHTML += `<tr ${activeClass}><td><b>${data[key].time}</b></td><td>${data[key].title}</td></tr>`;
        });
    }
});

function toggleNetworkForm() {
    const form = document.getElementById('network-form-section');
    if(form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addNetwork() {
    const name = document.getElementById('net-name').value;
    const uni = document.getElementById('net-uni').value;
    const dept = document.getElementById('net-dept').value;
    const linkedin = document.getElementById('net-linkedin').value;
    const linkedinPattern = /linkedin\.com/i;

    if (name && linkedin) {
        if (!linkedinPattern.test(linkedin)) {
            alert("Geçerli bir LinkedIn URL'si girin.");
            return;
        }
        database.ref('networking').push({ name, uni, dept, linkedin });
        ['net-name', 'net-uni', 'net-dept', 'net-linkedin'].forEach(id => document.getElementById(id).value = '');
        toggleNetworkForm();
    } else {
        alert("İsim Soyisim ve LinkedIn URL alanları zorunludur.");
    }
}

database.ref('networking').on('value', (snapshot) => {
    const grid = document.getElementById('networking-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const data = snapshot.val();
    if (data) {
        Object.keys(data).reverse().forEach(key => {
            const item = data[key];
            grid.innerHTML += `
                <div class="network-card" data-aos="zoom-in">
                    <div class="network-name">${item.name}</div>
                    <div class="network-uni">${item.uni}</div>
                    <div class="network-dept">${item.dept}</div>
                    <a href="${item.linkedin}" target="_blank" class="connect-btn">Bağlantı Kur</a>
                </div>`;
        });
    }
});
