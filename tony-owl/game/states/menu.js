
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
	
    // add the background sprite
    this.background = this.add.tileSprite(0, 0,this.game.width, this.game.height, 'background');
    this.background.autoScroll(-100, 0);
	  
	this.titleGroup = this.game.add.group();
    
	// adding the logo
    this.logo = this.add.image(0, 0,'logo');
    this.logo.scale.setTo(0.5);
    
    
    // adding to global title group, so it is easily manipulable.
    this.titleGroup.add(this.logo);
    
    // adding title image
    this.title = this.add.image(0, 0,'title');
    this.titleGroup.add(this.title);
    
    this.titleGroup.align(1,2,this.logo.height, this.logo.height);
    this.titleGroup.setAll('anchor.x', 0.5);
    this.titleGroup.setAll('anchor.y', 0.5);
    this.titleGroup.x = this.world.width/2;
    this.titleGroup.y = this.world.height/4;
    
    this.game.add.tween(this.titleGroup).to({y:130}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    
  }
};

module.exports = Menu;
