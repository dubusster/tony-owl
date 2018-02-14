'use strict';

var Owl = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'owl', frame);
	// initialize your prefab here
	this.game.physics.arcade.enableBody(this);

	this.trickCounter = 0;
	this.TRICK_TRIGGER = 1;
	this.jumping = false;
	this.walking_speed = 500;
	this.jumping_height = 700;
	this.STRENGTH = 500;

	// animations
	this.animations.add('left-standing', [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 20,
			true);
	this.animations.add('right-standing',
			[ 20, 21, 22, 23, 24, 25, 26, 27, 28 ], 20, true);
	this.animations.add('left', [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
			20);
	this.animations.add('right',
			[ 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 ], 20);
	this.animations.play('right-standing');
	// TODO: add trick animation

	this.isLastDirectionLeft = false;
	this.ATTACK_DELAY = 500; // wait at least 0.5 second (500ms) to next shot

	this.nextAttack = this.game.time.now;

};

Owl.prototype = Object.create(Phaser.Sprite.prototype);
Owl.prototype.constructor = Owl;

Owl.prototype.update = function() {
	this.can_attack = this.game.time.now > this.nextAttack;
	this.attacking = this.game.time.now < this.nextAttack;
};

Owl.prototype.move = function(direction) {

	if (direction == "RIGHT") {
		this.body.velocity.x = this.walking_speed;
		this.animations.play('right');
		this.isLastDirectionLeft = false;
	} else if (direction == "LEFT") {
		this.body.velocity.x = -this.walking_speed;
		this.animations.play('left');
		this.isLastDirectionLeft = true;

	}
	if (direction == "UP") {
		this.body.velocity.y = -this.jumping_height;
	}
	if (direction == null) {
		this.body.velocity.x = 0;

		if (this.isLastDirectionLeft) {
			this.animations.play('left-standing');
		} else {
			this.animations.play('right-standing');
		}

	}
};

Owl.prototype.trick = function() {
	if (!this.body.touching.down) {
		console.log('trick!');
		this.animations.play('trick');
		this.trickCounter++;
	}
};

Owl.prototype.attack = function() {
	if (this.trickCounter >= this.TRICK_TRIGGER) {
		this.nextAttack = this.game.time.now + this.ATTACK_DELAY;

		console.log('attack');
		// this.attacking = true;
		this.animations.play('attack');
		this.trickCounter--;
	}

};

module.exports = Owl;
