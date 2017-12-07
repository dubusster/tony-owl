
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
	
    // add the background sprite
    this.background = this.game.add.tileSprite(0, 0,this.game.width, this.game.height, 'background');
    this.background.autoScroll(-100, 0);
	  
	this.titleGroup = this.game.add.group();
    
	// adding the logo
    this.logo = this.game.add.image(this.background.width/2, this.background.height/4,'logo');
    this.logo.anchor.setTo(0.5, 0.5);
    this.logo.scale.setTo(0.5,0.5);
    
    // adding to global title group, so it is easily manipulable.
    this.titleGroup.add(this.logo);
    
    // adding title image
    this.title = this.game.add.image(this.background.width/2, 3*this.background.height/4,'title');
    this.title.anchor.setTo(0.5, 0.5);
    this.titleGroup.add(this.title);
  },
  update: function() {
    
  }
};

module.exports = Menu;
