const audio = document.getElementById('background-music');

window.addEventListener('load', () => {
    const audioFiles = {
        "index.html": "static/mp3/Lamp - For Lovers.mp3",
        "profile2.html": "static/mp3/Kendrick Lamar - N95.mp3",
    };

    const page = window.location.pathname.split("/").pop() || "index.html";
    if (audioFiles[page]) {
        audio.src = audioFiles[page];
    }

    audio.volume = 0.7;
    audio.load();
    audio.play();
});


    document.addEventListener("mousemove", function (event) {
        let right = document.querySelector(".right-transition");
        if (event.clientX > window.innerWidth - 100) { 
            right.style.opacity = "1"; 
        } else {
            right.style.opacity = "0";
        }
    });

    document.addEventListener("mousemove", function (mouse_left) {
        let left = document.querySelector(".left-transition");
        if (mouse_left.clientX < 100) { 
            left.style.opacity = "1"; 
        } else {
            left.style.opacity = "0";
        }
    });

    async function fetchDiscordActivity() {
        const token = localStorage.getItem("discord_token");
        if (!token) return;
    
        const response = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.json();
    
        const activityResponse = await fetch("https://discord.com/api/users/@me/activities", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const activities = await activityResponse.json();
    
        document.getElementById("discord-user").innerText = `Logged in as: ${userData.username}`;
        
        if (activities.length > 0) {
            document.getElementById("discord-activity").innerText = `Playing: ${activities[0].name}`;
        } else {
            document.getElementById("discord-activity").innerText = "No activity detected";
        }
    }
    
    fetchDiscordActivity();
    