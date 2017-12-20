'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')

function Play() {
}
Play.prototype = {
	create : function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 800;
		
		
		
		this.background = this.add.tileSprite(0, 0, this.game.width,
				this.game.height, 'background');
		// this.background.autoScroll(-100, 0);

		// adding ground to game
		var ground_height = 50;
		this.ground = new Ground(this.game, 0,
				this.game.height - ground_height, this.game.width,
				ground_height);
		this.game.add.existing(this.ground);

		// adding owl (player) to game
		this.owl = new Owl(this.game, 100, this.game.height - ground_height
				- 100)
		this.game.add.existing(this.owl);

		// keep the spacebar from propogating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var shootKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		shootKey.onDown.add(this.owl.shoot, this.owl);
		// rightKey.onDown.add(this.owl.going_right, this.owl);
		// leftKey.onDown.add(this.owl.go_left, this.owl);

		// add mouse/touch controls
		// this.input.onDown.add(this.owl.flap, this.owl);

		// this.game.input.keyboard.isDown()

	},
	update : function() {
		var hit_platform = this.game.physics.arcade.collide(this.owl, this.ground);
		
		// Player moves
		this.owl.move(null);
		var cursors = this.game.input.keyboard.createCursorKeys();
		
		if (cursors.right.isDown) {
			this.owl.move("RIGHT");
		} else if (cursors.left.isDown) {
			this.owl.move("LEFT");
		} else {
			this.owl.animations.stop();
			this.owl.frame=4;
		}
		if (cursors.up.isDown && this.owl.body.touching.down && hit_platform) {
			this.owl.move("UP");
		}

	},
};

module.exports = Play;
