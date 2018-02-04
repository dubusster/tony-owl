'use strict';

var DeathGuitar = require('../prefabs/weapon.js')

var Owl = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'owl', frame);

	// initialize your prefab here
	this.game.physics.arcade.enableBody(this);
	this.jumping = false;
	this.walking_speed = 500;
	this.jumping_height = 1800;
	
	// animations
	this.animations.add('left', [0,1], 5, true);
	this.animations.add('right', [3,4], 5, true);
	this.frame = 2;
	// TODO: add trick animation

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
		console.log('jump!');
	}
	if (direction == null) {
		this.body.velocity.x = 0;
		this.animations.stop();
		this.frame=2;
	}
};

Owl.prototype.trick = function() {
	if (!this.body.touching.down) {		
	console.log('trick!');
	this.animations.play('trick');
	}
};

module.exports = Owl;
