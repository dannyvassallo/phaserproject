var map;
var tileset;
var layer;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

BasicGame.Game = function (game) {

  //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;    //  a reference to the currently running game
    this.add;   //  used to add sprites, text, groups, etc
    this.camera;  //  a reference to the game camera
    this.cache;   //  the game cache
    this.input;   //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;    //  for preloading assets
    this.math;    //  lots of useful common math operations
    this.sound;   //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;   //  the game stage
    this.time;    //  the clock
    this.tweens;    //  the tween manager
    this.state;     //  the state manager
    this.world;   //  the game world
    this.particles; //  the particle manager
    this.physics; //  the physics manager
    this.rnd;   //  the repeatable random number generator

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    // joystick
    this.sprite;
    this.pad;

    this.stick;

    this.buttonA;
    this.buttonB;
    this.buttonC;

};

BasicGame.Game.prototype = {

  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  create: function () {
    // this.physics.arcade.enable(this.sprite);

    this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

    this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
    this.stick.alignBottomLeft(0);

    this.buttonA = this.pad.addButton((this.game.width - 300), (this.game.height - 80), 'dpad', 'button1-up', 'button1-down');
    this.buttonA.onDown.add(this.pressButtonA, this);

    this.buttonB = this.pad.addButton((this.game.width - 200), (this.game.height - 160), 'dpad', 'button2-up', 'button2-down');
    this.buttonB.onDown.add(this.pressButtonB, this);

    this.buttonC = this.pad.addButton((this.game.width - 100), (this.game.height - 80), 'dpad', 'button3-up', 'button3-down');
    this.buttonC.onDown.add(this.pressButtonC, this);

    this.stage.backgroundColor = '#000000';

    bg = this.add.tileSprite(0, 0, 800, 600, 'background');
    bg.x = 0;
    bg.y = 0;
    bg.height = this.game.height;
    bg.width = this.game.width;
    bg.fixedToCamera = true;

    map = this.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    this.physics.arcade.gravity.y = 450;

    this.sprite = this.add.sprite(32, 32, 'dude');
    this.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.bounce.y = 0.1;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.setSize(20, 32, 5, 16);

    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('turn', [4], 20, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

    this.camera.follow(this.sprite);

    cursors = this.input.keyboard.createCursorKeys();
    jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },

  pressButtonA: function () {
    if(this.stick.isDown && this.stick.direction === Phaser.RIGHT && this.sprite.body.onFloor() && this.time.now > jumpTimer){
      this.sprite.body.velocity.y = -250;
      jumpTimer = this.time.now + 750;
    }
    else if(this.stick.isDown && this.stick.direction === Phaser.LEFT && this.sprite.body.onFloor() && this.time.now > jumpTimer){
      this.sprite.body.velocity.y = -250;
      jumpTimer = this.time.now + 750;
    } else if(this.sprite.body.onFloor() && this.time.now > jumpTimer){
      this.sprite.body.velocity.y = -250;
      jumpTimer = this.time.now + 750;
    }
  },

  pressButtonB: function () {

      // this.sprite.scale.set(Math.random() * 4);

  },

  pressButtonC: function () {

      // this.sprite.scale.set(1);
      // this.sprite.tint = 0xFFFFFF;
  },


  update: function () {

    this.physics.arcade.collide(this.sprite, layer);

    this.sprite.body.velocity.x = 0;

        if (this.stick.isDown && this.stick.direction === Phaser.LEFT)
        {
          this.sprite.body.velocity.x = -150;
          this.sprite.animations.play('left');
          if (facing != 'left'){
            facing = 'left';
          }
        }
        else if (this.stick.isDown && this.stick.direction === Phaser.RIGHT)
        {
          this.sprite.body.velocity.x = 150;
          this.sprite.animations.play('right');
          if (facing != 'right'){
            facing = 'right';
          }
        }
        else
        {
          if (cursors.left.isDown)
          {
              this.sprite.body.velocity.x = -150;

              if (facing != 'left')
              {
                  this.sprite.animations.play('left');
                  facing = 'left';
              }
          }
          else if (cursors.right.isDown)
          {
              this.sprite.body.velocity.x = 150;

              if (facing != 'right')
              {
                  this.sprite.animations.play('right');
                  facing = 'right';
              }
          }
          else
          {
              if (facing != 'idle')
              {
                  this.sprite.animations.stop();

                  if (facing == 'left')
                  {
                      this.sprite.frame = 0;
                  }
                  else
                  {
                      this.sprite.frame = 5;
                  }

                  facing = 'idle';
              }
          }
        }


    if (jumpButton.isDown && this.sprite.body.onFloor() && this.time.now > jumpTimer)
    {
        this.sprite.body.velocity.y = -250;
        jumpTimer = this.time.now + 750;
    }

  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  },

  resize: function(){
    this.stick.destroy();
    this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
    this.stick.alignBottomLeft(0);
    this.buttonA.destroy();
    this.buttonA = this.pad.addButton((this.game.width - 300), (this.game.height - 80), 'dpad', 'button1-up', 'button1-down');
    this.buttonA.onDown.add(this.pressButtonA, this);
    this.buttonB.destroy();
    this.buttonB = this.pad.addButton((this.game.width - 200), (this.game.height - 160), 'dpad', 'button2-up', 'button2-down');
    this.buttonB.onDown.add(this.pressButtonB, this);
    this.buttonC.destroy();
    this.buttonC = this.pad.addButton((this.game.width - 100), (this.game.height - 80), 'dpad', 'button3-up', 'button3-down');
    this.buttonC.onDown.add(this.pressButtonC, this);
  },

  render: function(game){
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(this.sprite);
    // game.debug.bodyInfo(this.sprite, 16, 24);
  }

};
