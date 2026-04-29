window.onload = function() {

    const firebaseConfig = {
        apiKey: "AIzaSyDmvYD-OTIEezNqDv4fyGL5mslfEtoGRRE",
        authDomain: "intotheorigin-d9776.firebaseapp.com",
        databaseURL: "https://intotheorigin-d9776-default-rtdb.firebaseio.com",
        projectId: "intotheorigin-d9776",
        storageBucket: "intotheorigin-d9776.firebasestorage.app",
        messagingSenderId: "534425888442",
        appId: "1:534425888442:web:fabd5f42e9fb2c24280483",
        measurementId: "G-DZ9NTLYLHZ"
    };

    firebase.initializeApp(firebaseConfig);

    const input = document.getElementById("playerInput");
    const output = document.getElementById("output");
    const outputBox = document.getElementById("outputBox");
    const newIdInput = document.getElementById("newIdInput");

    let currentPlayerData = null;
    let currentPlayerId = null;

    // hide panel on load
    outputBox.classList.add("hidden");

    // ENTER SEARCH
    input.addEventListener("keydown", function(e) {

        if (e.key !== "Enter") return;

        const playerId = input.value.trim();

        if (!playerId) {
            output.textContent = "⚠️ Enter a valid Player ID.";
            outputBox.classList.remove("hidden");
            return;
        }

        output.textContent = "Loading...";
        outputBox.classList.remove("hidden");

        const playerRef = firebase.database().ref("players/" + playerId);

        playerRef.once("value")
        .then(snapshot => {

            const data = snapshot.val();

            if (!data) {
                currentPlayerData = null;
                output.textContent = "❌ Player not found.";
                return;
            }

            currentPlayerId = playerId;
            currentPlayerData = data;

            output.textContent = JSON.stringify(data, null, 2);
        })
        .catch(err => {
            output.textContent = "Error: " + err;
        });
    });

    // COPY SAVE
    document.getElementById("copyBtn").addEventListener("click", () => {

        const newId = newIdInput.value.trim();

        if (!currentPlayerData) {
            output.textContent = "⚠️ Load a player first.";
            return;
        }

        if (!newId) {
            output.textContent = "⚠️ Enter a new ID.";
            return;
        }

        const db = firebase.database();

        db.ref("players/" + newId).once("value")
        .then(snapshot => {

            if (snapshot.exists()) {
                throw "⚠️ That ID already exists.";
            }

            return db.ref("players/" + newId).set(currentPlayerData);
        })
        .then(() => {

            currentPlayerId = newId;

            output.textContent = `✅ Save copied to "${newId}"`;
        })
        .catch(err => {
            output.textContent = "Error: " + err;
        });
    });

    // DOWNLOAD SAVE FILE
    document.getElementById("downloadBtn").addEventListener("click", () => {

        if (!currentPlayerData) {
            output.textContent = "⚠️ No save loaded.";
            return;
        }

        saveJSON(currentPlayerData, "save.infect");
    });

    // PARALLAX
    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        const hero = document.querySelector(".hero-img");

        if (hero) {
            hero.style.transform = `translateY(${y * 0.4}px)`;
        }
    });

    // FADE-IN
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".fade-in").forEach(el => {
        observer.observe(el);
    });

};


// DOWNLOAD FUNCTION
function saveJSON(data, filename = "save.infect") {

    const jsonStr = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
