'use strict';

var Head = function(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.fixedToCamera = true;
  // initialize your prefab here

};

Head.prototype = Object.create(Phaser.Sprite.prototype);
Head.prototype.constructor = Head;

Head.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Head;
