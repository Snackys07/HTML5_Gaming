const {
  Game,
  State,
  GameObjects,
  Input,
  Components,
  Group,
  HUD,
} = Kiwi
const game = new Game()
const state = new State('lvl1')

const spaceshipSpeed = 4
let score = 0

const getScore = () => `Score : ${score}`

state.preload = function () {
  State.prototype.preload.call(this)
  this.addImage('background', 'assets/img/bg.png')
  this.addImage('spaceship', 'assets/img/spaceship.png')
  this.addImage('laser1', 'assets/img/torpido.png')
  this.addImage('enemy', 'assets/img/alien_2.png')
}

state.create = function () {
  State.prototype.preload.call(this)
  this.background = new GameObjects.StaticImage(this, this.textures.background, 0, 0)

  this.score = new HUD.Widget.MenuItem(this.game, 'Score : 0', 10, 10)
  this.score.style.color = 'white'

  this.spaceship = new GameObjects.StaticImage(this, this.textures.spaceship, 0, 150)
  this.spaceship.scaleToWidth(50)
  this.spaceship.anchorPointY = 0
  this.spaceship.anchorPointX = 0

  this.leftKey = this.game.input.keyboard.addKey(Input.Keycodes.LEFT)
  this.rightKey = this.game.input.keyboard.addKey(Input.Keycodes.RIGHT)
  this.upKey = this.game.input.keyboard.addKey(Input.Keycodes.UP)
  this.downKey = this.game.input.keyboard.addKey(Input.Keycodes.DOWN)
  this.spaceKey = this.game.input.keyboard.addKey(Input.Keycodes.SPACEBAR)

  this.laserGroup = new Group(this, 'lasers')
  this.enemyGroup = new Group(this, 'lasers')

  this.addChild(this.background)
  this.addChild(this.spaceship)
  this.addChild(this.laserGroup)
  this.addChild(this.enemyGroup)
  this.game.huds.defaultHUD.addWidget(this.score)

  this.shot = 0
  this.enemyLoop = 0
}


state.update = function () {
  State.prototype.preload.call(this)
  this.enemyLoop += 1

  if (this.upKey.isDown) {
    this.spaceship.transform.y -= spaceshipSpeed
  }
  if (this.downKey.isDown) {
    this.spaceship.transform.y += spaceshipSpeed
  }
  if (this.leftKey.isDown) {
    this.spaceship.transform.x -= spaceshipSpeed
  }
  if (this.rightKey.isDown) {
    this.spaceship.transform.x += spaceshipSpeed
  }
  if (this.spaceKey.isDown) this.shot += 1
  if (this.spaceKey.isDown && this.shot === 5) {
    this.laserGroup.addChild(new laser1(this.spaceship.x, this.spaceship.y))
    this.shot = 0
  }
  this.laserGroup.members.forEach((laser, li) => {
    laser.transform.x += 12
    if (laser.x > 1000) laser.destroy()
    this.enemyGroup.members.forEach((enemy, ei) => {
      if (laser.physics.overlaps(enemy)) {
        this.laserGroup.members.splice(li, 1)
        this.enemyGroup.members.splice(ei, 1)
        score += 10
        this.score.text = getScore()
      }
    })
    if (laser.physics.overlaps(this.enemyGroup)) laser.destroy()
  })

  this.enemyGroup.members.forEach((enemy, ei) => {
    enemy.transform.x -= 5
    if (enemy.x === -50) {
      this.enemyGroup.members.splice(ei, 1)
    }
  })

  if (this.enemyLoop === 30) {
    this.enemyGroup.addChild(new enemy1())
    this.enemyLoop = 0
  }
}

function laser1(x, y) {
  GameObjects.Sprite.call(this, state, state.textures.laser1, x, y, true)
  this.physics = this.components.add(new Components.ArcadePhysics(
    this, this.box))
}

Kiwi.extend(laser1, Kiwi.GameObjects.Sprite);

function enemy1() {
  GameObjects.Sprite.call(this, state, state.textures.enemy, 1000, Math.random() * 512, true)
  this.physics = this.components.add(new Components.ArcadePhysics(
    this, this.box))
  
  this.scaleToWidth(50)
  this.anchorPointY = 0
  this.anchorPointX = 0
}

Kiwi.extend(enemy1, Kiwi.GameObjects.Sprite);

game.states.addState(state)
game.states.switchState('lvl1')
