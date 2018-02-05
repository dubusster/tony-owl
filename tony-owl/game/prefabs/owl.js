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
	this.animations.add('left-standing', [0,1,2,3,4,5,6,7,8], 20, true);
	this.animations.add('right-standing', [20,21,22,23,24,25,26,27,28], 20, true);
	this.animations.add('left', [9,10,11,12,13,14,15,16,17,18,19], 20);
	this.animations.add('right', [29,30,31,32,33,34,35,36,37,38,39], 20);
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
		left = true;
		
	}
	if (direction == "UP") {
		this.body.velocity.y = -this.jumping_height;
		console.log('jump!');
	}
	if (direction == null) {
		this.body.velocity.x = 0;
		if (left) {
			this.animations.play('left-standing');
		}
		else {
			this.animations.play('right-standing');
		}
		var left = false;
		
	}
};

Owl.prototype.trick = function() {
	if (!this.body.touching.down) {		
	console.log('trick!');
	this.animations.play('trick');
	}
};

module.exports = Owl;
