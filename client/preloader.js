BasicGame.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    this.load.atlas('dpad', 'assets/virtualjoystick/skins/dpad.png', 'assets/virtualjoystick/skins/dpad.json');
    this.load.image('ball', 'assets/virtualjoystick/beball1.png');
    this.load.image('bg', 'assets/virtualjoystick/space1.png');

    //  These are the assets we loaded in Boot.js
    //  A nice sparkly background and a loading progress bar

    this.background = this.add.sprite(0, 0, 'preloaderBackground');
    this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.

    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    //  You can find all of these assets in the Phaser Examples repository

      this.load.image('tetris1', 'assets/sprites/tetrisblock1.png');
      this.load.image('tetris2', 'assets/sprites/tetrisblock2.png');
      this.load.image('tetris3', 'assets/sprites/tetrisblock3.png');
      this.load.image('hotdog', 'assets/sprites/hotdog.png');
      this.load.image('starfield', 'assets/skies/deep-space.jpg');
      this.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('tiles-1', 'assets/tiles-1.png');
      this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
      this.load.spritesheet('droid', 'assets/droid.png', 32, 32);
      this.load.image('starSmall', 'assets/star.png');
      this.load.image('starBig', 'assets/star2.png');
      this.load.image('background', 'assets/background2.png');

  },

  create: function () {

    this.state.start('Game');

  }

};
