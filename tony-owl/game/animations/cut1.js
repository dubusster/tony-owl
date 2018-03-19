'use strict';

var Animation = function (game) {
	this.game = game;
	this.current_state = this.game.state.getCurrentState();
	this.boss = this.current_state.boss;
	this.owl = this.current_state.owl;
	this.onComplete = new Phaser.Signal();
};

Animation.prototype = {
	start : function() {
		
		
		this.game.time.events.add(Phaser.Timer.SECOND * 0.5,
				this.focus_on_boss, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.play_music,
				this);
		this.game.time.events.add(Phaser.Timer.SECOND * 6,
				this.focus_on_player, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 6.5, this.back_to_game,
				this);

	},

	focus_on_boss : function() {
		console.log(this.game);
		this.game.camera.follow(this.boss, 0, 0.05);
	},

	focus_on_player : function() {
		this.game.camera.follow(this.owl, 0, 0.05);
	},

	back_to_game : function() {
		this.game.camera.unfollow();
		this.game.camera.follow(this.owl);
		this.game.camera.targetOffset.x = this.game.width/3;
		this.music = this.game.add.audio('play', 1, true);
		this.music.play();
//		this.current_state.cutscene = false;
		this.onComplete.dispatch();
	},
	play_music : function() {
		this.music = this.game.add.audio('entering');
		this.music.play();
	},

};

Animation.prototype.constructor = Animation;

module.exports = Animation;
