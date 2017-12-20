'use strict';

var DeathGuitar = require('../prefabs/weapon.js')

var Owl = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'owl', frame);

	// initialize your prefab here
	this.game.physics.arcade.enableBody(this);
	this.jumping = false;
	this.walking_speed = 200;
	this.jumping_height = 300;
	
	// animations
	this.animations.add('left', [0, 1, 2, 3], 10, true);
	this.animations.add('right', [5, 6, 7, 8], 10, true);
	
	this.weapon = this.game.add.deathguitar(5, 'wave');
	this.weapon.trackSprite(this, 0, 0);

};

Owl.prototype = Object.create(Phaser.Sprite.prototype);
Owl.prototype.constructor = Owl;

Owl.prototype.update = function() {

};

Owl.prototype.move = function(direction) {
	if (direction == "RIGHT") {
		this.body.velocity.x = this.walking_speed;
		this.animations.play('right');
	}
	else if (direction == "LEFT") {
		this.body.velocity.x = -this.walking_speed;
		this.animations.play('left');
		
	}
	if (direction == "UP") {
		this.body.velocity.y = -this.jumping_height;
	}
	if (direction == null) {
		this.body.velocity.x = 0;
	}
};

Owl.prototype.shoot = function() {
	console.log('fire!');
	this.weapon.fire();
};

module.exports = Owl;
