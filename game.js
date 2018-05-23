var gameOptions = {
  width: 768,
  height: 512,  
};

var game = new Kiwi.Game("game-container", 'Creeps Killer', null, gameOptions);
var State = new Kiwi.State('Play');

State.preload = function () {
  Kiwi.State.prototype.preload.call(this);

  this.addImage('space', 'assets/img/bg.png');
  this.addImage('spaceship', 'assets/img/spaceship.png');
  this.addImage('torpido', 'assets/img/torpido.png');
}

var projectile = function (state, y, type) {
  Kiwi.GameObjects.Sprite.call(this, state, state.textures["torpido"], 0, y, true);  
  this.physics = this.components.add( new Kiwi.Components.ArcadePhysics( this, this.box ) );
  this.physics.acceleration = new Kiwi.Geom.Point(100,0);
  this.physics.velocity = new Kiwi.Geom.Point(100,0);    

  state.projectilesGroup.members.forEach(function(val,key){    
      if(val.x > gameOptions.width)
          state.projectilesGroup.members.splice(key,1);
  });  
  // animation while x axe attempt collision ...
};
var enemyRaid = function (state,y,type){

}
Kiwi.extend(projectile, Kiwi.GameObjects.Sprite);

State.create = function () {
  Kiwi.State.prototype.create.call(this);

 // DEFINES GROUPS
  this.spaceGroup = new Kiwi.Group(this,'space');
  this.spaceShipGroup = new Kiwi.Group(this,'spaceship');
  this.projectilesGroup = new Kiwi.Group(this,'projectiles');

  // ADD GROUP TO SCOPE 
  this.addChild(this.spaceGroup);
  this.addChild(this.spaceShipGroup);
  this.addChild(this.projectilesGroup);

  // DEFINES COMPONENTS    
  this.space = new Kiwi.GameObjects.StaticImage(this, this.textures['space'], 0, 0);
  this.spaceship = new Kiwi.GameObjects.StaticImage(this, this.textures['spaceship'], 0, 0); 
  this.spaceship.scaleToWidth(50);
  this.spaceship.anchorPointY = 0;
  this.spaceship.anchorPointX = 0;

  // ADD COMPONENTS TO GROUP
  this.spaceGroup.addChild(this.space);
  this.spaceShipGroup.addChild(this.spaceship)  

}

State.update = function () {
  Kiwi.State.prototype.update.call(this);
  var mouse = this.game.input.mouse;
  this.spaceship.y = mouse.y - 25;
  if (mouse.isDown) {    
    this.projectilesGroup.addChild(new projectile(this, this.spaceship.y + 10));    
    this.game.input.mouse.reset();
  }

};

game.states.addState(State, true);