'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')
var Guitar = require('../prefabs/guitar.js')
var Ampli = require('../prefabs/ampli.js')
var Negaowl = require('../prefabs/negaowl.js')

var on_animation = true;

function Play() {
}
Play.prototype = {
	create : function() {
		// Generating world and physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1500;
		var level_width = 2000;
		this.game.world.setBounds(0, 0, level_width, 600);
		this.autoscroll_speed = 30;

		// Generating backgrounds and landscape
		this.sky = this.add.tileSprite(0, 0, this.game.world.width,
				this.game.height, 'sky');
		this.background = this.add.tileSprite(0, 0, this.game.world.width,
				this.game.height, 'background');
		this.sky.autoScroll(-30, 0);

		var ground_height = 50;
		this.ground = new Ground(this.game, 0,
				this.game.height - ground_height, level_width, ground_height);
		this.game.add.existing(this.ground);

		// adding owl (player) to game
		this.owl = new Owl(this.game, 100, this.game.height - 150);
		this.game.add.existing(this.owl);
		this.game.camera.follow(this.owl);

		// keep the spacebar from propagating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var shootKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		shootKey.onDown.add(this.owl.trick, this.owl);

		// add boss at the end of the map
		this.boss = new Negaowl(this.game, this.game.world.width - 100,
				this.game.height - 200);
		this.game.add.existing(this.boss);

		this.start_animation();

		var MIN_THROWING_DELAY = 0.5 * Phaser.Timer.SECOND;
		var MAX_THROWING_DELAY = 2 * Phaser.Timer.SECOND;

		// Send another thing soon
		var guitar = new Guitar(100,this.game, this.boss.body.position.x, 300);
		this.game.add.existing(guitar);

	},
	update : function() {
		var hit_platform = this.game.physics.arcade.collide(this.owl,
				this.ground);
		this.game.physics.arcade.collide(this.boss, this.ground);
		this.game.physics.arcade.collide(this.owl, this.boss, touchingBoss);

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
	
	start_animation : function(){
		// TODO: do the animation
		
		this.game.time.events.add(Phaser.Timer.SECOND * 1, this.focus_on_boss, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 3, this.focus_on_player, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 3.5, this.back_to_game, this);
		
	},
	
	focus_on_boss : function(){
		
		this.game.camera.follow(this.boss, 0, 0.05);
		
	},
	
	focus_on_player : function(){
		this.game.camera.follow(this.owl, 0, 0.05);
		
	},
	
	back_to_game : function(){
		this.game.camera.unfollow();
		this.game.camera.follow(this.owl);
		
		on_animation = false;
	},
	
};

function touchingBoss(player, enemy) {
	if (player.body.touching.right || player.body.touching.left
			|| player.body.touching.up) {
		// boss is dead
		console.log('WIIIIIN');
		player.game.state.start('win');
	}

}

module.exports = Play;
