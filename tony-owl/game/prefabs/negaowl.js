'use strict';

var PARTICLES_AMPLI = 15;

var THROWING_VELOCITY_AMPLI_MIN = -300;
var THROWING_VELOCITY_AMPLI_MAX = -800;

var Negaowl = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'negaowl', frame);

	// TODO: add boss animation
	game.physics.arcade.enableBody(this);

	this.animations.add('standing', null, 10, true);
	this.animations.play('standing');
	
	// ampli emitter
    this.ampliEmitter = this.game.add.emitter(this.position.x, 2*this.height/3, PARTICLES_AMPLI);
    this.ampliEmitter.height = 100;
    this.ampliEmitter.makeParticles('ampli',0,PARTICLES_AMPLI, true);
    this.ampliEmitter.minParticleSpeed.set(THROWING_VELOCITY_AMPLI_MIN, 0);
	this.ampliEmitter.maxParticleSpeed.set(THROWING_VELOCITY_AMPLI_MAX, 0);
	this.ampliEmitter.gravity = 1200;
	this.ampliEmitter.minRotation = 0;
    this.ampliEmitter.maxRotation = 0;

};

Negaowl.prototype = Object.create(Phaser.Sprite.prototype);
Negaowl.prototype.constructor = Negaowl;

var MIN_THROWING_DELAY = 5000;
var MAX_THROWING_DELAY = 10000;
Negaowl.prototype.update = function() {
	
};

module.exports = Negaowl;
