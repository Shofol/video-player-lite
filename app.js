const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('.video-container video');

const controlsContainer = document.querySelector('.video-container .controls-container');

const playPauseButton = document.querySelector('.video-container .controls button.play-pause');
const rewindButton = document.querySelector('.video-container .controls button.rewind');
const fastForwardButton = document.querySelector('.video-container .controls button.fast-forward');
const volumeButton = document.querySelector('.video-container .controls button.volume');
const fullScreenButton = document.querySelector('.video-container .controls button.full-screen');
const playButton = playPauseButton.querySelector('.playing');
const pauseButton = playPauseButton.querySelector('.paused');
const fullVolumeButton = volumeButton.querySelector('.full-volume');
const mutedButton = volumeButton.querySelector('.muted');
const maximizeButton = fullScreenButton.querySelector('.maximize');
const minimizeButton = fullScreenButton.querySelector('.minimize');


const progressBar = document.querySelector('.video-container .progress-controls .progress-bar');
const watchedBar = document.querySelector('.video-container .progress-controls .progress-bar .watched-bar');
const timeLeft = document.querySelector('.video-container .progress-controls .time-remaining');

let controlsTimeout;
controlsContainer.style.opacity = '0';
watchedBar.style.width = '0px';
pauseButton.style.display = 'none';
minimizeButton.style.display = 'none';

const displayControls = () => {
  controlsContainer.style.opacity = '1';
  document.body.style.cursor = 'initial';
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
  }
  controlsTimeout = setTimeout(() => {
    controlsContainer.style.opacity = '0';
    document.body.style.cursor = 'none';
    removePlaybackControls();
  }, 5000);
};

const playPause = () => {
  if (video.paused) {
    // video.play();
    playButton.style.display = 'none';
    pauseButton.style.display = '';

    var playPromise = video.play();


    // In browsers that don’t yet support this functionality,
    // playPromise won’t be defined.
    if (playPromise !== undefined) {
      playPromise.then(function () {
        // Automatic playback started!
      }).catch(function (error) {
        // Automatic playback failed.
        // Show a UI element to let the user manually start playback.
      });
    }


  } else {
    video.pause();
    playButton.style.display = '';
    pauseButton.style.display = 'none';
  }
};


const toggleMute = () => {
  video.muted = !video.muted;
  if (video.muted) {
    fullVolumeButton.style.display = 'none';
    mutedButton.style.display = '';
  } else {
    fullVolumeButton.style.display = '';
    mutedButton.style.display = 'none';
  }
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement || !document.webkitCurrentFullScreenElement) {
    if (videoContainer.requestFullScreen) {
      // W3C API
      videoContainer.requestFullScreen();
    } else if (videoContainer.mozRequestFullScreen) {
      // Mozilla current API
      videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullScreen) {
      // Webkit current API
      videoContainer.webkitRequestFullScreen();
    } else if (video.webkitEnterFullScreen) {
      // This is the IOS Mobile edge case
      video.webkitEnterFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement || !document.webkitCurrentFullScreenElement) {
    maximizeButton.style.display = '';
    minimizeButton.style.display = 'none';
  } else {
    maximizeButton.style.display = 'none';
    minimizeButton.style.display = '';
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    playPause();
  }

  if (event.code === 'KeyM') {
    toggleMute();
  }

  if (event.code === 'KeyF') {
    toggleFullScreen();
  }

  displayControls();
});

document.addEventListener('mousemove', () => {
  displayControls();
});

video.addEventListener('timeupdate', () => {
  watchedBar.style.width = ((video.currentTime / video.duration) * 100) + '%';
  // TODO: calculate hours as well...
  const totalSecondsRemaining = video.duration - video.currentTime;
  // THANK YOU: BEGANOVICH
  const time = new Date(null);
  time.setSeconds(totalSecondsRemaining);
  let hours = null;

  if (totalSecondsRemaining >= 3600) {
    hours = (time.getHours().toString()).padStart('2', '0');
  }

  let minutes = (time.getMinutes().toString()).padStart('2', '0');
  let seconds = (time.getSeconds().toString()).padStart('2', '0');

  timeLeft.textContent = `${hours ? hours : '00'}:${minutes}:${seconds}`;
});

progressBar.addEventListener('click', (event) => {
  const pos = (event.pageX - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
  video.currentTime = pos * video.duration;
});

playPauseButton.addEventListener('click', playPause);

rewindButton.addEventListener('click', () => {
  video.currentTime -= 10;
});

fastForwardButton.addEventListener('click', () => {
  video.currentTime += 10;
});

volumeButton.addEventListener('click', toggleMute);

fullScreenButton.addEventListener('click', toggleFullScreen);

const setPlaybackSpeed = (value) => {
  const prevActivceButton = document.getElementsByClassName('playback-item-active')[0];
  if (prevActivceButton) {
    prevActivceButton.classList.remove('playback-item-active');
  }

  const prevActivceLabel = document.getElementsByClassName('speed-label-active')[0];
  if (prevActivceLabel) {
    prevActivceLabel.classList.remove('speed-label-active');
  }


  if (value === '.5') {
    const playbackButton = document.getElementsByClassName('playback-button')[0];
    playbackButton.classList.add('playback-item-active');
    video.playbackRate = .5;

    const speedLabel = document.getElementsByClassName('speed-label')[0];
    speedLabel.classList.add('speed-label-active');
  }
  else if (value === '.75') {
    const playbackButton = document.getElementsByClassName('playback-button')[1];
    playbackButton.classList.add('playback-item-active');
    video.playbackRate = .75;
    const speedLabel = document.getElementsByClassName('speed-label')[1];
    speedLabel.classList.add('speed-label-active');
  }
  else if (value === '1') {
    const playbackButton = document.getElementsByClassName('playback-button')[2];
    playbackButton.classList.add('playback-item-active');
    video.playbackRate = 1;
    const speedLabel = document.getElementsByClassName('speed-label')[2];
    speedLabel.classList.add('speed-label-active');
  }
  else if (value === '1.25') {
    const playbackButton = document.getElementsByClassName('playback-button')[3];
    playbackButton.classList.add('playback-item-active');
    video.playbackRate = 1.25;
    const speedLabel = document.getElementsByClassName('speed-label')[3];
    speedLabel.classList.add('speed-label-active');
  }
  else if (value === '1.5') {
    const playbackButton = document.getElementsByClassName('playback-button')[4];
    playbackButton.classList.add('playback-item-active');
    video.playbackRate = 4.0;
    const speedLabel = document.getElementsByClassName('speed-label')[4];
    speedLabel.classList.add('speed-label-active');
  }
}

const onSpeedButtonClick = () => {
  const playbackControls = document.querySelector('.playback-controls');
  playbackControls.style.display = 'block';
}

const removePlaybackControls = () => {
  const playbackControls = document.querySelector('.playback-controls');
  playbackControls.style.display = 'none';
}

const onVolumeChange = (value) => {
  video.volume = +value / 100;
}

const volumeInput = document.querySelector('.slider');

const showVolumeControl = () => {
  volumeInput.style.opacity = 1;
}

const removeVolumeControl = () => {
  volumeInput.style.opacity = 0;

}