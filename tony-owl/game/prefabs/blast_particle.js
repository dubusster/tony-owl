'use strict';

var BlastParticle = function(game, x, y) {
  Phaser.Particle.call(this, game, x, y, 'note');

  
  this.isSentByPlayer = true;
  // initialize your prefab here
  
};

BlastParticle.prototype = Object.create(Phaser.Particle.prototype);
BlastParticle.prototype.constructor = BlastParticle;

BlastParticle.prototype.onEmit = function () {
//    this.animations.stop("emitting",true);
}

BlastParticle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = BlastParticle;
