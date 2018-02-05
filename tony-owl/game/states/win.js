'use strict';
var music;
function Win() {
}
Win.prototype = {
	preload : function() {
		// Override this method to add some load operations.
		// If you need to use the loader, you may need to use them here.
		// this.title = this.add.image('win_title',
		// 'assets/images/win_title.png');

	},
	create : function() {
		// This method is called after the game engine successfully switches
		// states.
		// Feel free to add any setup code here (do not load anything here,
		// override preload() instead).
		var style = {
			font : "65px Arial",
			fill : "#ff0044",
			align : "center",
			boundsAlignH : "center",
			boundsAlignV : "middle"
		};
		var text = this.game.add.text(0, 0,
				"Tu as battu\nl'impérialisme capitaliste!\n\n\nBien ouej", style);
		// We'll set the bounds to be from x0, y100 and be 800px wide by 100px
		// high
		text.setTextBounds(0, 100, 800, 400);
		music = this.game.add.audio('win');
		music.play();
	},
	update : function() {
		// state update code
	},
	paused : function() {
		// This method will be called when game paused.
	},
	render : function() {
		// Put render operations here.
	},
	shutdown : function() {
		// This method will be called when the state is shut down
		// (i.e. you switch to another state from this one).
	}
};
module.exports = Win;
