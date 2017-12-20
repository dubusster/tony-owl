'use strict';

var DeathGuitar = function(game) {
	//console.log(game.world);
  Phaser.Weapon.call(this, game, game.plugins);

  
  this.bulletSpeed = 1000;
  this.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
  this.bulletKillDistance = 200
  this.fireAngle = Phaser.ANGLE_RIGHT;
  //this.trackSprite(player, 0, 0);
  
  this.bulletGravity.y = -game.physics.arcade.gravity.y;
  
  
  
};

DeathGuitar.prototype = Object.create(Phaser.Weapon.prototype);
DeathGuitar.prototype.constructor = DeathGuitar; 

DeathGuitar.prototype.update = Phaser.Weapon.update;

Phaser.GameObjectFactory.prototype.deathguitar = function (quantity, key, frame, group) {
	  
	  var deathguitar = this.game.plugins.add(DeathGuitar);

	  deathguitar.createBullets(quantity, key, frame, group);

	  return deathguitar;
	};


//module.exports = DeathGuitar;
