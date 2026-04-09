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

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = username === "karsan" ? "ecenurcetiner1@gmail.com" : "";

    try {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('edit-section').style.display = 'block';
        loadAdminAgenda();
    } catch (error) {
        alert("Hatalı giriş.");
    }
}

function logout() {
    auth.signOut().then(() => {
        location.reload();
    });
}

function addEvent() {
    const time = document.getElementById('time').value;
    const title = document.getElementById('title').value;
    if(time && title) {
        database.ref('agenda').push({ time, title });
        document.getElementById('time').value = '';
        document.getElementById('title').value = '';
    }
}

function deleteEvent(key) {
    database.ref('agenda/' + key).remove();
}

function loadAdminAgenda() {
    database.ref('agenda').on('value', (snapshot) => {
        const data = snapshot.val();
        const tbody = document.getElementById('admin-agenda-body');
        tbody.innerHTML = '';
        if (data) {
            Object.keys(data).forEach(key => {
                tbody.innerHTML += `<tr>
                    <td><b>${data[key].time}</b></td>
                    <td>${data[key].title}</td>
                    <td><button class="delete-btn" onclick="deleteEvent('${key}')">Sil</button></td>
                </tr>`;
            });
        }
    });
}