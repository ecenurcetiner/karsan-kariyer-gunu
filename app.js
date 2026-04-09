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

database.ref('agenda').on('value', (snapshot) => {
    const data = snapshot.val();
    const tbody = document.getElementById('agenda-body');
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
