'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')
var Negaowl = require('../prefabs/negaowl.js')
var Animation = require('../animations/cut1.js')

var gameover_music;

var GAME_HEIGHT = 600;
var GROUND_HEIGHT = 50;

var THROWING_HEIGHT_MIN = GAME_HEIGHT / 4;
var THROWING_HEIGHT_MAX = GAME_HEIGHT - GROUND_HEIGHT;

var THROWING_DELAY_MIN = 0.5 * Phaser.Timer.SECOND;
var THROWING_DELAY_MAX = 2 * Phaser.Timer.SECOND;

var PARTICLE_LIFESPAN_WHEN_COUNTER_ATTACK = 5 * Phaser.Timer.SECOND;

var START_POSITION_X = 200; // DEBUG : 15000
var START_POSITION_Y = GAME_HEIGHT - 200;

var first_try = true;

function Play() {
}
Play.prototype = {
	create : function() {
		// Generating world and physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 3000;

		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('tiles32', 'tiles');

		// settings collision with certain tiles of tilesets.
		this.map.setCollisionBetween(0, 5);
		// not colliding from the bottom
		this.map.forEach(function(tile) {
			if (tile.index === 1 || tile.index === 2 || tile.index === 3 || tile.index === 4) {
				tile.collideDown = false;  }
			})

		this.layer = this.map.createLayer('Calque1');
		this.collisionLayer = this.map.createLayer('invisible walls');
		this.collisionLayer.visible = false;
		this.map.setCollision(1, true, 1);
		console.log("layer : ", this.collisionLayer);

		this.layer.resizeWorld();

		// adding owl (player) to game
		this.owl = new Owl(this.game, START_POSITION_X, START_POSITION_Y);
		this.game.add.existing(this.owl);
		this.game.camera.follow(this.owl);
		this.owl.events.onKilled.add(onDie, this.owl);

		// keep the spacebar from propagating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var trickKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		trickKey.onDown.add(this.owl.trick, this.owl);
		var attackKey = this.input.keyboard.addKey(Phaser.Keyboard.A);
		attackKey.onDown.add(this.owl.attack, this.owl);
		var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
		jumpKey.onDown.add(this.owl.jump, this.owl);
		
		// RETRY BUTTON
		var retryButton;
		retryButton = this.game.add.text(700, 50, 'retry',{
			font : "25px Arial",
			fill : "#ff0044"
		});
		retryButton.inputEnabled = true;
		retryButton.events.onInputUp.add(function(){
			respawn(this.owl);
		}, this);
		retryButton.fixedToCamera = true;
		
		// PAUSE CONFIGURATION
		var pauseButton;
		pauseButton = this.game.add.text(700, 10, 'Pause', {
			font : "25px Arial",
			fill : "#ff0044"
		});
		pauseButton.inputEnabled = true;
		pauseButton.events.onInputUp.add(function() {
			this.game.paused = true;
		}, this);
		this.game.input.onDown.add(function() {
			if (this.game.paused){
				this.game.paused = false;
			}
		}, this);
		pauseButton.fixedToCamera = true;
		
		this.pausedText = this.game.add.text(this.game.width/2, this.game.height/2, 'PAUSE', {
			font : "65px Arial",
			fill : "#ff0044"
		});
		this.pausedText.visible=false;
		this.pausedText.fixedToCamera = true;
		this.pausedText.anchor.x=0.5;
		this.pausedText.anchor.y=0.5;

		// add boss at the end of the map
		this.boss = new Negaowl(this.game, this.game.world.width - 379, 0);
		this.game.add.existing(this.boss);
		this.boss.events.onKilled.add(winning, this);
		// Boss starts to attack.
		this.boss.release_hell();

		// ampli emitter
		this.ampliEmitter = this.boss.ampliEmitter;
		this.guitarGroup = this.boss.guitarGroup;

		// level animation
		this.cutscene = true;
		var animation = new Animation(this.game);
		animation.onComplete.add(function(){this.cutscene = false}, this);
		if (first_try && this.cutscene) {
			animation.start();
		}

		gameover_music = this.game.add.audio('gameover');

	},
	update : function() {
		// collision with environment
		this.game.physics.arcade.collide(this.boss, this.layer);
		this.game.physics.arcade.collide(this.owl, this.layer);
		this.game.physics.arcade.collide(this.ampliEmitter,
				this.collisionLayer, onAmpliCollisionWithGround);
		
		// slowing down particles once player hit throwable to hurt the boss
		this.boss.ampliEmitter.forEachAlive(slowDownThrowable, this);
		this.guitarGroup.forEach(function(emitter){
			emitter.forEachAlive(slowDownThrowable, this);
			}, this);

		// collision for boss with throwables
		collideGroup(this.game, this.guitarGroup, this.boss, hurtBoss, this);
		this.game.physics.arcade.collide(this.ampliEmitter, this.boss,
				hurtBoss, null, this);
		this.game.physics.arcade.overlap(this.ampliEmitter, this.owl, hurtOwl,
				null, this);
		
		// overlapping guitars for player (owl) with throwables hurts.
		overlapGroup(this.game, this.guitarGroup, this.owl, hurtOwl, this)

		// constraints to keep player in game
		if (this.owl.body.position.x < 0) {
			this.owl.body.position.x = 0;
		} else if (this.owl.body.position.x > this.game.world.width
				- this.owl.body.width) {
			this.owl.body.position.x = this.game.world.width
					- this.owl.body.width;
		}
		if (this.owl.body.position.y > this.game.height) {
			onDie(this.owl);
		}

		if (!this.cutscene) {
			// Player moves
			var cursors = this.game.input.keyboard.createCursorKeys();
			if (cursors.right.isDown) {
				this.owl.move("RIGHT");
			} else if (cursors.left.isDown) {
				this.owl.move("LEFT");
			} else {
				this.owl.move(null);
			}
			
		}

		// When player attacks he is immuned and throw things to the boss.
		if (this.owl.attacking) {
			this.game.physics.arcade.collide(this.owl, this.ampliEmitter,
					onAttackToThrowables);
			collideGroup(this.game, this.guitarGroup, this.owl, onAttackToThrowables, this);
		}
		
		if (this.game.paused) {
			this.pausedText.visible = true;
		}
		else {
			this.pausedText.visible = false;
		}
	},

	render : function() {
// this.game.debug.text('attacking : ' + this.owl.attacking, 10, 50);
// this.game.debug.text('nextAttack : ' + this.owl.nextAttack, 10, 100);
		this.game.debug.text('tony : ' + this.owl.health, 10, 25);
		this.game.debug.text('negaowl : ' + this.boss.health, 10, 50);
		this.game.debug.text('tricksometer : ' + this.owl.trickCounter, 10, 75);
//
// this.game.debug.body(this.owl);
// this.game.debug.body(this.guitarGroup);
//
// var game = this.game;
// this.ampliEmitter.forEachAlive(function(particle) {
// game.debug.body(particle, 'red', false);
// // game.debug.text(particle.body.velocity, 10, 125);
// });
// this.guitarGroup.forEach(function(emitter) {
// emitter.forEachAlive(function(particle) {
// game.debug.body(particle, 'green', false);
// })
// });

	},
	paused : function(){
		this.pausedText.visible = true
	}
};

function collideGroup(game, group, other, callback, context) {
	// enabling gameover callback for all guitars.
	for (var i = 0; i < group.children.length; i++) {
		var item = group.children[i];
		game.physics.arcade.collide(other, item, callback, null, context);
	}
};

function overlapGroup(game, group, other, callback, context) {
	// enabling gameover callback for all guitars.
	for (var i = 0; i < group.children.length; i++) {
		var item = group.children[i];
		game.physics.arcade.overlap(other, item, callback, null, context);
	}
};

function winning() {
	this.game.sound.stopAll();
	console.log('WIIIIIN');
	this.game.state.start('win');
};

function onAmpliCollisionWithGround(ampli, obj) {
	ampli.animations.stop('emitting');
	ampli.animations.play('roll-and-burn', null, true);
	if (ampli.isSentByPlayer) {
		ampli.body.velocity.x -= ampli.body.velocity.x * 0.01;
	}
};

function onDie(player) {
	first_try = false;

	gameover_music.play();
	respawn(player);
}

function respawn(player) {
	
	player.position.x = START_POSITION_X;
	player.position.y = START_POSITION_Y;

	player.revive();
};

function onAttackToThrowables(player, obj) {
	obj.isSentByPlayer = true;
	obj.lifespan = PARTICLE_LIFESPAN_WHEN_COUNTER_ATTACK;
	obj.body.angularVelocity = -obj.body.angularVelocity;
// console.log(obj);
	obj.body.velocity.x = player.STRENGTH;
	
	// obj.body.velocity.y += player.STRENGTH * Math.cos(obj.angle);
};

function slowDownThrowable(particle) {
	if (particle.isSentByPlayer) {	
		particle.body.velocity.x -= particle.body.velocity.x * 0.01;
	}
};

function hurtOwl(owl, enemy) {
	if (!owl.immune && !owl.attacking) {
		owl.immune = true;
		owl.alpha = 0.5;
		owl.damage(1);
		// if (owl.body.position.x < enemy.body.position.x) {
		// owl.body.velocity.x = -300;
		// } else {
		// owl.body.velocity.x = 300;
		// }
		this.game.time.events.add(800, function() {
			owl.immune = false;
			owl.alpha = 1;
		}, this);
	}

};

function hurtBoss(boss, throwable) {
	console.log('boss is touched !');
	throwable.destroy();
	boss.damage(1);
	console.log('health boss : ', boss.health);
};

module.exports = Play;
