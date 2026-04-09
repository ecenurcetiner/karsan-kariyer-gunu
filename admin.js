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

// Saat ve dakika seçeneklerini doldurma
function fillTimeSelectors() {
    const sh = document.getElementById('start-h');
    const sm = document.getElementById('start-m');
    const eh = document.getElementById('end-h');
    const em = document.getElementById('end-m');

    for(let i=8; i<=20; i++) {
        let val = i < 10 ? '0'+i : i;
        sh.innerHTML += `<option value="${val}">${val}</option>`;
        eh.innerHTML += `<option value="${val}">${val}</option>`;
    }
    for(let i=0; i<60; i+=5) {
        let val = i < 10 ? '0'+i : i;
        sm.innerHTML += `<option value="${val}">${val}</option>`;
        em.innerHTML += `<option value="${val}">${val}</option>`;
    }
}

async function login() {
    const userInp = document.getElementById('username').value;
    const passInp = document.getElementById('password').value;
    const targetEmail = "ecenurcetiner1@gmail.com";

    if (userInp === "karsan") {
        try {
            await auth.signInWithEmailAndPassword(targetEmail, passInp);
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('edit-section').style.display = 'block';
            fillTimeSelectors();
            loadAdminAgenda();
        } catch (error) {
            alert("Giriş başarısız.");
        }
    }
}

function addEvent() {
    const sh = document.getElementById('start-h').value;
    const sm = document.getElementById('start-m').value;
    const eh = document.getElementById('end-h').value;
    const em = document.getElementById('end-m').value;
    const title = document.getElementById('title').value;

    const formattedTime = `${sh}:${sm} - ${eh}:${em}`;

    if (title) {
        database.ref('agenda').push({ time: formattedTime, title: title });
        document.getElementById('title').value = '';
    }
}

function deleteEvent(key) {
    if (confirm("Silinsin mi?")) database.ref('agenda/' + key).remove();
}

function logout() {
    auth.signOut().then(() => location.reload());
}

function loadAdminAgenda() {
    database.ref('agenda').on('value', (snapshot) => {
        const data = snapshot.val();
        const tbody = document.getElementById('admin-agenda-body');
        tbody.innerHTML = '';
        if (data) {
            Object.keys(data).sort((a,b) => data[a].time.localeCompare(data[b].time)).forEach(key => {
                tbody.innerHTML += `<tr>
                    <td><b>${data[key].time}</b></td>
                    <td>${data[key].title}</td>
                    <td><button class="delete-btn" onclick="deleteEvent('${key}')">Sil</button></td>
                </tr>`;
            });
        }
    });
}
