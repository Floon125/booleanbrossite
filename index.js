

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

    // Listen for ENTER key
    input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {

            const playerId = input.value.trim();

            if (!playerId) {
                output.textContent = "Please enter a player ID.";
                return;
            }

            // Reference specific player
            const playerRef = firebase.database().ref("players/" + playerId);

            playerRef.once("value")
            .then(function(snapshot) {
                const data = snapshot.val();

                if (data) {
                    // Pretty print JSON
                    output.textContent = JSON.stringify(data, null, 2);
		    saveJSON(data)
                } else {
                    output.textContent = "Player not found.";
                }
            })
            .catch(function(error) {
                output.textContent = "Error: " + error;
            });
        }
    });
}

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