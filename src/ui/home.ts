import type { Game } from '../types';
import { getElement } from './dom';
import { EMPTY_GAME_STRING,DEMO_FRAME } from '../constant';

const grid = getElement('#games-grid');
const message = getElement('#games-message');

export function showMessage(text: string) {
  message.textContent = text;
}

// title upper and game lower
function createCard(game: Game, onSelect: (game: Game) => void): HTMLElement {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h2');
  title.textContent = game.title;

  const preview = document.createElement('video');
  preview.src = `${game.videoUrl}#t=${DEMO_FRAME}`; // show the first image of the video
  preview.preload = 'metadata';
  preview.muted = true;

  card.append(title, preview);
  card.addEventListener('click', () => onSelect(game));
  return card;
}


export function showGamesGrid(games: Game[], onSelect: (game: Game) => void) {
  grid.replaceChildren();
  showMessage(games.length === 0 ? EMPTY_GAME_STRING : '');

  for (const game of games) {
    grid.appendChild(createCard(game, onSelect));
  }
}