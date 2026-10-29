import './style.css';
import { listGames, uploadGame } from './storage/remote';
import { setupCreateForm } from './ui/create';
import { setupGamePage, showGamePage } from './ui/game-page';
import { showGamesGrid, showMessage } from './ui/home';

async function refreshGames() {
  try {
    const games = await listGames();
    showGamesGrid(games, showGamePage);
  } catch (error) {
    console.error(error);
    showMessage('Could not load the games.');
  }
}

setupGamePage();

setupCreateForm(async (game) => {
  await uploadGame(game);
  await refreshGames();
});

refreshGames();