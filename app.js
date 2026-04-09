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

database.ref('agenda').on('value', (snapshot) => {
    const data = snapshot.val();
    const tbody = document.getElementById('agenda-body');
    tbody.innerHTML = '';
    if (data) {
        Object.keys(data).forEach(key => {
            tbody.innerHTML += `<tr>
                <td style="width:150px;"><b>${data[key].time}</b></td>
                <td>${data[key].title}</td>
            </tr>`;
        });
    }
});