import { Scene, Cameras, Display, GameObjects, Physics } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { vector2 } from '../types';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    worldZone: GameObjects.Zone;
    gamewidth: number;
    gameHeight: number;
    pinsCategory: number;
    coinsCategory: number;
    bucketCategory: number;
    coins: Set<Phaser.Physics.Matter.Image> = new Set();
    physicsShape: any;
    lastCoinId: null;
    scoreText: GameObjects.Text;
    coinsCountText: GameObjects.Text;
    score: number = 0;
    totalCoins: number = 100;

    constructor() {
        super('Game');
    }

    init() {
        this.gamewidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);
    }

    create() {
        this.camera = this.cameras.main;
        this.worldZone = this.add.zone(this.camera.centerX, this.camera.centerY, this.gamewidth, this.gameHeight);
        this.coins = new Set();
        this.pinsCategory = this.matter.world.nextCategory();
        this.coinsCategory = this.matter.world.nextCategory();
        this.bucketCategory = this.matter.world.nextCategory();
        this.physicsShape = this.cache.json.get("physicsShape");

        this.createBackground();
        this.createPins();
        this.handleInput();
        this.createRewardBuckets();

        // Register collision event between coin and bucket
        this.handleCoinVsBucketCollision();
    }

    update() {
        // Remove coins that are out of bounds
        this.coins.forEach((coin) => {
            if (coin.y > this.camera.height + 200) {
                coin.destroy();
                this.coins.delete(coin);
            }
        });
    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, `background-${Phaser.Math.Between(1, 2)}`).setOrigin(0.5).setDepth(0);
        this.background.setDisplaySize(this.camera.width, this.camera.height);
        Display.Align.In.Center(this.background, this.worldZone);

        const coinBg = this.add.image(0, 0, "coin-bg").setDepth(1);
        Display.Align.In.TopRight(coinBg, this.worldZone, -10, -10);

        this.scoreText = PhaserHelpers.addSimpleText(`${this.score}$`, 0, 0, this);
        Display.Align.In.Center(this.scoreText, coinBg, 20);

        this.coinsCountText = PhaserHelpers.addSimpleText(`Coins Left : ${this.totalCoins}`, 200, 60, this);
    }

    private createPins() {
        const startY = 280;
        const startX = 10;
        const rows = 13;
        const columns = 11;
        const horizontalSpacing = 90;
        const verticalSpacing = 95;
        const offsetX = 50;
        const offsetY = 50;
        const rowOffsetX = 50; // Offset for zigzag pattern

        // Loop through rows and columns to create obstacles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Calculate position based on row and column
                let x;
                if (row % 2 === 0) {
                    x = offsetX + col * horizontalSpacing;
                } else {
                    x = offsetX + col * horizontalSpacing + rowOffsetX;
                }
                const y = offsetY + row * verticalSpacing;

                // Create obstacle and add to scene
                const pin = this.add.circle(x + startX, y + startY, 15, 0xff6699).setOrigin(0.5);
                pin.setDepth(1);
                pin.setStrokeStyle(3, 0xefc53f);

                const matterPin = this.matter.add.gameObject(pin, {
                    isStatic: true,
                    label: "pin",
                    shape: "circle",
                    circleRadius: 15,
                    frictionStatic: 0,
                });
                matterPin.body.gameObject.setCollisionCategory(this.pinsCategory);
            }
        }
    }

    private handleInput() {
        const coinIndicator = this.add.image(0, 0, "coin").setScale(0.5).setDepth(2);
        coinIndicator.setVisible(false);

        const rect = PhaserHelpers.addRectangle({ x: 0, y: 0, width: this.camera.width - 50, height: 100, depth: 2, color: 0xffffff }, this, true);
        rect.setInteractive();
        rect.setAlpha(0.1);
        Display.Align.In.TopCenter(rect, this.worldZone, 0, -150);

        rect.on("pointerdown", (pointer) => {
            this.dropNewCoin({ x: pointer.x, y: rect.y + 20 });
        });

        rect.on("pointermove", (pointer, localX, localY, event) => {
            // console.log('pointerover');
            const posX = Phaser.Math.Snap.To(pointer.x, 25);
            const posY = rect.y + 20;

            coinIndicator.setVisible(true);
            coinIndicator.setPosition(posX, posY);
        });

        rect.on("pointerout", (pointer) => {
            coinIndicator.setVisible(false);
        });
    }

    private dropNewCoin(pos: vector2) {
        const coin = this.matter.add.image(pos.x, pos.y, "coin", null, {
            label: "coin",
            shape: "circle",
            circleRadius: 45,
        }).setScale(0.5).setDepth(2);

        coin.setFriction(0.005);
        coin.setBounce(1);
        coin.setCollisionCategory(this.coinsCategory);
        coin.setCollidesWith([this.coinsCategory, this.pinsCategory, this.bucketCategory]);
        this.coins.add(coin);

        // update HUD
        this.totalCoins -= 1;
        this.updateHUD();
    }

    private handleCoinVsBucketCollision() {
        this.matter.world.on("collisionstart", (event: Physics.Matter.Events.CollisionStartEvent) => {
            const bodyA = event.pairs[0]?.bodyA.gameObject; // bucket
            const bodyB = event.pairs[0]?.bodyB.gameObject; // coin

            if (this.lastCoinId === bodyB.body.id) return; // prevent multiple collision

            if (bodyA.body.label.startsWith("bucket") && bodyB.body.label.startsWith("coin")) {
                bodyB.setBounce(0, 0);
                bodyB.setMass(10000);
                bodyB.setAngularSpeed(0);
                bodyB.setAngularVelocity(0);
                bodyB.setFrictionAir(0.01);
                bodyB.setVelocity(0);
                bodyB.setSensor(true);
                this.lastCoinId = bodyB.body.id; // assign last coin id
                bodyB.body.collisionFilter.mask = 0;

                this.score += parseInt(bodyA.body.label.match(/\d+/)[0]) * 10;
                this.updateHUD();
            }
        });
    }

    private createRewardBuckets() {
        for (let i = 0; i < 8; i++) {
            const rnd = Phaser.Math.Between(1, 5);
            const key = i % 2 === 0 ? "lower-part-1" : "lower-part-2";
            const bucket = this.matter.add.image(0, 0, key, null, {
                shape: this.physicsShape.bucketShape,
                label: `bucket_${rnd}`,
                isSensor: true,
                isStatic: true,
            });
            bucket.setOrigin(0.5).setScale(1.25);
            bucket.body.position.y -= 80;
            bucket.setCollisionCategory(this.bucketCategory);
            Display.Align.In.BottomLeft(bucket, this.worldZone, i * -120 - 80, -40);
            const prizeText = PhaserHelpers.addSimpleText(`x${rnd}`, bucket.x, bucket.y + 70, this);
            prizeText.setDepth(10);
        }
    }

    updateHUD() {
        this.coinsCountText.setText(`Coins Left: ${this.totalCoins}`);
        this.scoreText.setText(`${this.score}$`);
    }

}
