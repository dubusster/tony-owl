'use strict';

var Negaowl = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'negaowl', frame);

	// TODO: add boss animation

	game.physics.arcade.enableBody(this);

};

Negaowl.prototype = Object.create(Phaser.Sprite.prototype);
Negaowl.prototype.constructor = Negaowl;

var MIN_THROWING_DELAY = 5000;
var MAX_THROWING_DELAY = 10000;
Negaowl.prototype.update = function() {

};

Negaowl.prototype.shoot = function() {
	console.log("throwing stuffs !");
}

module.exports = Negaowl;
