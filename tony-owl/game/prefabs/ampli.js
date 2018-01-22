'use strict';

var Ampli = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'ampli', frame);

  	//enable physics on the enemy sprite
	// this is needed for collision detection.
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = true;
  
};

Ampli.prototype = Object.create(Phaser.Sprite.prototype);
Ampli.prototype.constructor = Ampli;

Ampli.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Ampli;
