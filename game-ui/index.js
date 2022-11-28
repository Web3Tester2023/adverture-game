const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // canvas context

canvas.width = 1024;
canvas.height = 576;

// create 2D array of collisions
const collisionsMap = [];
for (let i=0; i<collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
    static width = 48;
    static height = 48;
    constructor({position}){
        this.position = position;
        this.width = 48;
        this.height = 48;
    }
    draw(){
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boundaries = [];
const offset = {
    x: -735,
    y: -650,
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) boundaries.push(new Boundary({position: {x:j*Boundary.width+offset.x, y:i*Boundary.height+offset.y}}))
    })
})

c.fillStyle = "grey";
c.fillRect(0, 0, 1024, 576);

const bgImage = new Image();
bgImage.src = "./img/pelletTown.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
    constructor({ position, image, frames = {max:1} }){
        this.position = position;
        this.image = image;
        this.frames = frames;

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
            console.log(this.width);
            console.log(this.height);

        }
    }
    draw(){
        c.drawImage(
            this.image, 
            0, // x coordinate to being cropping from
            0, // y coordinate to begin cropping from
            this.image.width/this.frames.max, // crop width
            this.image.height, // crop height
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max, // size of output width
            this.image.height, // size of output height
            );
        }
    }
    
const player = new Sprite({
    position: {
        x: canvas.width/2 - 192/4/2, 
        y: canvas.height/2 - 68/2,
    },
    image: playerImage,
    frames: {max:4}
})

const background = new Sprite({ 
    position: {x:offset.x, y:offset.y},
    image: bgImage,
});

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
}

const movables = [background, ...boundaries]; // spread operator to take all items within the array, so there's no 2D arrays

function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && // if right side of player > left side of box == colliding (on left side of box)
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && // check left side of player vs right side of box
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height && // check top of player and bottom of box
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y // check bottom of player and top of box
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    // draw boundaries before player so player moves above boundaries
    boundaries.forEach(boundary => {
        boundary.draw();
        if ( rectangularCollision({rectangle1: player, rectangle2: boundary}) ){
            console.log(`colliding`)
        };
    })
    player.draw();


    if (keys.w.pressed && lastKey === 'w'){
        movables.forEach(movable => movable.position.y += 5)
    } else if (keys.a.pressed && lastKey === 'a'){
        movables.forEach(movable => movable.position.x += 5)
    } else if (keys.s.pressed && lastKey === 's'){
        movables.forEach(movable => movable.position.y -= 5)
    } else if (keys.d.pressed && lastKey === 'd'){
        movables.forEach(movable => movable.position.x -= 5)
    } 
}
animate();

let lastKey = '';
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});