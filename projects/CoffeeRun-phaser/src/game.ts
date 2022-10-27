import 'phaser';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('demo');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('libs', 'assets/libs.png');
    this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
    this.load.glsl('stars', 'assets/starfields.glsl.js');
  }

  create() {
    const image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sky');
    const scaleX = this.cameras.main.width / image.width;
    const scaleY = this.cameras.main.height / image.height;
    const scale = Math.max(scaleX, scaleY);
    image.setScale(scale).setScrollFactor(0);

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
  width: window.innerWidth - bodyMargin * 2,
  height: window.innerHeight - bodyMargin * 2,
  scene: Demo,
};

const game = new Phaser.Game(config);
