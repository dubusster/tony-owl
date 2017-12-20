'use strict';

var DeathGuitar = function(game) {

	Phaser.Weapon.call(this, game, game.plugins);

	this.bulletSpeed = 1000;
	this.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
	this.bulletKillDistance = 200
	this.fireAngle = Phaser.ANGLE_RIGHT;

	this.bulletGravity.y = -game.physics.arcade.gravity.y;

};

DeathGuitar.prototype = Object.create(Phaser.Weapon.prototype);
DeathGuitar.prototype.constructor = DeathGuitar;

DeathGuitar.prototype.update = Phaser.Weapon.update;

// you need to add the weapon to the plugin manager

Phaser.GameObjectFactory.prototype.deathguitar = function(quantity, key, frame,
		group) {

	var deathguitar = this.game.plugins.add(DeathGuitar);

	deathguitar.createBullets(quantity, key, frame, group);

	return deathguitar;
};

// module.exports = DeathGuitar;
