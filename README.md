# CEngine 🎮

A basic and powerful JavaScript game engine for creating modern web-based 2D games.

## Overview

CEngine is designed to make 2D web game development accessible and efficient, providing developers with the tools they need to create engaging browser-based games without compromising on performance or features.

## Features

- **Lightweight Core**: Minimal overhead while maintaining powerful capabilities
- **Modern JavaScript**: Built using latest JavaScript features for optimal performance
- **Flexible Architecture**: Easy to extend and customize for your specific needs
- **Built-in Physics**: Integrated 2D physics engine for realistic game mechanics
- **Asset Management**: Efficient resource loading and management system
- TODO: **Input Handling**: Support for keyboard, mouse, and touch inputs
- TODO: **Sound System**: Easy-to-use audio management for game sounds and music
- TODO: **Sprite System**: Flexible sprite handling with animation support
- TODO: **Collision Detection**: Efficient collision detection and response system

## Getting Started

### Installation

```html
// download and import the js file into your HTML before 
// your code
<script src="CEngine.js"></script> 
```

### Basic code

```javascript

// Init the main Engine class
let engine = new CEngine(document.body, innerWidth, innerHeight, 100)

// Create a scene to store the GameObjects and other settings
let mainScene = engine.createGameScene()

// Create a basic GameObject (base class, not too many usable stuff here)
let obj = new GameObject(20, 20, 40, 40)

// Create an example of SolidObject
let solid = new SolidObject(50, 20, 30, 30, new Color(50, 100, 0, 0.5))

// Create an example of PhysicsObject
let player = new PhysicsObject(innerWidth/2+20, innerHeight/2+20, 40, 40)

// Some PhysicsObject atributes tweak
player.friction = 0.3
player.maxSpeed = 7

const playerAcc=0.8

// Simple way to add a script to a GameObject (self is the instance of the GameObject)
player.scripts.push(function (self){
    // player controller
    // Get the input Vector (left, right, up, down)
    let input = engine.getInputVector("a", "d", "w", "s")

    // Set the acceleration of the player based in the input Vector, if a key is been pressed add the playerAcc const to the acceleration coord
    self.acceleration.x=Math.abs(playerAcc*input.x)
    self.acceleration.y=Math.abs(playerAcc*input.y)

    // Set the direction of the acceleration based in the input Vector values
    if (input.x) self.direction.x=input.x
    if (input.y) self.direction.y=input.y
})

// Add the created types of GameObject into the main scene we created
mainScene.addGameObject(obj)
mainScene.addGameObject(solid)
mainScene.addGameObject(player)

// Finally, start the main game loop (run the rendering and logic stuff)
engine.startMainLoop()

```

## Documentation

### Basic Concepts

- **CEngine**: The main controller that manages scenes and game loop
- **Scene**: Container for game objects and logic
- **GameObject**: Base class for all game entities
- **Scripts**: Reusable code that can be attached to GameObjects


## Contributing

I'm open to contributions!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

- WebGL support (at the moment using context 2d api)
- Create particle system
- Networking capabilities
- Mobile-optimized features
- Visual editor

---

Made with ❤️ by Clovis
