import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.load.on('complete', () => { this.scene.start('Game') }, this);
        this.addLoadingBar();
    }

    addLoadingBar() {
        const { width } = this.cameras.main;
        const { height } = this.cameras.main;

        const progressBar = this.add.graphics();
        progressBar.fillStyle(0xEEEEEE, 0.5);
        progressBar.fillRect(width / 2 - 200, height / 2, 400, 15);

        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x4CCD99, 1);
        progressBox.fillRect(width / 2 - 200, height / 2, 400, 15);

        const text = this.make.text({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY + 50,
            text: "Loading...",
            style: {
                fontSize: "24px",
                fontFamily: "Roboto-Black",
                color: "white",
            },
        }).setOrigin(0.5);

        this.load.on('progress',
            (value: any) => {
                // console.log('loading ... ', value);
                text.setText(`Loading ... ${Math.round(value * 100)}%`);
                progressBox.clear();
                progressBox.fillStyle(0x4CCD99, 1);
                progressBox.fillRect(width / 2 - 200, height / 2, 400 * value, 15);
            },
            this,
        );
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('background-1', 'plinko/bg-star.jpg');
        this.load.image('background-2', 'plinko/bg-town.jpg');
        this.load.image('lower-part-1', 'plinko/lower-part-1.png');
        this.load.image('lower-part-2', 'plinko/lower-part-2.png');
        this.load.image('coin', 'plinko/coin.png');
        this.load.image('coin-bg', 'plinko/coin-bg.png');
        this.load.image('arrow-down', 'plinko/arrow-down.png');

        // load physics shape
        this.load.json('physicsShape', 'plinko/bucket_shape.json');

        this.load.image('background', 'bg.png');
    }

    create() { }
}
