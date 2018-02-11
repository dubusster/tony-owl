'use strict';

var AmpliParticle = function(game, x, y) {
  Phaser.Particle.call(this, game, x, y, 'ampli');
  this.animations.add('roll');
  

  // initialize your prefab here
  
};

AmpliParticle.prototype = Object.create(Phaser.Particle.prototype);
AmpliParticle.prototype.constructor = AmpliParticle;

AmpliParticle.prototype.onEmit = function () {
    this.animations.stop("roll",true);
}

AmpliParticle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = AmpliParticle;
