import { GameObjects, Scene } from "phaser";

export const tweenAlpha = (targets: GameObjects.GameObject[] | GameObjects.GameObject, scene: Scene) => {
    scene.tweens.add({
        targets: targets,
        alpha: 0,
        duration: 2000,
        yoyo: true,
        repeat: -1
    });
}