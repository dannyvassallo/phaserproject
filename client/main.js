import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.game.onCreated(function gameOnCreated() {
  //  100% of the browser window - see Boot.js for additional configuration
  var game = new Phaser.Game("100%", "100%", Phaser.AUTO, '');
  //  Add the States your game has.
  //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
  game.state.add('Boot', BasicGame.Boot);
  game.state.add('Preloader', BasicGame.Preloader);
  game.state.add('MainMenu', BasicGame.MainMenu);
  game.state.add('Game', BasicGame.Game);
  //  Now start the Boot state.
  game.state.start('Boot');
});

Template.game.rendered = function(){
  console.log('rendered');
  setTimeout(function(){
    $('body').append($('<div>').addClass('go-fullscreen'));
    //using HTML5 for fullscreen (only newest Chrome + FF)
    $(document).on('click', '.go-fullscreen',function(){
      $("canvas")[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); //Chrome
      $("canvas")[0].mozRequestFullScreen(); //Firefox
    });
  }, 10)
};
