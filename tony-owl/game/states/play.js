
  'use strict';
  
  var Ground = require('../prefabs/ground.js')
  
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 500;
      
      this.background = this.add.tileSprite(0, 0,this.game.width, this.game.height, 'background');
      this.background.autoScroll(-100, 0);
      
      // adding ground to game
      var ground_height = 50;
      this.ground = new Ground(this.game, 0, this.game.height-ground_height, this.game.width, ground_height);
      this.game.add.existing(this.ground);
      
//      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
//      this.sprite.inputEnabled = true;
//      
//      this.game.physics.arcade.enable(this.sprite);
//      this.sprite.body.collideWorldBounds = true;
//      this.sprite.body.bounce.setTo(1,1);
//      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
//      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);
//
//      this.sprite.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;