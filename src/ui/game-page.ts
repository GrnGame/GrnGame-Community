import type { Game } from '../types';
import { getElement } from './dom';
import { loadDemo, unloadDemo } from './player';

const homeView = getElement('#home-view');
const gameView = getElement('#game-view');
const titleText = getElement('#game-title');
const descriptionText = getElement('#game-description');
const authorText = getElement('#game-author');

function showHomePage() {
  unloadDemo();
  gameView.hidden = true;
  homeView.hidden = false;
}

// we show title + description + author 
export function showGamePage(game: Game) {
  titleText.textContent = game.title;
  descriptionText.textContent = game.description;
  authorText.textContent = game.author;

  loadDemo(game.videoUrl, game.pakUrl);

  homeView.hidden = true;
  gameView.hidden = false;
}

export function setupGamePage() {
  getElement('#back').addEventListener('click', showHomePage);
}   