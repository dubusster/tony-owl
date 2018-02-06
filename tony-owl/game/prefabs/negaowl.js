'use strict';

var Guitar = require('../prefabs/guitar.js')
var Ampli = require('../prefabs/ampli.js')

var PARTICLES_AMPLI = 15;

var THROWING_VELOCITY_AMPLI_MIN = -300;
var THROWING_VELOCITY_AMPLI_MAX = -800;

var THROWING_VELOCITY_GUITAR_MIN = -100;
var THROWING_VELOCITY_GUITAR_MAX = -300;

var GUITAR_PER_ROW_MAX = 5;

var THROWING_GUITAR_DELAY_MIN = 2 * Phaser.Timer.SECOND;
var THROWING_GUITAR_DELAY_MAX = 4 * Phaser.Timer.SECOND;

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
    
    this.guitarUp = new Guitar(THROWING_VELOCITY_GUITAR_MIN, THROWING_VELOCITY_GUITAR_MAX, this.game,this.position.x, 100, GUITAR_PER_ROW_MAX);
	this.guitarMiddle = new Guitar(THROWING_VELOCITY_GUITAR_MIN, THROWING_VELOCITY_GUITAR_MAX, this.game,this.position.x, 250, GUITAR_PER_ROW_MAX);
	this.guitarDown = new Guitar(THROWING_VELOCITY_GUITAR_MIN, THROWING_VELOCITY_GUITAR_MAX, this.game,this.position.x, 400, GUITAR_PER_ROW_MAX);

	this.guitarGroup = this.game.add.group();
    this.guitarGroup.add(this.guitarUp.emitter);
    this.guitarGroup.add(this.guitarMiddle.emitter);
    this.guitarGroup.add(this.guitarDown.emitter);
    
    
};

Negaowl.prototype = Object.create(Phaser.Sprite.prototype);
Negaowl.prototype.constructor = Negaowl;

Negaowl.prototype.update = function() {
	
};

Negaowl.prototype.release_hell = function(){
	for (var i = 0; i < this.guitarGroup.children.length; i++) {
		var guitar = this.guitarGroup.children[i];
		guitar.start(false, 10000, this.game.rnd.integerInRange(
	    		THROWING_GUITAR_DELAY_MIN, THROWING_GUITAR_DELAY_MAX));	
	}
	this.ampliEmitter.start(false, 5000, 2000);
};

Negaowl.prototype.change_emitters_frequencies = function(min_speed, max_speed){
	for (var i = 0; i < this.guitarGroup.children.length; i++) {
		var guitar = this.guitarGroup.children[i];
		this.game.time.events.loop(1000,
				randomEmitterFrequency, this, this.guitarUp.emitter, min_speed, max_speed);
	}

	this.ampliLoopTimer = this.game.time.events.loop(1000,
			randomEmitterFrequency, this, this.ampliEmitter, min_speed, max_speed);
};

function randomEmitterFrequency(emitter, min_speed, max_speed) {
	emitter.frequency = this.game.rnd.integerInRange(
			min_speed, max_speed);
}

module.exports = Negaowl;
