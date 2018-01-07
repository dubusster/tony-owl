'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')

function Play() {
}
Play.prototype = {
	create : function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 800;
		
		
		
		this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
		this.background.autoScroll(-100, 0);

		var ground_height = 50;
		this.ground = new Ground(this.game, 0, this.game.height-ground_height, this.game.width, ground_height);
		this.game.add.existing(this.ground);
		// adding map
//		var map = this.game.add.tilemap('map');
//		map.addTilesetImage('roguelikeCity_transparent', 'tiles');
//		map.setCollisionBetween(1, 100, true, 'World1');
//		this.layer = map.createLayer('World1');
//		this.game.add.existing(this.layer);
//		this.layer.resizeWorld();
		
		
		// adding owl (player) to game
		this.owl = new Owl(this.game, 100, this.game.height - ground_height
				- 100)
		this.game.add.existing(this.owl);
		this.game.camera.follow(this.owl); 

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
		this.background.autoScroll(0, 0);
		var cursors = this.game.input.keyboard.createCursorKeys();
		
		if (cursors.right.isDown) {
			this.owl.move("RIGHT");
			this.background.autoScroll(-100, 0);
		} else if (cursors.left.isDown) {
			if (this.owl.body.position.x >= 0) {		
				this.owl.move("LEFT");
			}
		} else {
//			this.owl.move(null);
			
		}
		
		if (cursors.up.isDown && this.owl.body.blocked.down) {
			this.owl.move("UP");
		}

	},
};

module.exports = Play;
