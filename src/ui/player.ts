import { HTML_NAME } from '../constant';
import { getElement } from './dom';

const player = getElement('#player');
const demoVideo = getElement<HTMLVideoElement>('#demo');
const playButton = getElement('#play');

let currentPakUrl = '';
let gameFrame: HTMLIFrameElement | null = null;

function showDemo() {
  demoVideo.hidden = false;
  playButton.hidden = false;
  demoVideo.play().catch(() => {});
}

function hideDemo() {
  demoVideo.pause();
  demoVideo.hidden = true;
  playButton.hidden = true;
}

export function loadDemo(videoUrl: string, pakUrl: string) {
  currentPakUrl = pakUrl;
  demoVideo.crossOrigin = 'anonymous';
  demoVideo.src = videoUrl;
  showDemo();
}

export function unloadDemo() {
  stopGame();
  demoVideo.pause();
  demoVideo.removeAttribute('src');
}

async function startGame() {
  try {
    await player.requestFullscreen();// we set fullscreen when a player click 
  } catch {
    alert('Fullscreen is not available on this browser');
    return;
  }

  hideDemo();

  gameFrame = document.createElement('iframe');
  gameFrame.src = `${HTML_NAME}?pak=${encodeURIComponent(currentPakUrl)}`;
  gameFrame.allow = 'fullscreen; autoplay; gamepad; cross-origin-isolated';
  player.appendChild(gameFrame);
  gameFrame.focus();
}


function stopGame() {
  if (!gameFrame) return;
  gameFrame.remove();
  gameFrame = null;
  showDemo();
}

playButton.addEventListener('click', startGame);

// when echap pressed we quit the game 
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) stopGame();
});