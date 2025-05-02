document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const loopBtn = document.getElementById('loopBtn');
  const songTitle = document.getElementById('songTitle');
  const timeRemaining = document.getElementById('timeRemaining');
  const playlist = [
    "music/A Million Miles Away (English Version).mp3",
    "music/Мой мармеладный (Speed Up).mp3",
    "music/Acordeão Funk.mp3",
    "music/Blah Blah Blah.mp3",
    "music/DERNIERE DANCE FUNK.mp3",
    "music/Roi (Sped Up).mp3",
    "music/Shoot My Shot!.mp3",
    "music/Vois Sur Ton Chemin.mp3",
    "music/Виртуальная любовь.mp3",
    "music/CELINE.mp3",
    "music/classical phonk.mp3",
    "music/Heads Will Roll (A-Trak Remix Radio Edit).mp3",
    "music/He's A Pirate.mp3",
    "music/Jenny (Hearteye Speed Mix).mp3",
    "music/Limbo.mp3",
    "music/Oh, Honey!.mp3",
  ];

  let currentTrack = 0;
  let loop = false;
  let isPlaying = false;

  function getFileName(path) {
    const parts = path.split('/');
    const file = parts[parts.length - 1];
    return file.replace(/\.[^/.]+$/, "");
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateTimeRemaining() {
    if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
      const remaining = audioPlayer.duration - audioPlayer.currentTime;
      timeRemaining.textContent = `Time left: ${formatTime(remaining)}`;
    } else {
      timeRemaining.textContent = '';
    }
  }

  function loadTrack(index) {
    audioPlayer.src = playlist[index];
    songTitle.textContent = getFileName(playlist[index]);
    if (isPlaying) {
      audioPlayer.play();
    }
  }

  function playPause() {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playPauseBtn.textContent = 'Play';
    } else {
      audioPlayer.play();
      isPlaying = true;
      playPauseBtn.textContent = 'Pause';
    }
  }

  function nextTrack() {
    currentTrack++;
    if (currentTrack >= playlist.length) {
      currentTrack = 0;
    }
    loadTrack(currentTrack);
  }

  function prevTrack() {
    currentTrack--;
    if (currentTrack < 0) {
      currentTrack = playlist.length - 1;
    }
    loadTrack(currentTrack);
  }

  audioPlayer.addEventListener('ended', () => {
    if (loop) {
      audioPlayer.play();
    } else {
      nextTrack();
    }
  });

  audioPlayer.addEventListener('timeupdate', updateTimeRemaining);

  playPauseBtn.addEventListener('click', playPause);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  loopBtn.addEventListener('click', () => {
    loop = !loop;
    loopBtn.textContent = loop ? 'Loop On' : 'Loop Off';
  });

  loadTrack(currentTrack);
});
