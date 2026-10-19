import { Game } from './game/Game';
import { resources } from './resources/ResourceLoader';
import { LoadingScene } from './scenes/LoadingScene';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas);
resources.sounds.unlockOnGesture(window);
game.setScene(new LoadingScene());
game.start();
