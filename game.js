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
const game = new Game('game-container', 'LoadingAnImage', null, gameOptions);

const spaceshipSpeed = 4
let score = 0
let life = 5
let level = 1
let gameOver = false;

// function called to display score
const getScore = () => `Score: ${score}`

// function called to display life
const getLife = () => `Lifesss: ${life}`

// function called to display level
const getLevel = () => `Level: ${level}`

state.preload = function () {
  State.prototype.preload.call(this)
  this.addImage('background', 'assets/img/bg.png')
  this.addImage('spaceship', 'assets/img/spaceship.png')
  this.addImage('torpido', 'assets/img/torpido.png')
  this.addImage('enemy1', 'assets/img/alien_1.png')
  this.addImage('enemy2', 'assets/img/alien_2.png')
  this.addImage('enemy3', 'assets/img/alien_3.png')
  this.addImage('enemy4', 'assets/img/alien_4.png')
  this.addImage('enemy5', 'assets/img/alien_5.png')
}

state.create = function () {
  State.prototype.preload.call(this)
  this.background = new GameObjects.StaticImage(this, this.textures.background, 0, 0)

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
  this.torpidoGroup = new Group(this, 'torpidos')
  this.enemyGroup = new Group(this, 'torpidos')

  // add childs
  this.addChild(this.background)
  this.addChild(this.spaceship)
  this.addChild(this.torpidoGroup)
  this.addChild(this.enemyGroup)

  // iterators
  this.shot = 0
  this.enemyLoop = 0
}

state.update = function () {
  State.prototype.preload.call(this)  
  this.enemyLoop += 1  
  // move the spaceship according to the pressed keys at the speed
  // specified in the spaceshipSpeed var  
  if (this.upKey.isDown && this.spaceship.y > 0) this.spaceship.transform.y -= spaceshipSpeed
  if (this.downKey.isDown && this.spaceship.y < gameOptions.height - this.spaceship.height) this.spaceship.transform.y += spaceshipSpeed
  if (this.leftKey.isDown && this.spaceship.x > 0) this.spaceship.transform.x -= spaceshipSpeed
  if (this.rightKey.isDown && this.spaceship.x < gameOptions.width - this.spaceship.height) this.spaceship.transform.x += spaceshipSpeed
  if (this.spaceKey.isDown) this.shot += 1
  if (this.spaceKey.isDown && this.shot === 5) {
    this.torpidoGroup.addChild(new torpido(this.spaceship.x, this.spaceship.y + 7))
    this.shot = 0
  }

  // move the torpidos and remove them if they are leaving the canvas
  // or are hiting an enemy
  this.torpidoGroup.members.forEach((torpido, li) => {
    torpido.transform.x += 12
    if (torpido.x > 1000) torpido.destroy()
    this.enemyGroup.members.forEach((enemy, ei) => {
      // if they overlaps with an enemy remove the torpido
      // and remove the enemy then add 10 pts to the 
      // score
      if (torpido.physics.overlaps(enemy)) {
        this.torpidoGroup.members.splice(li, 1)
        this.enemyGroup.members.splice(ei, 1)
        score += 10
        this.score.text = getScore()
      }

      //levels
      if(score === 0 && score < 100) {
        this.level.text = getLevel()
      } else if(score >= 100 && score < 200) {
        if(level < 2) {
          level++
        }
        this.level.text = getLevel()
      } else if(score >= 200 && score < 300) {
        if(level < 3) {
          level++
        }
        this.level.text = getLevel()
      } else if(score >= 300 && score < 400) {
        if(level < 4) {
          level++
        }
        this.level.text = getLevel()
      } else if(score >= 400) {
        if(level < 5) {
          level++
        }
        this.level.text = getLevel()
      }

    })
    if (torpido.physics.overlaps(this.enemyGroup)) torpido.destroy()
  })

  // decrement life if there is collision
  this.enemyGroup.members.forEach((enemy, index) => {
    if (enemy.physics.overlaps(this.spaceship)) {
      enemy.destroy();
      this.enemyGroup.members.splice(index, 1)
      life--
      this.life.text = getLife()
      if (life <= 0) {
        // Game Over
        gameOver = true;
        this.enemyGroup.clear()
        this.gameOver = new HUD.Widget.MenuItem(this.game, 'Game Over', gameOptions.width * 0.5 - 40, gameOptions.height * 0.5)                
        this.gameOver.style.color = 'red'
        this.game.huds.defaultHUD.addWidget(this.gameOver)
      }
    }
  })

  // move enemy and remove them if they leave the canvas
  this.enemyGroup.members.forEach((enemy, ei) => {
    enemy.transform.x -= 5
    if (enemy.x === -50) this.enemyGroup.members.splice(ei, 1)
  })  

  // enemy loop
  if (this.enemyLoop === 30 && !gameOver) {        
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

extend(torpido, GameObjects.Sprite)

// enemy object
function enemy(enemyType) {
  let spawnY = Math.round(Math.random() * (gameOptions.height - 50 - 50 + 1) + 50);
  GameObjects.Sprite.call(this, state, state.textures[enemyType], 1000, spawnY, true)
  this.physics = this.components.add(new Components.ArcadePhysics(this, this.box))
  // scale the enemy to the correct size
  this.scaleToWidth(50)
  this.anchorPointY = 0
  this.anchorPointX = 0
}

extend(enemy, GameObjects.Sprite)

game.states.addState(state)
game.states.switchState('lvl1')