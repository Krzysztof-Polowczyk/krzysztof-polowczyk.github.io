//https://krzysztof-polowczyk.github.io/alien-mario/

const PlayState = {}

function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero')
    this.anchor.set(0.5, 0.5)
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true

    this.animations.add('stop', [0])
    this.animations.add('run', [1, 2], 8, true)
    this.animations.add('jump', [3])
    this.animations.add('fall', [4])
}

Hero.prototype = Object.create(Phaser.Sprite.prototype)
Hero.prototype.constructor = Hero
Hero.prototype.move = function (direction) {
    this.body.velocity.x = direction * 200

    if (this.body.velocity.x < 0) {
        this.scale.x = -1
    } else if (this.body.velocity.x > 0) {
        this.scale.x = 1
    }
}
Hero.prototype.jump = function () {
    const canJump = this.body.touching.down
    if (canJump) {
        this.body.velocity.y = -600

    }
    return canJump
}
Hero.prototype.bounce = function() {
    this.body.velocity.y = -200
}
Hero.prototype.update = function () {
    let animationName = this._getAnimationName()
    if (this.animations.name !== animationName) {
        this.animations.play(animationName)
    }
}

Hero.prototype._getAnimationName = function() {
    let name = 'stop'

    if (this.body.velocity.y < 0) {
        name = 'jump'
    }
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall'
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run'
    }

    return name
}

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider')
    this.anchor.set(0.5)
    this.animations.add('crawl', [0, 1, 2], 8, true)
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12)
    this.animations.play('crawl')
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true
    this.body.velocity.x = Spider.SPEED
    this.scale.x = -1
}

Spider.SPEED = 100

Spider.prototype = Object.create(Phaser.Sprite.prototype)
Spider.prototype.constructor = Spider
Spider.prototype.update = function() {
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED
        this.scale.x = 1
    } else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED
        this.scale.x = -1
    }
}
Spider.prototype.die = function(addCoins) {
    addCoins(2)
    this.body.enable = false
    this.animations.play('die').onComplete.addOnce(function() {
        this.kill()
    }, this)
}


function RedSpider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'redspider')
    this.anchor.set(0.5)
    this.animations.add('crawl', [0, 1, 2], 8, true)
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12)
    this.animations.play('crawl')
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true
    this.body.velocity.x = RedSpider.SPEED
    this.scale.x = -1

    this._jumping = false
    this._lastJump = 0
}

RedSpider.SPEED = 100

RedSpider.prototype = Object.create(Phaser.Sprite.prototype)
RedSpider.prototype.constructor = RedSpider

RedSpider.prototype.jump = function () {
    const canJump = this.body.touching.down
    if (canJump) {
        // console.log('jumping start', Date.now())
        this._jumping = true
        this.body.velocity.y = -400
    }
}

RedSpider.prototype.update = function() {
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -RedSpider.SPEED
        this.scale.x = 1
    } else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = RedSpider.SPEED
        this.scale.x = -1
    }

    if (!this.body.touching.down) return;

    if (this._jumping) {
        // console.log('jumping end', Date.now())
        this._jumping = false
        this._lastJump = Date.now()
    } else {
        if (((Date.now() - this._lastJump) < 1500)) return;

        const xDiff = Math.abs(this.body.position.x - PlayState.hero.body.position.x)
        const yDiff = this.body.position.y - PlayState.hero.body.position.y

        // console.log('xDiff', xDiff, 'yDiff', yDiff)

        if (xDiff < 70 && yDiff > 10 && yDiff < 90) {
            this.jump()
        }
    }
}
RedSpider.prototype.die = function(addCoins) {
    addCoins(10)
    this.body.enable = false
    this.animations.play('die').onComplete.addOnce(function() {
        this.kill()
    }, this)
}



function GreenSpider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'greenspider')
    this.anchor.set(0.5)
    this.animations.add('crawl', [0, 1, 2], 8, true)
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12)
    this.animations.play('crawl')
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true
    this.body.velocity.x = GreenSpider.SPEED
    this.scale.x = -1

    this._jumping = false
    this._lastJump = 0
}

GreenSpider.SPEED = 100
GreenSpider.CHARGESPEED = 300


GreenSpider.prototype = Object.create(Phaser.Sprite.prototype)
GreenSpider.prototype.constructor = GreenSpider

GreenSpider.prototype.update = function() {
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = - GreenSpider.SPEED
        this.scale.x = 1
    } else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = GreenSpider.SPEED
        this.scale.x = -1
    }

    if (Math.abs(this.body.velocity.x) == GreenSpider.CHARGESPEED) return;
    
    const widthDiff = this.body.position.x - PlayState.hero.body.position.x

    if (
        (Math.abs(widthDiff) < 200) &&
        (Math.abs(this.body.position.y - PlayState.hero.body.position.y) < 15)
    ) {
        if (widthDiff > 0) {
            this.body.velocity.x = - GreenSpider.CHARGESPEED
            this.scale.x = 1
        } else {
            this.body.velocity.x = GreenSpider.CHARGESPEED
            this.scale.x = -1
        }
    }
}

GreenSpider.prototype.die = function(addCoins) {
    addCoins(10)
    this.body.enable = false
    this.animations.play('die').onComplete.addOnce(function() {
        this.kill()
    }, this)
}


const LEVEL_COUNT = 5

PlayState.init = function(data) {
    this.game.renderer.renderSession.roundPixels = true
    this.coinPickupCount = data.coinPickupCount || 0
    this.startCoinPickupCount = data.coinPickupCount || 0

    this.spidersKilled = data.spidersKilled || 0
    this.startSpidersKilled = data.spidersKilled || 0

    this.deadths = data.deaths || 0

    this.startTime = data.startTime || Date.now()
    this.updateTime = true
    this.finalScreen = false
    this.hasKey = false
    
    this.level = (data.level || 0) % LEVEL_COUNT

    console.log('data', data)
    console.log('level', this.level)
    
    if (this.level == (LEVEL_COUNT - 1)) {
        console.log('final screen');

        this.finalScreen = true
        this.updateTime = false
    }
    
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP 
    })

    this.keys.up.onDown.add(function() {
        const didJump = this.hero.jump()
        if (didJump) {
            this.sfx.jump.play()
        }
    }, this)
}

PlayState.preload = function() {
    this.game.load.image('background', 'images/background.png')
    this.game.load.image('ground', 'images/ground.png')
    this.game.load.image('grass:8x1', 'images/grass_8x1.png')
    this.game.load.image('grass:6x1', 'images/grass_6x1.png')
    this.game.load.image('grass:4x1', 'images/grass_4x1.png')
    this.game.load.image('grass:2x1', 'images/grass_2x1.png')
    this.game.load.image('grass:1x1', 'images/grass_1x1.png')
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42)
    this.game.load.image('invisible-wall', 'images/invisible_wall.png')
    this.game.load.image('icon:coin', 'images/coin_icon.png')
    this.game.load.image('icon:hero-dead', 'images/hero_dead.png')
    this.game.load.image('icon:clock', 'images/clock_icon.png')
    this.game.load.image('icon:spider-dead', 'images/spider_dead.png')

    this.game.load.image('font:numbers', 'images/numbers.png')
    this.game.load.image('key', 'images/key.png')

    this.game.load.audio('sfx:jump', 'audio/jump.wav')
    this.game.load.audio('sfx:coin', 'audio/coin.wav')
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav')

    this.game.load.audio('sfx:key', 'audio/key.wav')
    this.game.load.audio('sfx:door', 'audio/door.wav')

    this.game.load.spritesheet('door', 'images/door.png', 42, 66)    
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22)
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32)
    this.game.load.spritesheet('redspider', 'images/redspider.png', 42, 32)
    this.game.load.spritesheet('greenspider', 'images/greenspider.png', 42, 32)

    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30)

    this.game.load.json('level:0', 'data/level00.json')
    this.game.load.json('level:1', 'data/level01.json')
    this.game.load.json('level:2', 'data/level02.json?v=2')
    this.game.load.json('level:3', 'data/level03.json')
    this.game.load.json('level:4', 'data/level04.json')
}
 
PlayState.create = function() {
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        key: this.game.add.audio('sfx:key'),
        door: this.game.add.audio('sfx:door')
    }

    this.game.add.image(0, 0, 'background')
    console.log('level load', this.level)
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`))
    this._createHud()
}

PlayState.update = function() {
    this._handleCollisions()
    this._handleInput()
    this.coinFont.text = `x${this.coinPickupCount}`

    if (this.updateTime) {
        this.timeFont.text = `${Math.floor((Date.now() - this.startTime) / 1000)}`
    } else {
        this.timeFont.text = ''
    }
    
    this.keyIcon.frame = this.hasKey ? 1 : 0
}

PlayState._handleCollisions = function() {
    this.game.physics.arcade.collide(this.hero, this.platforms)
    this.game.physics.arcade.collide(this.spiders, this.platforms)
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls)

    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this)
    this.game.physics.arcade.overlap(this.hero, this.spiders, this._onHeroVsEnemy, null, this)

    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey, null, this)
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor, function (hero, door) {
        return this.hasKey && hero.body.touching.down
    }, this)
}

PlayState._handleInput = function() {
    if (this.keys.left.isDown) {
        this.hero.move(-1)
    } else if (this.keys.right.isDown) {
        this.hero.move(1)
    } else {
        this.hero.move(0)
    }
}

PlayState._loadLevel = function(data) {
    console.log(data)

    this.bgDecorations = this.game.add.group()
    this.platforms = this.game.add.group()
    this.coins = this.game.add.group()
    this.spiders = this.game.add.group()
    this.enemyWalls = this.game.add.group()
    this.enemyWalls.visible = false

    data.platforms.forEach(this._spawnPlatform, this)
    this._spawnCharacters({
        hero: data.hero,
        spiders: data.spiders,
        redSpiders: data.redSpiders,
        greenSpiders: data.greenSpiders
    })
    data.coins.forEach(this._spawnCoin, this)

    this._spawnDoor(data.door.x, data.door.y)
    this._spawnKey(data.key.x, data.key.y)
    this.game.physics.arcade.gravity.y = 1200
}

PlayState._spawnCoin = function(coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin')
    sprite.anchor.set(0.5, 0.5)

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true)
    sprite.animations.play('rotate')

    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
}

PlayState._spawnPlatform = function(platform) {
    let sprite = this.platforms.create(platform.x, platform.y, platform.image)
    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
    sprite.body.immovable = true

    this._spawnEnemyWall(platform.x, platform.y, 'left')
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right')
}

PlayState._spawnDoor = function(x, y) {
    this.door = this.bgDecorations.create(x, y, 'door')
    this.door.anchor.set(0.5, 1)
    this.game.physics.enable(this.door)
    this.door.body.allowGravity = false
}

PlayState._spawnKey = function(x, y) {
    this.key = this.bgDecorations.create(x, y, 'key')
    this.key.anchor.set(0.5, 0.5)
    this.game.physics.enable(this.key)
    this.key.body.allowGravity = false

    this.key.y -= 3
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start()
}

PlayState._createHud = function() {
    const NUMBERS_STR = '0123456789X '
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6)
    this.timeFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6)

    this.hud = this.game.add.group()
    this.hud.position.set(10, 10)

    this.keyIcon = this.game.make.image(0, 19, 'icon:key')
    this.keyIcon.anchor.set(0, 0.5)

    if (this.finalScreen) {
        let coinIconFinal = this.game.make.image(38, 132, 'icon:coin')
        this.hud.add(coinIconFinal)

        let spidersKilledIconFinal = this.game.make.image(38, 175, 'icon:spider-dead')
        this.hud.add(spidersKilledIconFinal)

        let playTimeIconFinal = this.game.make.image(38, 219, 'icon:clock')
        this.hud.add(playTimeIconFinal)

        let deathsIconFinal = this.game.make.image(38, 262, 'icon:hero-dead')
        this.hud.add(deathsIconFinal)

        let text = this.game.add.text(0, 0,
`Gratulacje, Wygrałeś!!!\n
Zdobyte monety: ${this.coinPickupCount}
Zabite pająki: ${this.spidersKilled}
Czas gry: ${Math.floor((Date.now() - this.startTime) / 1000)} sekund
Śmierci: ${this.deadths}\n\n
Jeśli chcesz zagrać ponownie, przejdź przez drzwi.`,
        {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        })
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
        text.setTextBounds(0, -50, 960, 600)
    } else {
        let timeScoreImg = this.game.make.image(820, 15, this.timeFont)
        timeScoreImg.anchor.set(0, 0.5)
    

    
        let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin')
    
        let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height / 2, this.coinFont)
        coinScoreImg.anchor.set(0, 0.5)
        
        this.hud.add(coinIcon)
        this.hud.add(coinScoreImg)
        this.hud.add(timeScoreImg)
        this.hud.add(this.keyIcon)
    }
}

PlayState._onHeroVsCoin = function(hero, coin) {
    this.sfx.coin.play()
    this.coinPickupCount++
    coin.kill()
}

PlayState._onHeroVsKey = function(hero, key) {
    this.sfx.key.play()
    key.kill()
    this.hasKey = true
}

PlayState._onHeroVsDoor = function(hero, door) {
    this.sfx.door.play()

    if (this.finalScreen) {
        this.game.state.restart(true, false, {
            level: 0,
            coinPickupCount: 0,
            startTime: Date.now()
        })
    } else {
        this.game.state.restart(true, false, {
            level: this.level + 1,
            coinPickupCount: this.coinPickupCount,
            startTime: this.finalScreen ?  Date.now() : this.startTime,
            spidersKilled: this.spidersKilled,
            deadths: this.deadths
        })
    }
}

PlayState._onHeroVsEnemy = function(hero, enemy) {
    if (hero.body.velocity.y > 0 && enemy.body.touching.down) {
        enemy.die(value => this.coinPickupCount += value)
        this.spidersKilled++;
        hero.bounce()
        this.sfx.stomp.play()
    } else {
        this.sfx.stomp.play()
        this.game.state.restart(true, false, {
            level: this.level,
            coinPickupCount: this.startCoinPickupCount,
            startTime: this.startTime,
            spidersKilled: this.startSpidersKilled,
            deadths: this.deadths + 1
        })
    }
}

PlayState._spawnCharacters = function(data) {
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y)
        this.spiders.add(sprite)
    }, this)

    data.redSpiders.forEach(function (spider) {
        let sprite = new RedSpider(this.game, spider.x, spider.y)
        this.spiders.add(sprite)
    }, this)

    data.greenSpiders.forEach(function (spider) {
        let sprite = new GreenSpider(this.game, spider.x, spider.y)
        this.spiders.add(sprite)
    }, this)

    this.hero = new Hero(this.game, data.hero.x, data.hero.y)
    this.game.add.existing(this.hero)
}

PlayState._spawnEnemyWall = function(x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall')
    sprite.anchor.set(side === 'left' ? 1 : 0, 1)

    this.game.physics.enable(sprite)
    sprite.body.immovable = true
    sprite.body.allowGravity = false
}

window.onload = function() {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game')
    game.state.add('play', PlayState)
    game.state.start('play', true, false, {
        level: 0,
        coinPickupCount: 0,
        startTime: Date.now(),
        spidersKilled: 0,
        deaths: 0
    })
}