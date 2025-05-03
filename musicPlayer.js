document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const loopBtn = document.getElementById('loopBtn');
  const volumeSlider = document.getElementById('volumeSlider');
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

  function savePlayerState() {
    const state = {
      currentTrack,
      isPlaying,
      volume: audioPlayer.volume,
      currentTime: audioPlayer.currentTime
    };
    localStorage.setItem('musicPlayerState', JSON.stringify(state));
  }

  function loadPlayerState() {
    const stateJSON = localStorage.getItem('musicPlayerState');
    if (stateJSON) {
      try {
        const state = JSON.parse(stateJSON);
        if (state.currentTrack !== undefined && state.currentTrack >= 0 && state.currentTrack < playlist.length) {
          currentTrack = state.currentTrack;
        }
        if (typeof state.isPlaying === 'boolean') {
          isPlaying = state.isPlaying;
        }
        if (typeof state.volume === 'number' && state.volume >= 0 && state.volume <= 1) {
          audioPlayer.volume = state.volume;
          volumeSlider.value = state.volume;
        }
      } catch (e) {
        console.error('Failed to parse music player state from localStorage', e);
      }
    }
  }

  function loadTrack(index) {
    audioPlayer.src = playlist[index];
    songTitle.textContent = getFileName(playlist[index]);

    audioPlayer.addEventListener('loadedmetadata', function onLoadedMetadata() {
      audioPlayer.removeEventListener('loadedmetadata', onLoadedMetadata);
      const stateJSON = localStorage.getItem('musicPlayerState');
      if (stateJSON) {
        try {
          const state = JSON.parse(stateJSON);
          if (typeof state.currentTime === 'number' && state.currentTime >= 0 && state.currentTime < audioPlayer.duration) {
            audioPlayer.currentTime = state.currentTime;
          }
        } catch (e) {
          console.error('Failed to parse music player state from localStorage', e);
        }
      }
      if (isPlaying) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            isPlaying = false;
            playPauseBtn.textContent = 'Play';
          });
        }
      }
    });
  }

  function playPause() {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playPauseBtn.textContent = 'Play';
    } else {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          playPauseBtn.textContent = 'Pause';
          savePlayerState();
        }).catch(error => {
          isPlaying = false;
          playPauseBtn.textContent = 'Play';
        });
      } else {
        isPlaying = true;
        playPauseBtn.textContent = 'Pause';
        savePlayerState();
      }
      return;
    }
    savePlayerState();
  }

  function nextTrack() {
    currentTrack++;
    if (currentTrack >= playlist.length) {
      currentTrack = 0;
    }
    loadTrack(currentTrack);
    savePlayerState();
  }

  function prevTrack() {
    currentTrack--;
    if (currentTrack < 0) {
      currentTrack = playlist.length - 1;
    }
    loadTrack(currentTrack);
    savePlayerState();
  }

  audioPlayer.addEventListener('ended', () => {
    if (loop) {
      audioPlayer.play();
    } else {
      nextTrack();
    }
  });

  let saveTimeout = null;
  let cachedState = null;

  function throttledSavePlayerState() {
    if (saveTimeout) return;
    saveTimeout = setTimeout(() => {
      savePlayerState();
      saveTimeout = null;
    }, 1000);
  }

  function loadPlayerState() {
    if (cachedState) return cachedState;
    const stateJSON = localStorage.getItem('musicPlayerState');
    if (stateJSON) {
      try {
        cachedState = JSON.parse(stateJSON);
        if (cachedState.currentTrack !== undefined && cachedState.currentTrack >= 0 && cachedState.currentTrack < playlist.length) {
          currentTrack = cachedState.currentTrack;
        }
        if (typeof cachedState.isPlaying === 'boolean') {
          isPlaying = cachedState.isPlaying;
        }
        if (typeof cachedState.volume === 'number' && cachedState.volume >= 0 && cachedState.volume <= 1) {
          audioPlayer.volume = cachedState.volume;
          volumeSlider.value = cachedState.volume;
        }
        return cachedState;
      } catch (e) {
        console.error('Failed to parse music player state from localStorage', e);
      }
    }
    return null;
  }

  audioPlayer.addEventListener('timeupdate', () => {
    updateTimeRemaining();
    throttledSavePlayerState();
  });

  playPauseBtn.addEventListener('click', playPause);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  loopBtn.addEventListener('click', () => {
    loop = !loop;
    if (loop) {
      loopBtn.classList.add('loop-active');
    } else {
      loopBtn.classList.remove('loop-active');
    }
  });

  volumeSlider.value = audioPlayer.volume;
  volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
    savePlayerState();
  });

  loadPlayerState();
  loadTrack(currentTrack);
  if (isPlaying) {
    audioPlayer.play();
    playPauseBtn.textContent = 'Pause';
  } else {
    playPauseBtn.textContent = 'Play';
  }
});
