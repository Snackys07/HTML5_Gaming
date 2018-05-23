var Menu = new Kiwi.State('Menu');

Menu.create = function () {

    this.menuWidth = 100;

    this.myButton1 = new Kiwi.HUD.Widget.MenuItem( this.game, 'Level 1', -this.menuWidth, 0 );
    this.myButton1.style.color = 'white';
    this.myButton1.style.display = 'block';
    this.myButton1.style.boxSizing = 'border-box';
    this.myButton1.style.width = (this.menuWidth * 2).toString() + 'px';
    this.myButton1.style.textAlign = 'center';
    this.myButton1.style.cursor = 'pointer';
    this.myButton1.style.padding = '0.5em 1em';
    this.myButton1.style.backgroundColor = '#9c0';


    this.myButton3 = new Kiwi.HUD.Widget.MenuItem( this.game, 'Center', -this.menuWidth, 50 );
    this.myButton3.style.color = 'white';
    this.myButton3.style.display = 'none';
    this.myButton3.style.boxSizing = 'border-box';
    this.myButton3.style.width = (this.menuWidth * 2).toString() + 'px';
    this.myButton3.style.textAlign = 'center';
    this.myButton3.style.cursor = 'pointer';
    this.myButton3.style.padding = '0.5em 1em';
    this.myButton3.style.backgroundColor = '#09c';


    this.menu = new Kiwi.HUD.Widget.Menu( this.game, 0, 150 );
    this.menu.addMenuItem( this.myButton1 );
    this.menu.addMenuItem( this.myButton3 );
    this.game.huds.defaultHUD.addWidget( this.menu );
    
    this.menu.getMenuItem(0).input.onDown.add( this.leftButton, this );
    this.menu.getMenuItem(1).input.onDown.add( this.resetButton, this );

    this.resetButton();

}

Menu.leftButton = function () {
    
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
        alert("ok");      
      console.log('coucou');
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

}

Menu.resetButton = function () {
    this.menu.x = this.game.stage.width / 2;
}


var gameOptions = {
  width: 768,
  height: 512
};

var game = new Kiwi.Game('game-container', 'Menu', Menu, gameOptions);
