namespace SpriteKind {
    export const Collectable = SpriteKind.create();
    export const EndChest = SpriteKind.create();
    export const Arrow = SpriteKind.create();
    export const EndChest2 = SpriteKind.create();
    export const EndChest3 = SpriteKind.create();
}

// Vars
info.setScore(0)
info.setLife(5)

let death = false;
game.splash("How to Move.", "Use Arrows")
game.splash("How to Win.", "Get the food and reach the chest!")

// Spawn/Tilemap Logic
let myPlayer = sprites.create(assets.image`myPlayer-front`, SpriteKind.Player)
scene.setBackgroundImage(assets.image`myBackground`)
scene.setTileMapLevel(assets.tilemap`level`)
tiles.placeOnTile(myPlayer, tiles.getTileLocation(0, 18))

// Player Logic
scene.cameraFollowSprite(myPlayer)
controller.moveSprite(myPlayer, 100, 100);

// Timer Logic
let gameStart = false

controller.anyButton.onEvent(ControllerButtonEvent.Pressed,function (){
    if(!gameStart){
        info.startCountdown(90.5)
        gameStart = true
    }
})

// Logic 
let pizza = sprites.create(assets.image`pizza`, SpriteKind.Collectable);
tiles.placeOnRandomTile(pizza, assets.tile`DGNB2`)

let mychest = sprites.create(assets.image`myChest`, SpriteKind.EndChest);
tiles.placeOnRandomTile(mychest, assets.tile`DGNB`)

sprites.onOverlap(SpriteKind.Player, SpriteKind.Collectable, function(sprite: Sprite, otherSprite: Sprite) {
    sprites.destroy(otherSprite);
    info.changeScoreBy(1)
})

// Chest/Level Change
info.onScore(1, function (){
    sprites.onOverlap(SpriteKind.Player, SpriteKind.EndChest, function (sprite: Sprite, otherSprit2: Sprite) {
        sprites.destroy(otherSprit2);
        scene.setTileMapLevel(assets.tilemap`level2`)
        tiles.placeOnTile(myPlayer, tiles.getTileLocation(0, 27))
        info.setScore(0)
        info.stopCountdown
        info.startCountdown(60.1)

        // Pizza2
        let pizza2 = sprites.create(assets.image`pizza`, SpriteKind.Collectable)
        tiles.placeOnRandomTile(pizza2, assets.tile`tileGrassBAD`)

        let pizza3 = sprites.create(assets.image`pizza`, SpriteKind.Collectable)
        tiles.placeOnRandomTile(pizza3, assets.tile`tileGrassBAD`)

        // Pie
        let pie = sprites.create(assets.image`pie`, SpriteKind.Collectable)
        tiles.placeOnRandomTile(pie, assets.tile`tileGrassBAD`)
        let pie2 = sprites.create(assets.image`pie`, SpriteKind.Collectable)
        tiles.placeOnRandomTile(pie2, assets.tile`tileGrassBAD`)

        // Chest2
        let chest2 = sprites.create(assets.image`myChest2`, SpriteKind.EndChest2)
        tiles.placeOnRandomTile(chest2, assets.tile`tileGrassBAD`)


        game.splash("How to Win.", "Find 2 pizzas and Pies and reach the chest!")

    });
})

info.onScore(4, function (){
    sprites.onOverlap(SpriteKind.Player, SpriteKind.EndChest2, function (sprite: Sprite, otherSprite: Sprite) {
        sprites.destroy(otherSprite);
        scene.setTileMapLevel(assets.tilemap`endSprint`)
        tiles.placeOnTile(myPlayer, tiles.getTileLocation(0, 28))
        info.setScore(0)
        info.stopCountdown
        info.startCountdown(60.1)
        let chest3 = sprites.create(assets.image`myChest3`, SpriteKind.EndChest3)
        tiles.placeOnRandomTile(chest3, assets.tile`tileGrassBAD`)
    })
})

info.onScore(0, function () {
    sprites.onOverlap(SpriteKind.Player, SpriteKind.EndChest3, function (sprite: Sprite, otherSprite: Sprite) {
        sprites.destroy(otherSprite);
        game.gameOver(true)
    })
})

info.onCountdownEnd(function (){
    game.setGameOverScoringType(game.ScoringType.None)
    game.gameOver(false)
})

// Arrows Down
game.onUpdateInterval(500, function(){
    if (!death){
        let arrow = sprites.create(assets.image`arrowDown`, SpriteKind.Arrow);
        tiles.placeOnRandomTile(arrow, assets.tile`arrowTile`);
        arrow.vy = 135;
        arrow.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})

// Arrows Up
game.onUpdateInterval(520, function () {
    if (!death) {
        let arrow = sprites.create(assets.image`arrowUp`, SpriteKind.Arrow);
        tiles.placeOnRandomTile(arrow, assets.tile`arrowTileUp`);
        arrow.vy = -135;
        arrow.setFlag(SpriteFlag.GhostThroughWalls, true)
    }
})

sprites.onOverlap(SpriteKind.Arrow, SpriteKind.Player, function (arrow, otherSprite) {
    sprites.destroy(arrow)
    info.changeLifeBy(-1)
    myPlayer.startEffect(effects.fire, 1000)
    info.changeCountdownBy(-10)
})
sprites.onOverlap(SpriteKind.Arrow, SpriteKind.Arrow, function (arrow, arrow2) {
    arrow.startEffect(effects.fire, 2000)
    arrow2.startEffect(effects.fire, 2000)
    sprites.destroy(arrow)
    sprites.destroy(arrow2)
})


info.onLifeZero(function (){
    animation.runImageAnimation(myPlayer, assets.animation`myAnim1`, 500, false)
    info.startCountdown(3)
    death = true;
    controller.moveSprite(myPlayer, 0, 0);
    sprites.destroyAllSpritesOfKind(SpriteKind.Arrow)
    info.onCountdownEnd(function(){
        game.gameOver(false)
    })
})