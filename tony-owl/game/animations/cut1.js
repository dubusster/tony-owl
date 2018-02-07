'use strict';

var music;

var Animation = function (game, boss, owl, music) {
	this.game = game;
	this.boss = boss;
	this.owl = owl;
	this.music = music;
};
//
// Animation.prototype = Object.prototype;
Animation.prototype = {
	start : function() {
		console.log(this.game);
		this.game.time.events.add(Phaser.Timer.SECOND * 0.5,
				this.focus_on_boss, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 2, this.play_music,
				this);
		this.game.time.events.add(Phaser.Timer.SECOND * 4,
				this.focus_on_player, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 5, this.back_to_game,
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
		this.game.camera.targetOffset.x = 200;
		this.music = this.game.add.audio('play', 1, true);
		this.music.play();
		
	},
	play_music : function() {
		this.music = this.game.add.audio('entering');
		this.music.play();
	},

};

Animation.prototype.constructor = Animation;

module.exports = Animation;
