'use strict';

var AmpliParticle = function(game, x, y) {
  Phaser.Particle.call(this, game, x, y, 'ampli');
  this.animations.add('emitting');
  this.animations.add('roll-and-burn',[4,5,6,7,8,9,10,11], 10);
  

  // initialize your prefab here
  
};

AmpliParticle.prototype = Object.create(Phaser.Particle.prototype);
AmpliParticle.prototype.constructor = AmpliParticle;

AmpliParticle.prototype.onEmit = function () {
    this.animations.stop("emitting",true);
}

AmpliParticle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = AmpliParticle;
