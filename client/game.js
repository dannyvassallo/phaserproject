var map;
var tileset;
var layer;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var menu;
var game;

BasicGame.Game = function () {
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

  preload: function () {

      this.load.atlas('dpad', 'assets/virtualjoystick/skins/dpad.png', 'assets/virtualjoystick/skins/dpad.json');
      this.load.image('ball', 'assets/virtualjoystick/beball1.png');
      this.load.image('bg', 'assets/virtualjoystick/space2.png');
      this.input.maxPointers = 2;

  },

  create: function () {
    // this.physics.arcade.enable(this.sprite);
    game = this.game;

    this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

    this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
    this.stick.alignBottomLeft(0);

    this.buttonA = this.pad.addButton((this.game.width - 300), (this.game.height - 80), 'dpad', 'button1-up', 'button1-down');
    this.buttonA.onDown.add(this.pressButtonA, this);
    this.buttonA.addKey(Phaser.Keyboard.SPACEBAR);
    this.buttonA.alignBottomRight(0);
    // var tapDiv = $('<div>').addClass('buttonA');
    // $(tapDiv).css('left',(this.game.width - 350));
    // $(tapDiv).css('top',(this.game.height - 130));
    // $('body').append(tapDiv);
    // this.buttonB = this.pad.addButton((this.game.width - 200), (this.game.height - 160), 'dpad', 'button2-up', 'button2-down');
    // this.buttonB.onDown.add(this.pressButtonB, this);

    // this.buttonC = this.pad.addButton((this.game.width - 100), (this.game.height - 80), 'dpad', 'button3-up', 'button3-down');
    // this.buttonC.onDown.add(this.pressButtonC, this);

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

    // Create a label to use as a button
    var w = this.game.width, h = this.game.height;
    pause_label = this.add.text(w - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;

        // Then add the menu
        menu = game.add.sprite(w/2, h/2, 'menu');
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(w/2, h-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    });

    // Add a input listener that can help us return from being paused
    this.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu
            var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
                y1 = h/2 - 180/2, y2 = h/2 + 180/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                // Display the choice
                choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{
                // Remove the menu and the label
                menu.destroy();
                choiseLabel.destroy();

                // Unpause the this
                game.paused = false;
            }
        }
    };

  },

  pressButtonA: function () {
    if(this.input.pointer1.isDown && this.sprite.body.onFloor() && this.time.now > jumpTimer)
    {
      this.sprite.body.velocity.y = -250;
      jumpTimer = this.time.now + 750;
    }
    else if(this.sprite.body.onFloor() && this.time.now > jumpTimer ){
      this.sprite.body.velocity.y = -250;
      jumpTimer = this.time.now + 750;
    }
  },

  // pressButtonB: function () {

  //     // this.sprite.scale.set(Math.random() * 4);
  //     this.sprite.scale.set(Math.random() * 4);

  // },

  // pressButtonC: function () {

  //     // this.sprite.scale.set(1);
  //     // this.sprite.tint = 0xFFFFFF;
  // },


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

  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  },

  resize: function(){
    this.stick.alignBottomLeft(0);
    this.buttonA.alignBottomRight(0);
    bg.x = 0;
    bg.y = 0;
    bg.height = this.game.height;
    bg.width = this.game.width;
    bg.fixedToCamera = true;
    layer.destroy();
    layer = map.createLayer('Tile Layer 1');
    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();
  },

  render: function(game){
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(this.sprite);
    // game.debug.bodyInfo(this.sprite, 16, 24);
  }

};
