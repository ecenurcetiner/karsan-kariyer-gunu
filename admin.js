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
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", function() {
    AOS.init({ duration: 800, once: true });
});

function toggleNav() {
    const nav = document.getElementById('nav-links');
    if(nav) nav.classList.toggle('show');
}

function fillTimeSelectors() {
    const ids = ['start-h', 'end-h', 'start-m', 'end-m'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        const limit = id.includes('-h') ? 24 : 60;
        const step = id.includes('-m') ? 5 : 1;
        for(let i=0; i<limit; i+=step) {
            let val = i < 10 ? '0'+i : i;
            el.innerHTML += `<option value="${val}">${val}</option>`;
        }
    });
}

async function login() {
    const userInp = document.getElementById('username').value;
    const passInp = document.getElementById('password').value;
    if (userInp === "karsan") {
        try {
            await auth.signInWithEmailAndPassword("ecenurcetiner1@gmail.com", passInp);
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('edit-section').style.display = 'block';
            fillTimeSelectors();
            loadAdminAgenda();
            loadAdminNetwork();
        } catch (e) { alert("Yetkisiz Erişim."); }
    }
}

function showSection(id) {
    ['agenda-edit', 'network-edit'].forEach(s => {
        const el = document.getElementById(s);
        if(el) el.style.display = s === id ? 'block' : 'none';
    });
}

function addEvent() {
    const time = `${document.getElementById('start-h').value}:${document.getElementById('start-m').value} - ${document.getElementById('end-h').value}:${document.getElementById('end-m').value}`;
    const title = document.getElementById('title').value;
    if (title) {
        database.ref('agenda').push({ time, title });
        document.getElementById('title').value = '';
    }
}

function deleteEvent(key) { if(confirm("Silinsin mi?")) database.ref('agenda/' + key).remove(); }
function deleteNetwork(key) { if(confirm("Silinsin mi?")) database.ref('networking/' + key).remove(); }

function loadAdminAgenda() {
    database.ref('agenda').on('value', (snapshot) => {
        const tbody = document.getElementById('admin-agenda-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(k => {
                tbody.innerHTML += `<tr><td>${data[k].time}</td><td>${data[k].title}</td><td><button onclick="deleteEvent('${k}')" class="delete-btn">X</button></td></tr>`;
            });
        }
    });
}

function loadAdminNetwork() {
    database.ref('networking').on('value', (snapshot) => {
        const tbody = document.getElementById('admin-network-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(k => {
                tbody.innerHTML += `<tr><td>${data[k].name}</td><td>${data[k].uni}</td><td><button onclick="deleteNetwork('${k}')" class="delete-btn">X</button></td></tr>`;
            });
        }
    });
}

function logout() { auth.signOut().then(() => location.reload()); }
