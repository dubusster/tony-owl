'use strict';

var Negaowl = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'negaowl', frame);

  // TODO: add boss animation
  
  this.game.physics.arcade.enableBody(this);
  
};

Negaowl.prototype = Object.create(Phaser.Sprite.prototype);
Negaowl.prototype.constructor = Negaowl;

Negaowl.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Negaowl;
