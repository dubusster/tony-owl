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

var START_POSITION_X = 200;
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

		// keep the spacebar from propagating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var trickKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		trickKey.onDown.add(this.owl.trick, this.owl);

		// add boss at the end of the map
		this.boss = new Negaowl(this.game, this.game.world.width - 379, 0);
		this.game.add.existing(this.boss);
		// Boss starts to attack.
		this.boss.release_hell()

		// ampli emitter
		this.ampliEmitter = this.boss.ampliEmitter;
		this.guitarGroup = this.boss.guitarGroup;

		// level animation
		this.cutscene = true;
		var animation = new Animation(this.game);
		console.log(animation);
		if (first_try) {
			animation.start();
		}

		gameover_music = this.game.add.audio('gameover');

	},
	update : function() {
		this.game.physics.arcade.collide(this.boss, this.layer);
		this.game.physics.arcade.collide(this.owl, this.layer);
		this.game.physics.arcade.collide(this.ampliEmitter, this.collisionLayer,
				onAmpliCollisionWithGround);
		this.game.physics.arcade
				.collide(this.ampliEmitter, this.collisionLayer);
		this.game.physics.arcade.collide(this.owl, this.boss, touchingBoss,
				null, this);

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
	},
};

function collideGroup(game, group, other, callback) {
	// enabling gameover callback for all guitars.
	for (var i = 0; i < group.children.length; i++) {
		var item = group.children[i];
		game.physics.arcade.collide(other, item, callback);
	}
};

function touchingBoss(player, boss) {
	console.log(this);
	this.game.sound.stopAll();
	console.log('WIIIIIN');
	player.game.state.start('win');

};

function onAmpliCollisionWithGround(ampli, obj) {
	ampli.animations.stop('emitting');
	ampli.animations.play('roll-and-burn', null, true );
};

function onThrowableCollision(player, obj) {
	first_try = false;

	gameover_music.play();
	player.position.x = START_POSITION_X;
	player.position.y = START_POSITION_Y;
};

module.exports = Play;
