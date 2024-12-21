const audio = document.getElementById('background-music');
    window.addEventListener('load', () => {
        audio.src = 'static/mp3/DUSTCUTTER.mp3';
        audio.load();
    });