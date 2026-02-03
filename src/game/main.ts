import { Game } from './Game';
import { LoadingScene } from '../scenes/LoadingScene';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('game');
    game.setScene(new LoadingScene());
    game.start();
});
