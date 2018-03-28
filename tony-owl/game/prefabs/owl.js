'use strict';

var PLAYER_HEALTH = 5;
var TRICKS_LIMIT = 10;

var attack_animation;

var Owl = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'owl', frame);
	// initialize your prefab here
	this.game.physics.arcade.enableBody(this);

	this.tricks = 0;
	this.PROTECT_TRICK_TRIGGER = 1;
	this.BLAST_TRICK_TRIGGER = 3;
	this.SUPER_TRICK_TRIGGER = 5;

	this.jumping = false;
	this.walking_speed = 400;
	this.jumping_height = 900;
	this.STRENGTH = 500;
	this.health = PLAYER_HEALTH;
	this.maxHealth = PLAYER_HEALTH;

	// animations
	this.animations.add('left-standing', [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 20,
			true);
	this.animations.add('right-standing',
			[ 20, 21, 22, 23, 24, 25, 26, 27, 28 ], 20, true);
	this.animations.add('left', [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
			20);
	this.animations.add('right',
			[ 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 ], 20);
	attack_animation = this.animations.add('protect', [ 40, 41, 42, 43, 44, 45,
			46, 47, 48, 49, 50, 51, 52, 53, 54, 55 ], 20);

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
	if (!this.attacking) {
		this.protecting = false;
		this.blasting = false;
	}
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
		if (attack_animation.isFinished) {

			if (this.isLastDirectionLeft) {
				this.animations.play('left-standing');
			} else {
				this.animations.play('right-standing');
			}
		}

	}
};

Owl.prototype.jump = function() {
	if (this.body.blocked.down) {
		this.move("UP");
	}
};

Owl.prototype.trick = function() {
	if (!this.body.blocked.down && this.tricks < TRICKS_LIMIT) {
		console.log('trick!');
		this.animations.play('trick');
		this.tricks++;
	}
};

Owl.prototype.protect = function() {
	if (this.tricks >= this.PROTECT_TRICK_TRIGGER) {
		this.nextAttack = this.game.time.now + this.ATTACK_DELAY;

		console.log('protect');
		// this.attacking = true;

		attack_animation = this.animations.play('protect');
		this.tricks -= this.PROTECT_TRICK_TRIGGER;
		this.protecting = true;
	}

};

Owl.prototype.blast = function() {
	if (this.tricks >= this.BLAST_TRICK_TRIGGER) {
		this.nextAttack = this.game.time.now + this.ATTACK_DELAY;

		console.log('blast');
		// this.attacking = true;
		this.animations.play('blast');
		this.tricks -= this.BLAST_TRICK_TRIGGER;
		this.blasting = true;
	}
};

module.exports = Owl;
