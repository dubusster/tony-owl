'use strict';

var GuitareParticle = function(game, x, y) {
	Phaser.Particle.call(this, game, x, y, 'guitar');

	this.animations.add('normal', [ 0 ], 10);
	this.animations.add('normal-nega', [ 1 ], 10);

	//	  this.animations.add('emitting-nega', [12,13,14,15], 10);
	//	  this.animations.add('roll-and-burn-nega',[16,17,18,19,20,21,22,23], 10);

	this.isSentByPlayer = false;
	// initialize your prefab here

};

GuitareParticle.prototype = Object.create(Phaser.Particle.prototype);
GuitareParticle.prototype.constructor = GuitareParticle;

GuitareParticle.prototype.onEmit = function() {
	this.animations.play("normal-nega", 20, true);
}

GuitareParticle.prototype.update = function() {

	// write your prefab's specific update code here

};

module.exports = GuitareParticle;

var Guitar = function(min_speed, max_speed, game, x, y, maxParticles, frame) {
	Phaser.Sprite.call(this, game, x, y, 'guitar', frame);
	//enable physics on the enemy sprite
	// this is needed for collision detection.
	//	this.game.physics.arcade.enableBody(this);
	this.emitter = this.game.add.emitter(x, y, maxParticles);
	// Guitars just flow through the screen as motherfucking shurikens
	this.emitter.height = 5;
	this.emitter.particleClass = GuitareParticle;
	this.emitter.makeParticles('guitar', 0, maxParticles, true);

	this.emitter.minParticleSpeed.set(min_speed, 0);
	this.emitter.maxParticleSpeed.set(max_speed, 0);
	this.emitter.gravity = -this.game.physics.arcade.gravity.y;
	this.emitter.minRotation = -720;
	this.emitter.maxRotation = -720;
	this.emitter.minParticleScale = 2;
	this.emitter.maxParticleScale = 2;

};

Guitar.prototype = Object.create(Phaser.Sprite.prototype);
Guitar.prototype.constructor = Guitar;

Guitar.prototype.update = function() {

	// write your prefab's specific update code here

};

module.exports = Guitar;
