
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    // add the background sprite
    this.background = this.game.add.tileSprite(0, 0,800, 600, 'background');
    this.background.autoScroll(-100, 0);  
  },
  update: function() {
    
  }
};

module.exports = Menu;
