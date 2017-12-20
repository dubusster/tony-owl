'use strict';

var DeathGuitar = require('../prefabs/weapon.js')

var Owl = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'owl', frame);

  // initialize your prefab here
  this.game.physics.arcade.enableBody(this);
  this.jumping = false;
  this.walking_speed = 200;
  this.weapon = this.game.add.deathguitar(5, 'wave');
  
  
  

  
};

Owl.prototype = Object.create(Phaser.Sprite.prototype);
Owl.prototype.constructor = Owl;

Owl.prototype.update = function() {
	
	// checking whether the player is midair or not.
	if (this.body.touching.down) {
        this.jumping = false;
    }
	else {
		this.jumping = true
	}
	// Player moves
	if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		this.move("UP");
	}
	else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
		this.move("RIGHT");
	}
	else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		this.move("LEFT");
	}
	else {
		this.move(null);
	}
  
};

Owl.prototype.flap = function() {
	if (!this.jumping) {
		this.body.velocity.y = -300;
	}
};

Owl.prototype.move = function(direction) {
	if (direction=="RIGHT") {
		// TODO: put animation here
		this.body.velocity.x = this.walking_speed;
	}
	if (direction=="LEFT") {
		// TODO: put animation here
		this.body.velocity.x = -this.walking_speed;
	}
	if (direction=="UP") {
		// TODO: put animation here
		this.flap();
	}
	if (direction==null) {
		this.body.velocity.x = 0;
	}
};

Owl.prototype.shoot = function() {
	this.weapon.fire();
};

module.exports = Owl;
