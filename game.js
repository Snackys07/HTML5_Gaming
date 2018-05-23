var gameOptions = {
  width: 768,
  height: 512,
  renderer: Kiwi.RENDERER_CANVAS,
};

var game = new Kiwi.Game("game-container", 'Hello World', null, gameOptions);
var State = new Kiwi.State('Play');

State.preload = function () {
  Kiwi.State.prototype.preload.call(this);

  this.addImage('space', 'assets/img/bg.png');
  this.addImage('spaceship', 'assets/img/spaceship.png');
  this.addImage('torpido', 'assets/img/torpido.png');
}

var projectile = function (state, y, type) {
  Kiwi.GameObjects.Sprite.call(this, state, state.textures["torpido"], 0, y, true);
  // this.speed = 12;
};

Kiwi.extend(projectile, Kiwi.GameObjects.Sprite);

State.create = function () {
  Kiwi.State.prototype.create.call(this);

  this.space = new Kiwi.GameObjects.StaticImage(this, this.textures.space);

  // Defines groups
  
  this.projectilesGroup = new Kiwi.Group(this);
  this.spaceGroup = new Kiwi.Group(this, 'space');
  this.spaceShipGroup = new Kiwi.Group(this, 'spaceship');

  // Add groups to scope

  this.addChild(this.spaceGroup);
  this.addChild(this.spaceShipGroup);
  this.addChild(this.space);

  this.spaceship = new Kiwi.GameObjects.StaticImage(this, this.textures['spaceship'], 0, 0);
  this.spaceship.scaleToWidth(50);
  this.spaceship.anchorPointY = 0;
  this.spaceship.anchorPointX = 0;
  this.addChild(this.spaceship);

}

State.update = function () {
  Kiwi.State.prototype.update.call(this);
  var mouse = this.game.input.mouse;
  this.spaceship.y = mouse.y - 25;

  // Shooting the adversary

  if (mouse.isDown) {
    // console.log(this.spaceship.y + " : " + this.spaceship.x);
    this.projectilesGroup.addChild(new projectile(this, this.spaceship.y + 10));
    console.log(this.projectilesGroup);
    this.game.input.mouse.reset();
  }

};

game.states.addState(State, true);