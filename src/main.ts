import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Game, Types } from "phaser";

const matterDebugConfig = {
    showAxes: true,
    showAngleIndicator: true,
    angleColor: 0xe81153,

    showCollisions: true,
    collisionColor: 0xf5950c,

    showBody: true,
    showStaticBody: true,
    showInternalEdges: true,

    renderFill: false,
    renderLine: true,

    fillColor: 0x106909,
    fillOpacity: 1,
    lineColor: 0x28de19,
    lineOpacity: 1,
    lineThickness: 5,

    staticFillColor: 0x0d177b,
    staticLineColor: 0x1327e4,

    showSleeping: true,
    staticBodySleepOpacity: 1,
    sleepFillColor: 0x464646,
    sleepLineColor: 0x999a99,
};

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1920,
    parent: 'game-container',
    backgroundColor: '#353232',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1,
                x: 0
            },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

export default new Game(config);
