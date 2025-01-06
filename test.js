let engine = new CEngine(document.body, innerWidth, innerHeight, 100)
let mainScene = engine.createGameScene()
let obj = new GameObject(20, 20, 40, 40)
let solid = new SolidObject(50, 20, 30, 30, new Color(50, 100, 0, 0.5))
solid.physicsEnabled=false

let player = new SolidObject(innerWidth/2+20, innerHeight/2+20, 40, 40)

player.friction = 0.3
player.maxSpeed = 7

const playerAcc=0.8

player.scripts.push(function (self){
    // player controller

    let input = engine.getInputVector("a", "d", "w", "s")

    self.acceleration.x=Math.abs(playerAcc*input.x)
    self.acceleration.y=Math.abs(playerAcc*input.y)

    if (input.x) self.direction.x=input.x
    if (input.y) self.direction.y=input.y
    console.log(engine.mouse.position)
})
// solid.scripts.push(function (self){
//     let velocity = new Vector2(0, 0)
    
//     // player controller
//     if (engine.keyStates["d"]){
//         velocity.x+=1
//     } if (engine.keyStates["a"]){
//         velocity.x-=1
//     } if (engine.keyStates["w"]){
//         velocity.y-=1
//     } if (engine.keyStates["s"]){
//         velocity.y+=1
//     }
//     self.position = Vector2.add(self.position, Vector2.scale(velocity.normalized, playerSpeed))
// })

mainScene.addGameObject(obj)
mainScene.addGameObject(solid)
mainScene.addGameObject(player)

engine.startMainLoop()
