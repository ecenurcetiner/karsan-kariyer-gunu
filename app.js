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

function isCurrentEvent(timeStr) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const times = timeStr.split(' - ');
    if (times.length !== 2) return false;
    const [start, end] = times;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    return currentMinutes >= startTotal && currentMinutes < endTotal;
}

// Ajanda Dinleyicisi
database.ref('agenda').on('value', (snapshot) => {
    const data = snapshot.val();
    const tbody = document.getElementById('agenda-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (data) {
        Object.keys(data).sort((a, b) => {
            const timeA = data[a].time.split(' - ')[0];
            const timeB = data[b].time.split(' - ')[0];
            return timeA.localeCompare(timeB);
        }).forEach(key => {
            const activeClass = isCurrentEvent(data[key].time) ? 'class="active-event"' : '';
            tbody.innerHTML += `<tr ${activeClass}>
                <td style="width:150px;"><b>${data[key].time}</b></td>
                <td>${data[key].title}</td>
            </tr>`;
        });
    }
});

// Networking Form Görünürlük Kontrolü
function toggleNetworkForm() {
    const form = document.getElementById('network-form-section');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Networking Fonksiyonları
function addNetwork() {
    const name = document.getElementById('net-name').value;
    const uni = document.getElementById('net-uni').value;
    const linkedin = document.getElementById('net-linkedin').value;
    const linkedinPattern = /linkedin\.com/i;

    if (name && linkedin) {
        if (!linkedinPattern.test(linkedin)) {
            alert("Lütfen geçerli bir LinkedIn URL'si girin.");
            return;
        }

        database.ref('networking').push({ name, uni, linkedin });
        document.getElementById('net-name').value = '';
        document.getElementById('net-uni').value = '';
        document.getElementById('net-linkedin').value = '';
        toggleNetworkForm();
        alert("Ağa başarıyla katıldınız.");
    } else {
        alert("Lütfen Ad Soyad ve LinkedIn URL alanlarını doldurun.");
    }
}

// Networking Dinleyicisi
database.ref('networking').on('value', (snapshot) => {
    const data = snapshot.val();
    const grid = document.getElementById('networking-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    if (data) {
        Object.keys(data).reverse().forEach(key => {
            const item = data[key];
            grid.innerHTML += `
                <div class="network-card">
                    <div class="network-name">${item.name}</div>
                    <div class="network-uni">${item.uni}</div>
                    <a href="${item.linkedin}" target="_blank" class="connect-btn">Bağlantı Kur</a>
                </div>
            `;
        });
    }
});
