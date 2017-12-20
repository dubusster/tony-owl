(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'tony-owl');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {  
	Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
  // start scrolling our ground
  //this.autoScroll(-200,0);
   
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this);
 
  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.allowGravity = false;
  this.body.immovable = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);  
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {  
  // write your prefab's specific update code here  
};

module.exports = Ground
},{}],3:[function(require,module,exports){
'use strict';

var DeathGuitar = require('../prefabs/weapon.js')

var Owl = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'owl', frame);

	// initialize your prefab here
	this.game.physics.arcade.enableBody(this);
	this.jumping = false;
	this.walking_speed = 200;
	this.weapon = this.game.add.deathguitar(5, 'wave');
	this.weapon.trackSprite(this, 0, 0);

};

Owl.prototype = Object.create(Phaser.Sprite.prototype);
Owl.prototype.constructor = Owl;

Owl.prototype.update = function() {

	// checking whether the player is midair or not.
	if (this.body.touching.down) {
		this.jumping = false;
	} else {
		this.jumping = true
	}
	// Player moves
	if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		this.move("UP");
	} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		this.move("RIGHT");
	} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		this.move("LEFT");
	} else {
		this.move(null);
	}

};

Owl.prototype.flap = function() {
	if (!this.jumping) {
		this.body.velocity.y = -300;
	}
};

Owl.prototype.move = function(direction) {
	if (direction == "RIGHT") {
		// TODO: put animation here
		this.body.velocity.x = this.walking_speed;
	}
	if (direction == "LEFT") {
		// TODO: put animation here
		this.body.velocity.x = -this.walking_speed;
	}
	if (direction == "UP") {
		// TODO: put animation here
		this.flap();
	}
	if (direction == null) {
		this.body.velocity.x = 0;
	}
};

Owl.prototype.shoot = function() {
	console.log('fire!');
	this.weapon.fire();
};

module.exports = Owl;

},{"../prefabs/weapon.js":4}],4:[function(require,module,exports){
'use strict';

var DeathGuitar = function(game) {

	Phaser.Weapon.call(this, game, game.plugins);

	this.bulletSpeed = 1000;
	this.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
	this.bulletKillDistance = 200
	this.fireAngle = Phaser.ANGLE_RIGHT;

	this.bulletGravity.y = -game.physics.arcade.gravity.y;

};

DeathGuitar.prototype = Object.create(Phaser.Weapon.prototype);
DeathGuitar.prototype.constructor = DeathGuitar;

DeathGuitar.prototype.update = Phaser.Weapon.update;

// you need to add the weapon to the plugin manager

Phaser.GameObjectFactory.prototype.deathguitar = function(quantity, key, frame,
		group) {

	var deathguitar = this.game.plugins.add(DeathGuitar);

	deathguitar.createBullets(quantity, key, frame, group);

	return deathguitar;
};

// module.exports = DeathGuitar;

},{}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win madda!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

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
    
    this.startButton = this.game.add.button(this.game.width/2, 3.5*this.game.height/4, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5,0.5);
    
  },
  update: function() {
    
  },
  startClick: function() {
	    // start button click handler
	    // start the 'play' state
	    this.game.state.start('play');
	  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){
'use strict';

var Ground = require('../prefabs/ground.js')
var Owl = require('../prefabs/owl.js')

function Play() {
}
Play.prototype = {
	create : function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 800;

		this.background = this.add.tileSprite(0, 0, this.game.width,
				this.game.height, 'background');
		// this.background.autoScroll(-100, 0);

		// adding ground to game
		var ground_height = 50;
		this.ground = new Ground(this.game, 0,
				this.game.height - ground_height, this.game.width,
				ground_height);
		this.game.add.existing(this.ground);

		// adding owl (player) to game
		this.owl = new Owl(this.game, 100, this.game.height - ground_height
				- 100)
		this.game.add.existing(this.owl);

		// keep the spacebar from propogating up to the browser
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
				Phaser.Keyboard.UP ]);

		// add keyboard controls
		var shootKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		shootKey.onDown.add(this.owl.shoot, this.owl);
		// rightKey.onDown.add(this.owl.going_right, this.owl);
		// leftKey.onDown.add(this.owl.go_left, this.owl);

		// add mouse/touch controls
		// this.input.onDown.add(this.owl.flap, this.owl);

		// this.game.input.keyboard.isDown()

	},
	update : function() {
		this.game.physics.arcade.collide(this.owl, this.ground);
	},
};

module.exports = Play;

},{"../prefabs/ground.js":2,"../prefabs/owl.js":3}],9:[function(require,module,exports){

'use strict';



function Preload() {
  this.asset = null;
  this.ready = false;
}



Preload.prototype = {
  preload: function() {
	  
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);
    
    this.load.image('logo', 'assets/logo5_small.png');
    
    var bg_folder = "assets/cyberpunk-street-files/cyberpunk-street-files/PNG/layers/";
    
    this.load.image('back-buildings', bg_folder+'back-buildings.png');
    this.load.image('foreground', bg_folder+'foreground.png');
    this.load.image('far-buildings', bg_folder+'far-buildings.png');
    
    
    this.load.image('sky', 'assets/sky.png');
    this.load.image('background', 'assets/city.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('title', 'assets/title.png');
    this.load.image('startButton', 'assets/start-button.png');
    
    this.load.spritesheet('owl', 'assets/owl.png', 32, 48, 9);

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])