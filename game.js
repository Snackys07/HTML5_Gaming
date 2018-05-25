const {
  Game,
  State,
  GameObjects,
  Input,
  Components,
  Group,
  HUD,
  extend,
} = Kiwi

var gameOptions = {
  width: 768,
  height: 512
};
var enemyRands = [
    "enemy1",
    "enemy2",
    "enemy3",
    "enemy4",
    "enemy5"
];

const state = new State('lvl1')
const bossState = new State("bossLevel");
const game = new Game('game-container', 'LoadingAnImage', null, gameOptions);

let spaceshipSpeed = 8;
let score = 0;
let life = 5;
let level = 0;
let gameOver = false;
let cadence = 30;
let inputNewBoss = true;

// function called to display score
const getScore = () => `Score: ${score}`

// function called to display life
const getLife = () => `Life: ${life}`

// function called to display level
const getLevel = () => `Level: ${level}`


state.preload = function () {
  State.prototype.preload.call(this)
  this.addImage('spaceship', 'assets/img/spaceship.png')
  this.addImage('background', 'assets/img/bg.png')
  this.addImage('background2', 'assets/img/bg_2.png')
  this.addImage('background3', 'assets/img/bg_3.png')
  this.addImage('background4', 'assets/img/bg_4.png')
  this.addImage('background5', 'assets/img/bg_5.png')
  this.addImage('background6', 'assets/img/bg_6.png')

  this.addImage('torpido', 'assets/img/torpido.png')  
  this.addImage('enemy1', 'assets/img/alien_1.png')
  this.addImage('enemy2', 'assets/img/alien_2.png')
  this.addImage('enemy3', 'assets/img/alien_3.png')
  this.addImage('enemy4', 'assets/img/alien_4.png')
  this.addImage('enemy5', 'assets/img/alien_5.png')  
  this.addImage('boss1', 'assets/img/boss_1.png')  
  this.addImage('boss2', 'assets/img/boss_2.png')  
  this.addImage('boss3', 'assets/img/boss_3.png')  
  this.addImage('boss4', 'assets/img/boss_4.png')   
  this.addImage('boss5', 'assets/img/boss_5.png')   
}

state.create = function () {
  State.prototype.create.call(this)   
  // score
  this.score = new HUD.Widget.MenuItem(this.game, 'Score : 0', 10, 10)
  this.score.style.color = 'white'
  this.game.huds.defaultHUD.addWidget(this.score)

  // life
  this.life = new HUD.Widget.MenuItem(this.game, getLife(), 10, 30)
  this.life.style.color = 'white'
  this.game.huds.defaultHUD.addWidget(this.life)

  // level
  this.level = new HUD.Widget.MenuItem(this.game, getLevel(), 10, 50)
  this.level.style.color = 'white'
  this.game.huds.defaultHUD.addWidget(this.level)

  // spaceship
  this.spaceship = new GameObjects.StaticImage(this, this.textures.spaceship, 0, 150)  
  this.spaceship.scaleToWidth(50)
  this.spaceship.scaleToHeight(50);
  this.spaceship.width = 50;
  this.spaceship.height = 50;
  this.spaceship.anchorPointY = 0
  this.spaceship.anchorPointX = 0
  
  // keys to move the spaceship
  this.leftKey = this.game.input.keyboard.addKey(Input.Keycodes.LEFT)
  this.rightKey = this.game.input.keyboard.addKey(Input.Keycodes.RIGHT)
  this.upKey = this.game.input.keyboard.addKey(Input.Keycodes.UP)
  this.downKey = this.game.input.keyboard.addKey(Input.Keycodes.DOWN)
  this.spaceKey = this.game.input.keyboard.addKey(Input.Keycodes.SPACEBAR)
  

  // groups
  this.bgGroupe = new Group(this,'bg');
  this.torpidoGroup = new Group(this, 'torpidos')
  this.enemyGroup = new Group(this, 'torpidos')
  this.bossGroup = new Group(this, 'boss')

  // add childs          
  this.addChild(this.bgGroupe)
  this.addChild(this.spaceship)
  this.addChild(this.torpidoGroup)
  this.addChild(this.enemyGroup)
  this.addChild(this.bossGroup)

  this.bgGroupe.addChild(new GameObjects.StaticImage(this, this.textures["background"], 0, 0))                                  

  // iterators
  this.shot = 0
  this.enemyLoop = 0
}

state.update = function () {
  State.prototype.update.call(this)  
    this.enemyLoop += 1    
// move the spaceship according to the pressed keys at the speed
// specified in the spaceshipSpeed var  
  if (!gameOver) {
      if (this.upKey.isDown && this.spaceship.y > 0) this.spaceship.transform.y -= spaceshipSpeed
      if (this.downKey.isDown && this.spaceship.y < gameOptions.height - this.spaceship.height) this.spaceship.transform.y += spaceshipSpeed
      if (this.leftKey.isDown && this.spaceship.x > 0) this.spaceship.transform.x -= spaceshipSpeed
      if (this.rightKey.isDown && this.spaceship.x < gameOptions.width - this.spaceship.height) this.spaceship.transform.x += spaceshipSpeed
      if (this.spaceKey.isDown) this.shot += 1
      if (this.spaceKey.isDown && this.shot == 5) {
          this.torpidoGroup.addChild(new torpido(this.spaceship.x, this.spaceship.y + 7))
          this.shot = 0
      }
  }
  // move the torpidos and remove them if they are leaving the canvas
  // or are hiting an enemy  
  this.torpidoGroup.members.forEach((torpido, li) => {
      torpido.transform.x += 12;
      if (torpido.x > gameOptions.width) torpido.destroy()      
          this.enemyGroup.members.forEach((enemy, ei) => {
              // if they overlaps with an enemy remove the torpido
              // and remove the enemy then add 10 pts to the 
              // score
              if (torpido.physics.overlaps(enemy)) {
                  this.torpidoGroup.members.splice(li, 1)
                  this.enemyGroup.members.splice(ei, 1)
                  if(inputNewBoss) score += 5;
                  this.score.text = getScore()
              }
              //levels              
              switch(score){                
                case 200: 
                    if(inputNewBoss){
                      this.enemyLoop = 0;                      
                      this.bossGroup.addChild(new boss("boss1"));                                        
                      cadence = 25;
                      spaceshipSpeed +=1
                      inputNewBoss = false;
                    }                                        
                break;

                case 300:
                      this.enemyLoop = 0;
                      this.bgGroupe.clear();
                      this.bgGroupe.addChild(new GameObjects.StaticImage(this, this.textures["background2"], 0, 0))                                                                                                
                break;
                case 500:
                if(inputNewBoss){
                    this.enemyLoop = 0;
                    this.bossGroup.addChild(new boss("boss2"));   
                    cadence = 15
                    spaceshipSpeed +=1
                    inputNewBoss = false;
                }
                break;
                case 600:
                      this.enemyLoop = 0;
                      this.bgGroupe.clear();
                      this.bgGroupe.addChild(new GameObjects.StaticImage(this, this.textures["background3"], 0, 0))                                                                            
                break;
                case 800:
                  if(inputNewBoss){
                    this.enemyLoop = 0;
                    this.bossGroup.addChild(new boss("boss3"));                    
                    cadence = 10      
                    spaceshipSpeed +=1              
                    inputNewBoss = false;
                  }                    
                break;
                case 900:
                      this.enemyLoop = 0;
                      this.bgGroupe.clear();
                      this.bgGroupe.addChild(new GameObjects.StaticImage(this, this.textures["background4"], 0, 0))                                  
                break;
                case 1100:
                  if(inputNewBoss){
                    this.enemyLoop = 0;
                    this.bossGroup.addChild(new boss("boss4"));
                    cadence = 5
                    spaceshipSpeed +=1
                    inputNewBoss = false;
                  }
                break;
                case 1200:
                        this.enemyLoop = 0;
                        this.bgGroupe.clear();
                        this.bgGroupe.addChild(new GameObjects.StaticImage(this, this.textures["background5"], 0, 0))                                  
                break;
                case 1400:
                    if(inputNewBoss){    
                      this.enemyLoop = 0;                
                      this.bossGroup.addChild(new boss("boss5"));  
                      cadence = 3
                      spaceshipSpeed +=1
                      inputNewBoss = false
                    }                    
                break;
                default:
                // 
                break;
              }

            if (torpido.physics.overlaps(this.enemyGroup)) torpido.destroy()
          })             
      this.bossGroup.members.forEach((boss, ei) => {                
        if(torpido.physics.overlaps(boss)){
          boss.life-=5;
          this.torpidoGroup.members.splice(li,1);
          if(boss.life == 0){
            this.bossGroup.members.splice(ei,1);          
            score+=100;                 
            level++;   
            inputNewBoss = true;            
            this.score.text = getScore()
            this.level.text = getLevel()
          }
        }

      })

  })
// decrement life if there is collision
  this.enemyGroup.members.forEach((enemy, index) => {
      if (enemy.physics.overlaps(this.spaceship)) {
          enemy.destroy();
          this.enemyGroup.members.splice(index, 1)
          life--
          this.life.text = getLife()
      }
  })  
  if (life <= 0) {
      this.level.text = getLevel()
      // Game Over
      gameOver = true;      
      this.removeChild(this.spaceship);
      this.torpidoGroup.clear();
      this.gameOver = new HUD.Widget.MenuItem(this.game, 'Game Over', gameOptions.width * 0.5 - 140, 100)
      this.gameOver.style.color = 'red'
      this.gameOver.style.fontSize = "4em"
      this.gameOver.style.textAlign = "center";
      this.game.huds.defaultHUD.addWidget(this.gameOver)
      this.score.x = gameOptions.width * 0.5 - 40;
      this.score.y = 180;
      this.score.style.fontSize = "2em";
      this.score.style.textAlign = "center";
      this.level.x = gameOptions.width * 0.5 - 80;
      this.level.y = 220;
      this.level.style.fontSize = "2em";
      this.level.style.textAlign = "center";
      this.level.text = `Level atteint: ${level}`
      this.life.style.display = "none";
  }
  // move enemy and remove them if they leave the canvas
  this.enemyGroup.members.forEach((enemy, ei) => {
      if(!gameOver) enemy.transform.x -= 10 
      if (enemy.x < -50) this.enemyGroup.members.splice(ei, 1)
  })
  this.bossGroup.members.forEach((boss, ei) => {
      if(!gameOver) boss.transform.x -= 1
      if(boss.physics.overlaps(this.spaceship)){
        life = 0;
        gameOver = true;
      }
  })

  // enemy loop  
  if (this.enemyLoop == cadence && !gameOver) {
      let keyRand = Math.floor(Math.random() * enemyRands.length);
      this.enemyGroup.addChild(new enemy(enemyRands[keyRand]))
      this.enemyLoop = 0
  }   

}
// torpido object
function torpido(x, y) {
  GameObjects.Sprite.call(this, state, state.textures.torpido, x, y, true)
  this.physics = this.components.add(new Components.ArcadePhysics(this, this.box))
}
// enemy object
function enemy(enemyType) {
  let spawnY = Math.round(Math.random() * (gameOptions.height - 50 - 50 + 1) + 50);
  GameObjects.Sprite.call(this, state, state.textures[enemyType], gameOptions.width , spawnY, true)
  this.physics = this.components.add(new Components.ArcadePhysics(this, this.box))
  // scale the enemy to the correct size
  this.scaleToWidth(50)
  this.anchorPointY = 0
  this.anchorPointX = 0
}

function boss(type){
 GameObjects.Sprite.call(this, state, state.textures[type],gameOptions.width ,0, true)
  this.physics = this.components.add(new Components.ArcadePhysics(this, this.box))
  this.life = 500;  
  this.scaleToWidth(gameOptions.width)
  this.scaleToHeight(gameOptions.height)
  this.anchorPointY = 0
  this.anchorPointX = 0 
}
extend(torpido, GameObjects.Sprite)
extend(enemy, GameObjects.Sprite)
extend(boss, GameObjects.Sprite)
game.states.addState(state)
game.states.switchState('lvl1')