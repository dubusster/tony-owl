'use strict';

var AmpliParticle = function(game, x, y) {
  Phaser.Particle.call(this, game, x, y, 'ampli');
  this.animations.add('emitting',[0,1,2,3], 10);
  this.animations.add('roll-and-burn',[4,5,6,7,8,9,10,11], 10);
  
  this.animations.add('emitting-nega', [12,13,14,15], 10);
  this.animations.add('roll-and-burn-nega',[16,17,18,19,20,21,22,23], 10);
  
  this.isSentByPlayer = false;
  // initialize your prefab here
  
};

AmpliParticle.prototype = Object.create(Phaser.Particle.prototype);
AmpliParticle.prototype.constructor = AmpliParticle;

AmpliParticle.prototype.onEmit = function () {
    this.animations.play("emitting-nega",20, true);
}

AmpliParticle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = AmpliParticle;
