'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')
var Guitar = require('../prefabs/guitar.js')
var Ampli = require('../prefabs/ampli.js')

function Play() {
}
Play.prototype = {
	create : function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1500;
		this.game.world.setBounds(0, 0, 2000, 600);
		
		this.autoscroll_speed = 30;
		
		this.sky = this.add.tileSprite(0, 0, this.game.world.width, this.game.height, 'sky');
		this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.height, 'background');
		this.sky.autoScroll(-30, 0);
		
		var level_width = 10000;

		var ground_height = 50;
		this.ground = new Ground(this.game, 0, this.game.height-ground_height, level_width, ground_height);
		this.game.add.existing(this.ground);
		
		// adding owl (player) to game
		this.owl = new Owl(this.game, 100, this.game.height - ground_height
				- 100)
		this.game.add.existing(this.owl);
		this.game.camera.follow(this.owl); 

		// keep the spacebar from propagating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var shootKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		shootKey.onDown.add(this.owl.trick, this.owl);

	},
	update : function() {
		this.game.camera.x += 10;
		var hit_platform = this.game.physics.arcade.collide(this.owl, this.ground);
		
		if (this.owl.body.position.x < 0) {		
			this.owl.body.position.x = 0;
		}
		else if (this.owl.body.position.x > this.game.world.width-this.owl.body.width) {
			this.owl.body.position.x = this.game.world.width-this.owl.body.width;
		}
		
		// Player moves
		
		
		var cursors = this.game.input.keyboard.createCursorKeys();
		
		if (cursors.right.isDown) {
			this.owl.move("RIGHT");
//			this.background.autoScroll(-100, 0);
//			this.sky.autoScroll(-50, 0);
		} else if (cursors.left.isDown) {		
				this.owl.move("LEFT");
		} else {
//			this.background.autoScroll(-50, 0);
			this.owl.move(null);
//			this.owl.body.velocity.x = -this.autoscroll_speed;
			
		}
		
		if (cursors.up.isDown && this.owl.body.touching.down) {
			this.owl.move("UP");
		}

	},
};

module.exports = Play;
