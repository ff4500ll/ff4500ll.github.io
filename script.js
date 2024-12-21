const audio = document.getElementById('background-music');
    window.addEventListener('load', () => {
        audio.src = 'static/mp3/i want to hold your hand.mp3';
        audio.load();
    });