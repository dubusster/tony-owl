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

var START_POSITION_X = 15000;
var START_POSITION_Y = GAME_HEIGHT - 150;

var first_try = true;

function Play() {
}
Play.prototype = {
	create : function() {
		// Generating world and physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1250;

		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('tiles32', 'tiles');

		// settings collision with certain tiles of tilesets.
		this.map.setCollisionBetween(0, 5);

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
		this.owl.events.onKilled.add(respawn, this.owl);

		// keep the spacebar from propagating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var trickKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		trickKey.onDown.add(this.owl.trick, this.owl);
		var attackKey = this.input.keyboard.addKey(Phaser.Keyboard.A);
		attackKey.onDown.add(this.owl.attack, this.owl);

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
		this.cutscene = false;
		var animation = new Animation(this.game);
		// console.log(animation);
		if (first_try && this.cutscene) {
			animation.start();
		}

		gameover_music = this.game.add.audio('gameover');

	},
	update : function() {
		this.game.physics.arcade.collide(this.boss, this.layer);
		this.game.physics.arcade.collide(this.owl, this.layer);
		this.game.physics.arcade.collide(this.ampliEmitter,
				this.collisionLayer, onAmpliCollisionWithGround);

		collideGroup(this.game, this.guitarGroup, this.boss, hurtBoss)
		this.game.physics.arcade.collide(this.ampliEmitter, this.boss, hurtBoss,
				null, this);
		this.game.physics.arcade.overlap(this.ampliEmitter, this.owl, hurtOwl, null, this);

		if (this.owl.body.position.x < 0) {
			this.owl.body.position.x = 0;
		} else if (this.owl.body.position.x > this.game.world.width
				- this.owl.body.width) {
			this.owl.body.position.x = this.game.world.width
					- this.owl.body.width;
		}

		if (this.owl.body.position.y > this.game.height) {
			onThrowableCollision(this.owl, null);
		}

		// Player moves
		if (!this.cutscene) {
			var cursors = this.game.input.keyboard.createCursorKeys();
			if (cursors.right.isDown) {
				this.owl.move("RIGHT");
			} else if (cursors.left.isDown) {
				this.owl.move("LEFT");
			} else {
				this.owl.move(null);
			}
			if (cursors.up.isDown && this.owl.body.blocked.down) {
				this.owl.move("UP");
			}
		}

		if (this.owl.attacking) {
			this.game.physics.arcade.collide(this.owl, this.ampliEmitter,
					onAttackAmpli);
			collideGroup(this.game, this.guitarGroup, this.owl, onAttackAmpli);
		}

	},

	render : function() {
		this.game.debug.text('attacking : ' + this.owl.attacking, 10, 50);
		this.game.debug.text('trickCounter : ' + this.owl.trickCounter, 10, 75);
		this.game.debug.text('nextAttack : ' + this.owl.nextAttack, 10, 100);
		this.game.debug.text('owl : '+this.owl.health, 10,125);
		this.game.debug.text('boss : '+this.boss.health, 10,150);

		this.game.debug.body(this.owl);
		this.game.debug.body(this.guitarGroup);
		
		var game = this.game;
		this.ampliEmitter.forEachAlive(function(particle) {
			game.debug.body(particle, 'red', false);
//			game.debug.text(particle.body.velocity, 10, 125);
		});
		this.guitarGroup.forEach(function(emitter){
			emitter.forEachAlive(function(particle) {
			game.debug.body(particle, 'green', false);})
		});

	},
};

function collideGroup(game, group, other, callback) {
	// enabling gameover callback for all guitars.
	for (var i = 0; i < group.children.length; i++) {
		var item = group.children[i];
		game.physics.arcade.collide(other, item, callback);
	}
};

function touchingBossWithAmpli(boss, ampli) {
	// console.log(this);
//	this.game.sound.stopAll();
	console.log('boss is touched !');
//	boss.health--;
	ampli.destroy();
	boss.damage(1);
	console.log('health boss : ', boss.health);
	if (boss.health <= 0) {
//		this.boss.animations.play('dying');
		console.log('boss dying!');
		this.boss.tweenKill.onComplete.add(winning, boss.game)
		this.boss.tweenKill.start();
		
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
};

function respawn(player) {
	first_try = false;

	gameover_music.play();
	player.position.x = START_POSITION_X;
	player.position.y = START_POSITION_Y;
	
	player.revive();
};

function onAttack(player, obj) {
	// console.log(obj);
//	obj.body.bounce.x = 1;
	obj.body.velocity.x += player.STRENGTH * Math.sin(obj.angle);
	obj.body.velocity.y += player.STRENGTH * Math.cos(obj.angle);
}

function onAttackAmpli(player, obj) {
	// console.log(obj);
//	obj.body.bounce.x = 1;
	obj.body.velocity.x = player.STRENGTH
//	obj.body.velocity.y += player.STRENGTH * Math.cos(obj.angle);
	obj.body.velocity.y += 0
}

function hurtOwl(owl, enemy) {
	if (!owl.immune && !owl.attacking) {
		owl.immune = true;
        owl.alpha = 0.5;
        owl.damage(1);
//        if (owl.body.position.x < enemy.body.position.x) {
//            owl.body.velocity.x = -300;
//        } else {
//            owl.body.velocity.x = 300;
//        }
        this.game.time.events.add(800, function() {
            owl.immune = false;
            owl.alpha = 1;
        }, this);
    }
     
}

function hurtBoss(boss, throwable) {
	// console.log(this);
//	this.game.sound.stopAll();
	console.log('boss is touched !');
//	boss.health--;
	throwable.destroy();
	boss.damage(1);
	console.log('health boss : ', boss.health);
//	if (boss.health <= 0) {
////		this.boss.animations.play('dying');
//		console.log('boss dying!');
//		
//		boss.tweenKill.start();
//		
//	}
}

module.exports = Play;
