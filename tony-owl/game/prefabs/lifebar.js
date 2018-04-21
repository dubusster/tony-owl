'use strict';

var Head = require('../prefabs/head.js')

var Lifebar = function(game, x, y, key, character, frame) {
  Phaser.Sprite.call(this, game);
  console.log(this);

  this.icons = [];
  this.character = character;
  this.xOffset = 20;

  for (var i = 0; i < character.health; i++) {
    this.icons.push(new Head(game, x, y, key));
    x += this.xOffset;

  }
  this.oldsize = this.icons.length;



  // initialize your prefab here

};

Lifebar.prototype = Object.create(Phaser.Sprite.prototype);
Lifebar.prototype.constructor = Lifebar;

Lifebar.prototype.update = function() {

  // write your prefab's specific update code here
  if (this.icons.length > this.oldsize) {
    var x = this.oldsize * this.xOffset;
    for (var i = this.oldsize; i <= this.icons.length; i++) {
      this.icons.push(new Head(game, x, y, key));
      x += this.xOffset;
    }
  }
  else if (this.icons.length < this.oldsize) {
    var head;
    for (var i = this.oldsize; i >= this.icons.length; i--) {
      head = this.icons.pop();
      head.destroy();
    }
  }


};

module.exports = Lifebar;
