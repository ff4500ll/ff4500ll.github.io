const audio = document.getElementById('background-music');
    window.addEventListener('load', () => {
        audio.src = 'static/mp3/Lamp - For Lovers.mp3';
        audio.volume = 0.7;
        audio.load();
    });

