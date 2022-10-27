import 'phaser';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('demo');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    // this.load.image('logo', 'assets/phaser3-logo.png');
    // this.load.image('libs', 'assets/libs.png');
    // this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
    // this.load.glsl('stars', 'assets/starfields.glsl.js');
  }

  create() {
    const image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky');
    const scaleX = this.cameras.main.width / image.width;
    const scaleY = this.cameras.main.height / image.height;
    const scale = Math.max(scaleX, scaleY);
    image.setScale(scale).setScrollFactor(0);

    // ground
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // player
    const player = this.physics.add.sprite(300, 0, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

    // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

    // this.add.image(400, 300, 'libs');

    // const logo = this.add.image(400, 70, 'logo');

    // this.tweens.add({
    //   targets: logo,
    //   y: 350,
    //   duration: 1500,
    //   ease: 'Sine.inOut',
    //   yoyo: true,
    //   repeat: -1
    // })
  }
}

const bodyMargin = 8;
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  // width: window.innerWidth - bodyMargin * 2,
  // height: window.innerHeight - bodyMargin * 2,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: Demo,
};

const game = new Phaser.Game(config);
