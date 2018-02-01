'use strict';

var Guitar = function(velocity, game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'guitar', frame);

  	//enable physics on the enemy sprite
	// this is needed for collision detection.
	this.game.physics.arcade.enableBody(this);
	// Guitars just flow through the screen as motherfucking shurikens
	this.body.allowGravity = false;
	this.body.velocity.x = -Math.abs(velocity);
  
};

Guitar.prototype = Object.create(Phaser.Sprite.prototype);
Guitar.prototype.constructor = Guitar;

Guitar.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Guitar;
