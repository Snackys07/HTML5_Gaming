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

// function called to display score
const getScore = () => `Score : ${score}`

state.preload = function () {
  State.prototype.preload.call(this)
  this.addImage('background', 'assets/img/bg.png')
  this.addImage('spaceship', 'assets/img/spaceship.png')
  this.addImage('torpido', 'assets/img/torpido.png')
  this.addImage('enemy', 'assets/img/alien_2.png')
}

state.create = function () {
  State.prototype.preload.call(this)
  this.background = new GameObjects.StaticImage(this, this.textures.background, 0, 0)

  // score
  this.score = new HUD.Widget.MenuItem(this.game, 'Score : 0', 10, 10)
  this.score.style.color = 'white'
  this.game.huds.defaultHUD.addWidget(this.score)

  // spaceship
  this.spaceship = new GameObjects.StaticImage(this, this.textures.spaceship, 0, 150)
  this.spaceship.scaleToWidth(50)
  this.spaceship.anchorPointY = 0
  this.spaceship.anchorPointX = 0

  // keys to mouve the spaceship
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
  if (this.upKey.isDown) this.spaceship.transform.y -= spaceshipSpeed
  if (this.downKey.isDown) this.spaceship.transform.y += spaceshipSpeed
  if (this.leftKey.isDown) this.spaceship.transform.x -= spaceshipSpeed
  if (this.rightKey.isDown) this.spaceship.transform.x += spaceshipSpeed
  if (this.spaceKey.isDown) this.shot += 1
  if (this.spaceKey.isDown && this.shot === 5) {
    this.torpidoGroup.addChild(new torpido(this.spaceship.x, this.spaceship.y))
    this.shot = 0
  }

  // move the torpidos and remove them if they are leaving the canvas
  // or are hiting an enemy
  this.torpidoGroup.members.forEach((torpido, li) => {
    torpido.transform.x += 12
    if (torpido.x > 1000) torpido.destroy()
    this.enemyGroup.members.forEach((enemy, ei) => {
      // if they overlaps with an enmy remove the torpido
      // and remove the enmy then add 10 pts to the 
      // score
      if (torpido.physics.overlaps(enemy)) {
        this.torpidoGroup.members.splice(li, 1)
        this.enemyGroup.members.splice(ei, 1)
        score += 10
        this.score.text = getScore()
      }
    })
    if (torpido.physics.overlaps(this.enemyGroup)) torpido.destroy()
  })

  // move enemy and remove them if they leave the canvas
  this.enemyGroup.members.forEach((enemy, ei) => {
    enemy.transform.x -= 5
    if (enemy.x === -50) this.enemyGroup.members.splice(ei, 1)
  })

  // enemy loop
  if (this.enemyLoop === 30) {
    this.enemyGroup.addChild(new enemy())
    this.enemyLoop = 0
  }
}

// torpido object
function torpido(x, y) {
  GameObjects.Sprite.call(this, state, state.textures.torpido, x, y, true)
  this.physics = this.components.add(new Components.ArcadePhysics(this, this.box))
}

Kiwi.extend(torpido, Kiwi.GameObjects.Sprite);

// enemy object
function enemy() {
  GameObjects.Sprite.call(this, state, state.textures.enemy, 1000, Math.random() * 512, true)
  this.physics = this.components.add(new Components.ArcadePhysics(this, this.box))

  this.scaleToWidth(50)
  this.anchorPointY = 0
  this.anchorPointX = 0
}

Kiwi.extend(enemy, Kiwi.GameObjects.Sprite);

game.states.addState(state)
game.states.switchState('lvl1')