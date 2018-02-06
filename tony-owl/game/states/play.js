'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')
var Guitar = require('../prefabs/guitar.js')
var Ampli = require('../prefabs/ampli.js')
var Negaowl = require('../prefabs/negaowl.js')

var on_animation = true;
var music;

var GAME_HEIGHT = 600;
var GROUND_HEIGHT = 50;

var THROWING_HEIGHT_MIN = GAME_HEIGHT / 4;
var THROWING_HEIGHT_MAX = GAME_HEIGHT - GROUND_HEIGHT;

var THROWING_VELOCITY_GUITAR_MIN = -100;
var THROWING_VELOCITY_GUITAR_MAX = -300;

var THROWING_VELOCITY_AMPLI_MIN = -300;
var THROWING_VELOCITY_AMPLI_MAX = -800;

var THROWING_DELAY_MIN = 1 * Phaser.Timer.SECOND;
var THROWING_DELAY_MAX = 4 * Phaser.Timer.SECOND;

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

		// level animation
		this.start_animation();
//		 on_animation = false // DEBUG

		this.ampliGroup = this.game.add.group();
		this.guitarGroup = this.game.add.group();

		// Send another thing soon
		this.guitarLoopTimer = this.game.time.events.loop(1000,
				throwingGuitars, this);
		this.ampliLoopTimer = this.game.time.events.loop(1000, throwingAmplis,
				this);

	},
	update : function() {
		var hit_platform = this.game.physics.arcade.collide(this.owl,
				this.ground);
		this.game.physics.arcade.collide(this.boss, this.ground);
		this.game.physics.arcade.collide(this.ampliGroup, this.ground,
				onAmpliCollision);
		this.game.physics.arcade.collide(this.owl, this.guitarGroup,
				onThrowableCollision);
		this.game.physics.arcade.collide(this.owl, this.boss, touchingBoss);
		this.game.physics.arcade.collide(this.owl, this.ampliGroup,
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
//		music.stop();
		music = this.game.add.audio('play', 1, true);
		music.play();
		on_animation = false;
	},
	play_music : function(){
		music = this.game.add.audio('entering');
		music.play();
	},
};

function touchingBoss(player, enemy) {
	music.stop();
	console.log('WIIIIIN');
	player.game.state.start('win');

}

function onAmpliCollision(obj, ampli) {

	ampli.body.velocity.x *= 0.9;
}

function onThrowableCollision(player, obj) {
	music.stop();
	player.game.state.start('gameover');
}

function throwingGuitars() {

	var velocity = this.game.rnd.integerInRange(THROWING_VELOCITY_GUITAR_MIN,
			THROWING_VELOCITY_GUITAR_MAX);
	var throwing_height = this.game.rnd.integerInRange(THROWING_HEIGHT_MIN,
			THROWING_HEIGHT_MAX);

	var guitar = new Guitar(velocity, this.game, this.boss.body.position.x,
			throwing_height);
	this.game.add.existing(guitar);
	this.guitarGroup.add(guitar);

	this.guitarLoopTimer.delay = this.game.rnd.integerInRange(
			THROWING_DELAY_MIN, THROWING_DELAY_MAX);
}

function throwingAmplis() {

	var velocity = this.game.rnd.integerInRange(THROWING_VELOCITY_AMPLI_MIN,
			THROWING_VELOCITY_AMPLI_MAX);
	var throwing_height = this.game.rnd.integerInRange(THROWING_HEIGHT_MIN,
			THROWING_HEIGHT_MAX);

	var ampli = new Ampli(velocity, this.game, this.boss.body.position.x,
			throwing_height);

	this.game.add.existing(ampli);
	this.ampliGroup.add(ampli);

	this.ampliLoopTimer.delay = this.game.rnd.integerInRange(
			THROWING_DELAY_MIN, THROWING_DELAY_MAX);
}

module.exports = Play;
