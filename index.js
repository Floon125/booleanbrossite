window.onload = function () {

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
    const nicknameInput = document.getElementById("newIdInput"); // reused as nickname field

    let currentPlayerData = null;
    let currentPlayerId = null;

    outputBox.classList.add("hidden");

    // Load the player information
    input.addEventListener("keydown", function (e) {

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

   
    document.getElementById("copyBtn").addEventListener("click", () => {

        const nickname = nicknameInput.value.trim();

        if (!currentPlayerData || !currentPlayerId) {
            output.textContent = "⚠️ Load a player first.";
            return;
        }

        if (!nickname) {
            output.textContent = "⚠️ Enter a nickname.";
            return;
        }

        const db = firebase.database();

 
        currentPlayerData.nickname = nickname;

        db.ref("players/" + currentPlayerId).update({
            nickname: nickname
        })
        .then(() => {
            output.textContent = `✅ Nickname set to "${nickname}"`;
            loadTopScores(); // refresh leaderboard
        })
        .catch(err => {
            output.textContent = "Error: " + err;
        });
    });
// button that downlaods
    document.getElementById("downloadBtn").addEventListener("click", () => {

        if (!currentPlayerData) {
            output.textContent = "⚠️ No save loaded.";
            return;
        }

        saveJSON(currentPlayerData, "save.infect");
    });

    // paralaxx scroll thingy
    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        const hero = document.querySelector(".hero-img");

        if (hero) {
            hero.style.transform = `translateY(${y * 0.4}px)`;
        }
    });


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


    loadTopScores();
};


// DOWNLOAda fuunction
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

function loadTopScores() {
    const db = firebase.database();

    db.ref("players").once("value")
        .then(snapshot => {

            if (!snapshot.exists()) return;

            const data = snapshot.val();

            const playersArray = Object.entries(data).map(([id, player]) => ({
                id,
                ...player
            }));

            const filteredPlayers = playersArray.filter(player =>
                player.nickname && player.nickname.trim() !== ""
            );

            // sort descending by score
            filteredPlayers.sort((a, b) => (b.highScore || 0) - (a.highScore || 0));

            const top5 = filteredPlayers.slice(0, 5);

            const list = document.getElementById("leaderboard");
            list.innerHTML = "";

            top5.forEach((player) => {
                const li = document.createElement("li");

                // nickname is guaranteed to exist now
                li.textContent = `${player.nickname} : ${player.highScore || 0}`;

                list.appendChild(li);
            });

        })
        .catch(err => {
            console.error("Leaderboard error:", err);
        });
}
