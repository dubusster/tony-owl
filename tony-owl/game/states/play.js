'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')
var Guitar = require('../prefabs/guitar.js')
var Ampli = require('../prefabs/ampli.js')
var Negaowl = require('../prefabs/negaowl.js')

var on_animation = true;
var music;
var gameover_music;

var GAME_HEIGHT = 600;
var GROUND_HEIGHT = 50;

var THROWING_HEIGHT_MIN = GAME_HEIGHT / 4;
var THROWING_HEIGHT_MAX = GAME_HEIGHT - GROUND_HEIGHT;

var THROWING_VELOCITY_GUITAR_MIN = -100;
var THROWING_VELOCITY_GUITAR_MAX = -300;

var THROWING_VELOCITY_AMPLI_MIN = -300;
var THROWING_VELOCITY_AMPLI_MAX = -800;

var THROWING_DELAY_MIN = 0.5 * Phaser.Timer.SECOND;
var THROWING_DELAY_MAX = 2 * Phaser.Timer.SECOND;

var first_try = true;

function Play() {
}
Play.prototype = {
	create : function() {
		// Generating world and physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 8000;
		var level_width = 2000;
		this.game.world.setBounds(0, 0, level_width, 600);
		this.autoscroll_speed = 30;

		// Generating backgrounds and landscape
		this.sky = this.add.tileSprite(0, 0, this.game.world.width,
				this.game.height, 'sky');
		this.background = this.add.tileSprite(0, 0, this.game.world.width,
				this.game.height, 'background');
		this.sky.autoScroll(-30, 0);

		this.ground = new Ground(this.game, 0,
				this.game.height - GROUND_HEIGHT, level_width, GROUND_HEIGHT);
		this.game.add.existing(this.ground);

		// adding owl (player) to game
		this.owl = new Owl(this.game, 100, this.game.height - 150);
		this.game.add.existing(this.owl);
		this.game.camera.follow(this.owl);

		// keep the spacebar from propagating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var trickKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		trickKey.onDown.add(this.owl.trick, this.owl);

		// add boss at the end of the map
		this.boss = new Negaowl(this.game, this.game.world.width - 379,
				0); 
		this.game.add.existing(this.boss);
		// particles emitter
		this.guitarEmitter = this.game.add.emitter(this.boss.position.x, this.boss.height/2, 100);
		this.guitarEmitter.height = 400;
		this.guitarEmitter.makeParticles('guitar',0,50, true);

		this.guitarEmitter.minParticleSpeed.set(THROWING_VELOCITY_GUITAR_MIN, 0);
		this.guitarEmitter.maxParticleSpeed.set(THROWING_VELOCITY_GUITAR_MAX, 0);
		this.guitarEmitter.gravity = -this.game.physics.arcade.gravity.y;
		this.guitarEmitter.minRotation = -720;
	    this.guitarEmitter.maxRotation = -720;
	    
	    this.guitarEmitter.start(false, 10000, this.game.rnd.integerInRange(
				THROWING_DELAY_MIN, THROWING_DELAY_MAX));
		
	    // ampli emitter
	    this.ampliEmitter = this.game.add.emitter(this.boss.position.x, 2*this.boss.height/3, 50);
	    this.ampliEmitter.height = 100;
	    this.ampliEmitter.makeParticles('ampli',0,10, true);
	    this.ampliEmitter.minParticleSpeed.set(THROWING_VELOCITY_AMPLI_MIN, 0);
		this.ampliEmitter.maxParticleSpeed.set(THROWING_VELOCITY_AMPLI_MAX, 0);
		this.ampliEmitter.minRotation = 0;
	    this.ampliEmitter.maxRotation = 0;
	    
		this.ampliEmitter.start(false, 10000, this.game.rnd.integerInRange(
				THROWING_DELAY_MIN, THROWING_DELAY_MAX));
		// level animation
		if (first_try) {
			this.start_animation();	
// music = this.game.add.audio('play', 1, true);
// music.play();
		}
		else {
		}
// on_animation = false // DEBUG
		gameover_music = this.game.add.audio('gameover');
//		this.ampliGroup = this.game.add.group();
//		this.guitarGroup = this.game.add.group();
//		this.throwableGroup = this.game.add.group();
//		this.throwableGroup.add(this.ampliGroup);
//		this.throwableGroup.add(this.guitarGroup);

		// Send another thing soon
		
		this.guitarLoopTimer = this.game.time.events.loop(1000,
				randomEmitterFrequency, this, this.guitarEmitter);
		this.ampliLoopTimer = this.game.time.events.loop(1000,
				randomEmitterFrequency, this, this.ampliEmitter);
//		this.ampliLoopTimer = this.game.time.events.loop(1000, throwingAmplis,
//				this);

	},
	update : function() {
		var hit_platform = this.game.physics.arcade.collide(this.owl,
				this.ground);
		this.game.physics.arcade.collide(this.boss, this.ground);
		this.game.physics.arcade.collide(this.ampliEmitter, this.ground,
				onAmpliCollision);
		this.game.physics.arcade.collide(this.owl, this.guitarEmitter,
				onThrowableCollision);
		this.game.physics.arcade.collide(this.owl, this.boss, touchingBoss);
		this.game.physics.arcade.collide(this.owl, this.ampliEmitter,
				onThrowableCollision);

		if (this.owl.body.position.x < 0) {
			this.owl.body.position.x = 0;
		} else if (this.owl.body.position.x > this.game.world.width
				- this.owl.body.width) {
			this.owl.body.position.x = this.game.world.width
					- this.owl.body.width;
		}

		// Player moves
		if (!on_animation) {
			var cursors = this.game.input.keyboard.createCursorKeys();
			if (cursors.right.isDown) {
				this.owl.move("RIGHT");
			} else if (cursors.left.isDown) {
				this.owl.move("LEFT");
			} else {
				this.owl.move(null);
			}
			if (cursors.up.isDown && this.owl.body.touching.down) {
				this.owl.move("UP");
			}
		}
	},

	start_animation : function() {

		
		this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.focus_on_boss,
				this);
		this.game.time.events.add(Phaser.Timer.SECOND * 2, this.play_music,
				this);
		this.game.time.events.add(Phaser.Timer.SECOND * 4,
				this.focus_on_player, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 5, this.back_to_game,
				this);

	},

	focus_on_boss : function() {
		this.game.camera.follow(this.boss, 0, 0.05);
	},

	focus_on_player : function() {
		this.game.camera.follow(this.owl, 0, 0.05);
	},

	back_to_game : function() {
		this.game.camera.unfollow();
		this.game.camera.follow(this.owl);
// music.stop();
		music = this.game.add.audio('play', 1, true);
		music.play();
		on_animation = false;
	},
	play_music : function(){
		music = this.game.add.audio('entering');
		music.play();
	},
};

function randomEmitterFrequency(emitter) {
	emitter.frequency = this.game.rnd.integerInRange(
			THROWING_DELAY_MIN, THROWING_DELAY_MAX);
}

function touchingBoss(player, enemy) {
	music.stop();
	console.log('WIIIIIN');
	player.game.state.start('win');

}

function onAmpliCollision(obj, ampli) {
	ampli.body.velocity.x *= 0.98;
}

function onThrowableCollision(player, obj) {
// music.stop();
	first_try = false;
	
	gameover_music.play();
	player.game.state.start('play');
}


module.exports = Play;
