import canvasSketch from 'canvas-sketch';
import p5 from 'p5'


let size;
let r; // radius
let x, y; // location
let xspeed = 5; // speed
let bcolor; // color
let rotation; //rotation
//number of sprites in 3 layers
let bground = 1;
let mdground = 1;
let frground = 0;
let total = bground + mdground + frground;
//size of sprites in 3 layers
let bgsize = 0;
let mdsize = 0;
let frsize = 1;
let spriteIndex = 1;

let sprite1;
let sprite2;
let sprite3;

let spriteTable = {}
let flower;
let spriteCount = 30
//how many frames to wait before increasing the animation frame
let animationLag = 10;
let animationIndex = 0;
let loc;
let offset;
let sprites = []


const n = 8; // size of the grid

let idFrom = 0;
let idTo = 0;

// Attach p5.js it to global scope
const preload = p5 => {
	let filePrefix = "eyeball"
	for (let i = 1; i <= spriteCount; i++) {
		let spriteName = "sprite" + i
		let filename
		if (i < 10) {
			filename = filePrefix + "000" + i
		} else if (i < 100) {
			filename = filePrefix + "00" + i
		} else {
			filename = filePrefix + "0" + i
		}
		spriteTable[spriteName] = p5.loadImage('assets/eyeball/' + filename + '.png');
	}
	flower = p5.loadImage('assets/eyeball/flower.png');
};

const settings = {
	// The file name without extension, defaults to current time stamp
	// Optional prefix applied to the file name
	prefix: 'totem',
	// Tell canvas-sketch we're using p5.js
	p5: {
		p5,
		preload
	},
	// Turn on a render loop (it's off by default in canvas-sketch)
	animate: true,
};


export default function boat(accelData, demo) {
	canvasSketch(({
		p5
	}) => {
		// p5.smooth();
		// p5.frameRate(25);
		p5.fill(100);
		p5.noStroke();

		// Jitter class
		class Sprite {
			constructor(tempR) {
				this.r = tempR
				this.x = p5.width / 2;
				this.y = p5.height / 2;
				//initialize layer positions
				this.bx = p5.width / 2;
				this.by = p5.height / 2;
				this.cx = p5.width / 2;
				this.cy = p5.height / 2;
				this.dx = p5.width / 2;
				this.dy = p5.height / 2;
				this.speed = 1;

			}
			move(scaledAccelPoint) {
				// this.x += this.xspeed * p5.map((scaledAccelPoint.x), -400, 400, -5, 5, true) // Increment x
				// this.y += this.xspeed * p5.map(scaledAccelPoint.y, -200, 200, -5, 5, true);
				let xPos = p5.map(-scaledAccelPoint.x, -400, 400, 0, p5.width, true)
				let yPos = p5.map(scaledAccelPoint.y, -800, 400, 0, p5.height, true)

				this.x += (xPos - this.x) / 10
				this.y += (yPos - this.y) / 10

				//add easing for each layer relative to pos
				this.bx += (this.x - this.bx) / 5
				this.by += (this.y - this.by) / 5

				this.cx += (this.x - this.cx) / 20
				this.cy += (this.y - this.cy) / 20

				this.dx += (this.x - this.cx) / 30
				this.dy += (this.y - this.cy) / 30

				this.rotation += p5.radians(1);
			}
			display(scaledAccelPoint) {
				p5.fill("#E7C26A");
				// An ellipse
				p5.ellipse(
					this.dx,
					this.dy,
					950, 950);

				p5.fill("#FF67B6");

				p5.ellipse(
					this.cx,
					this.cy,
					800, 800);

				p5.push();
				// p5.translate(this.x, this.y);
				//Display the animated sprite
				let currSprite = "sprite" + spriteIndex

				p5.imageMode(p5.CENTER)

				// A design for a simple flower
				p5.image(flower,
					this.bx,
					this.by,
					700,
					700);
				p5.image(spriteTable[currSprite],
					this.x,
					this.y,
					this.r * 10,
					this.r * 10);
				//next frame
				if (animationIndex > animationLag) {
					//change animation frame
					if (true) {
						if (spriteIndex >= spriteCount) {
							spriteIndex = 1
						} else {
							spriteIndex += 1;
						}
					}
					animationIndex = 0
				} else {
					animationIndex += 1
				}
				p5.pop();
			}
		}

		for (let i = 0; i < total; i++) {
			if (i < bground) {
				sprites[i] = new Sprite(bgsize);
			} else if (i < mdground + bground) {
				sprites[i] = new Sprite(mdsize);
			} else if (i >= mdground) {
				sprites[i] = new Sprite(frsize);
			}
		}

		return ({
			p5,
			time,
			width,
			height,
			frame
		}) => {
			var accelPoint
			if (demo) {
				accelPoint = accelData.next();
			} else {
				if (accelData) {
					accelPoint = accelData.getValue();
				} else {
					accelPoint = {
						x: 0,
						y: 0,
						z: 0
					}
				}
			}

			if (!accelPoint) return;
			// console.log(accelPoint)
			const scaleFactor = 30;
			const scaleFactorShade = 20;
			const scaledAccelPoint = {
				x: accelPoint.x * scaleFactor,
				y: accelPoint.y * scaleFactor,
				z: accelPoint.z * scaleFactor,
			};
			p5.background("#140d07");

			// Move and display sprite
			for (let i = 0; i < sprites.length; i++) {
				sprites[i].move(scaledAccelPoint);
				sprites[i].display(scaledAccelPoint);
			}
		};
	}, settings);
}
