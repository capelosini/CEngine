class Color{
    constructor(r,g,b,a=255){
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
}

class Vector2{
    constructor(x=0, y=0){
        this.x = x
        this.y = y
    }

    get magnitude(){
        return Math.sqrt(this.x**2 + this.y**2)
    }

    get normalized(){
        let mag = this.magnitude
        if (mag==0) return new Vector2(0, 0)
        return new Vector2(this.x/mag, this.y/mag)
    }

    get abs(){
        return new Vector2(Math.abs(this.x), Math.abs(this.y))
    }

    static add(v1, v2){
        return new Vector2(v1.x+v2.x, v1.y+v2.y)
    }

    static subtract(v1, v2){
        return new Vector2(v1.x-v2.x, v1.y-v2.y)
    }

    static subtractScale(v1, s){
        return new Vector2(v1.x-s, v1.y-s)
    }

    static multiply(v1, v2){
        return new Vector2(v1.x*v2.x, v1.y*v2.y)
    }

    static scale(v, s){
        return new Vector2(v.x*s, v.y*s)
    }

    static divide(v1, v2){
        return new Vector2(v1.x/v2.x, v1.y/v2.y)
    }
}

// WARN: THIS IS A BASIC TYPE, IF YOU WANT AN OBJECT WITH FUNCTIONALITY CHOOSE ONE OF THE CHILD TYPES
class GameObject{
    constructor(x, y, w, h){
        this.position = new Vector2(x, y)
        this.size = {width: w, height: h}
        this.scripts = []
        this.visible = true
    }

    drawInvoke(engine){
        if (!this.visible) return
        this.draw(engine)
    }

    draw (engine){
        engine.ctx.fillStyle = engine.colorToString(new Color(30, 30, 30))
        engine.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}

class PhysicsObject extends GameObject{
    constructor(x, y, w, h, mass=1){
        super(x, y, w, h)
        this.mass = mass
        this.velocity = new Vector2(0, 0)
        this.maxSpeed = 20
        this.friction = 0.2
        this.acceleration = new Vector2(0, 0)
        this.direction = new Vector2(0, 0)
        this.physicsEnabled=true
    }

    physicsProcess(){
        if (!this.physicsEnabled) return
        let acc = Vector2.multiply(this.acceleration, this.direction)
        let fric = new Vector2(this.friction*this.mass, this.friction*this.mass)// Vector2.scale(this.direction, this.friction)
        
        // apply acc
        this.velocity = Vector2.add(this.velocity, acc)

        let movDir = new Vector2(0,0)

        // apply fric
        if (this.velocity.x > 0){
            this.velocity.x -= fric.x
            movDir.x = 1
        } else if (this.velocity.x < 0){
            this.velocity.x += fric.x
            movDir.x = -1
        }
        if (this.velocity.y > 0){
            this.velocity.y -= fric.y
            movDir.y = 1
        } else if (this.velocity.y < 0){
            this.velocity.y += fric.y
            movDir.y = -1
        }
        
        // apply max speed
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed
        if (this.velocity.y > this.maxSpeed) this.velocity.y = this.maxSpeed
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed
        if (this.velocity.y < -this.maxSpeed) this.velocity.y = -this.maxSpeed

        if (Math.abs(this.velocity.x) < 0.1 && this.acceleration.x <= 0) this.velocity.x = 0
        if (Math.abs(this.velocity.y) < 0.1 && this.acceleration.y <= 0) this.velocity.y = 0
        
        // apply velocity
        this.position = Vector2.add(this.position, Vector2.multiply(this.velocity.abs, movDir.normalized))
    }

    draw(engine){
        this.physicsProcess()
        engine.ctx.fillStyle = engine.colorToString(new Color(30, 30, 30))
        engine.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}

class SolidObject extends GameObject{
    constructor(x, y, w, h, color=new Color(30, 30, 30)){
        super(x, y, w, h)
        this.color = color
    }
    
    draw (engine){
        engine.ctx.fillStyle = engine.colorToString(this.color)
        engine.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}

class Scene{
    constructor(){
        this.backgroundColor = new Color(200, 200, 200)
        this.objects = []
        this.scripts = []
    }

    addGameObject(obj){
        this.objects.push(obj)
    }
}

class CEngine{
    constructor(elementToAppend, sx, sy, fps=30){
        this.scenes=[]
        this.size = {width: sx, height: sy}
        this.fps = fps
        this.backgroundColor = new Color(0, 0, 0)
        this.activeScene = null
        this.renderLoop = null
        this.keyStates = {
            // Letters
            "a": false, "b": false, "c": false, "d": false, "e": false, "f": false, "g": false, 
            "h": false, "i": false, "j": false, "k": false, "l": false, "m": false, "n": false, 
            "o": false, "p": false, "q": false, "r": false, "s": false, "t": false, "u": false, 
            "v": false, "w": false, "x": false, "y": false, "z": false,
          
            // Numbers
            "0": false, "1": false, "2": false, "3": false, "4": false, 
            "5": false, "6": false, "7": false, "8": false, "9": false,
          
            // Symbols
            "`": false, "-": false, "=": false, "[": false, "]": false, "\\": false, 
            ";": false, "'": false, ",": false, ".": false, "/": false,
          
            // Function keys
            "F1": false, "F2": false, "F3": false, "F4": false, "F5": false, "F6": false,
            "F7": false, "F8": false, "F9": false, "F10": false, "F11": false, "F12": false,
          
            // Arrow keys
            "ArrowUp": false, "ArrowDown": false, "ArrowLeft": false, "ArrowRight": false,
          
            // Whitespace and control keys
            "Enter": false, "Tab": false, "Space": false, "Backspace": false,
          
            // Modifier keys
            "Shift": false, "Control": false, "Alt": false, "Meta": false, // Meta = Windows/Command key
          
            // Navigation keys
            "Insert": false, "Delete": false, "Home": false, "End": false, 
            "PageUp": false, "PageDown": false,
          
            // Lock keys
            "CapsLock": false, "NumLock": false, "ScrollLock": false,
          
            // Special keys
            "Escape": false, "Pause": false, "PrintScreen": false,
          
            // Numpad keys
            "NumPad0": false, "NumPad1": false, "NumPad2": false, "NumPad3": false,
            "NumPad4": false, "NumPad5": false, "NumPad6": false, "NumPad7": false,
            "NumPad8": false, "NumPad9": false, "NumPadDivide": false, "NumPadMultiply": false,
            "NumPadSubtract": false, "NumPadAdd": false, "NumPadEnter": false, "NumPadDecimal": false,
        };

        document.addEventListener("keydown", (e)=>{
            this.keyStates[e.key] = true
        })
        document.addEventListener("keyup", (e)=>{
            this.keyStates[e.key] = false
        })
        
        // create element
        this.canvas = document.createElement("canvas")
        this.canvas.width = sx
        this.canvas.height = sy
        elementToAppend.appendChild(this.canvas)
        this.ctx = this.canvas.getContext("2d")
    }

    startMainLoop(){
        if (this.renderLoop){ return; }

        this.renderLoop = setInterval(()=>{
            this.render()
        }, 1000/this.fps)
    }

    stopMainLoop(){
        if (!this.renderLoop){ return; }

        clearInterval(this.renderLoop)
        this.renderLoop = null
    }

    clearToColor(color){
        this.ctx.fillStyle = this.colorToString(color)
        this.ctx.fillRect(0, 0, this.size.width, this.size.height)
    }

    render (){
        if (this.activeScene){
            //background(CE.activeScene.backgroundColor.r, CE.activeScene.backgroundColor.g, CE.activeScene.backgroundColor.b)
            this.clearToColor(this.activeScene.backgroundColor)
            // RUN SCENE SCRIPTS
            for(let i = 0; i < this.activeScene.scripts.length; i++){
                if (typeof(this.activeScene.scripts[i]) == "function"){
                    this.activeScene.scripts[i](this.activeScene)
                }
            }
            for (let i = 0; i < this.activeScene.objects.length; i++){
                // RUN GAME OBJECT SCRIPTS
                for(let j = 0; j < this.activeScene.objects[i].scripts.length; j++){
                    if (typeof(this.activeScene.objects[i].scripts[j]) == "function"){
                        this.activeScene.objects[i].scripts[j](this.activeScene.objects[i])
                    }
                }
                // RUN THE OBJECT DRAW METHOD
                this.activeScene.objects[i].drawInvoke(this)
            }
        } else{
            this.clearToColor(this.backgroundColor)
            //background(CE.backgroundColor.r, CE.backgroundColor.g, CE.backgroundColor.b)
        }
    }

    createGameScene(){
        let scene = new Scene()
        this.scenes.push(scene)
        if (this.activeScene == null){
            this.activeScene = scene
        }
        return scene
    }

    colorToString(color){
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    }

    getInputVector(left="a", right="d", up="w", down="s"){
        let vec = new Vector2(0,0)
        
        // if both been pressed or none
        if (engine.keyStates[left] == engine.keyStates[right]){
            vec.x=0
        } else if (engine.keyStates[left]){
            vec.x=-1;
        } else if (engine.keyStates[right]){
            vec.x=1;
        }
        
        // if both been pressed or none
        if (engine.keyStates[up] == engine.keyStates[down]){
            vec.y=0
        } else if (engine.keyStates[up]){
            vec.y=-1;
        } else if (engine.keyStates[down]){
            vec.y=1;
        }

        return vec
    }
}

