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
let mdground = 0;
let frground = 0;
let total = bground + mdground + frground;
//size of sprites in 3 layers
let bgsize = 0;
let mdsize = 0;
let frsize = 1;
let spriteIndex = 1;

let spriteTable = {}
let flower;
let spriteCount = 1
//how many frames to wait before increasing the animation frame
let animationLag = 10;
let animationIndex = 0;
let loc;
let offset;
let sprites = []

let curX = 0;
let curY = 0;
let curZ = 0;


const n = 8; // size of the grid

let idFrom = 0;
let idTo = 0;

// Attach p5.js it to global scope
const preload = p5 => {
	flower = p5.loadModel('assets/boat/lowduck.obj', true);
};

const settings = {
	// The file name without extension, defaults to current time stamp
	// Optional prefix applied to the file name
	prefix: 'duck',
	// Tell canvas-sketch we're using p5.js
	p5: {
		p5,
		preload
	},
	// Turn on a render loop (it's off by default in canvas-sketch)
	animate: true,
	context: 'webgl',
};


export default function duck(accelData, demo) {
	canvasSketch(({
		p5
	}) => {

		// Jitter class
		class Sprite {
			constructor(tempR) {
				//test boat size
				this.r = 130
				// this.r = tempR

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
				let xPos = p5.map(-scaledAccelPoint.x, -400, 400, 0, p5.width, true)
				let yPos = p5.map(scaledAccelPoint.y, -800, 400, 0, p5.height, true)

				this.x += (xPos - this.x) / 10
				this.y += (yPos - this.y) / 10
				p5.translate(this.x, this.y);
				//
				//
				// //add easing for each layer relative to pos
				// this.bx += (this.x - this.bx) / 2
				// this.by += (this.y - this.by) / 2
				//
				// this.cx += (this.x - this.cx) / 3
				// this.cy += (this.y - this.cy) / 3
				//
				// this.dx += (this.x - this.dx) / 3
				// this.dy += (this.y - this.dy) / 3
				//
				// this.rotation += p5.radians(1);
			}
			display(scaledAccelPoint) {
				p5.push();
				//Display the animated sprite
				let currSprite = "sprite" + spriteIndex

				p5.imageMode(p5.CENTER)
				// p5.tint(183, 0, 79, 126);
				p5.image(spriteTable[currSprite],
					this.dx,
					this.dy,
					this.r * 2,
					this.r * 2);

				p5.tint(0, 255, 255, 126);
				p5.image(spriteTable[currSprite],
					this.cx,
					this.cy,
					this.r * 2,
					this.r * 2);
				p5.tint(183, 0, 79, 126);

				p5.image(spriteTable[currSprite],
					this.bx,
					this.by,
					this.r * 2,
					this.r * 2);

				// p5.noTint();
				p5.tint(255, 105, 180);

				p5.image(spriteTable[currSprite],
					this.x,
					this.y,
					this.r * 2,
					this.r * 2);
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

		// for (let i = 0; i < total; i++) {
		// 	if (i < bground) {
		// 		sprites[i] = new Sprite(bgsize);
		// 	} else if (i < mdground + bground) {
		// 		sprites[i] = new Sprite(mdsize);
		// 	} else if (i >= mdground) {}
		// }

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
			p5.background("magenta");

			// background(200);
			p5.rotateY(p5.frameCount * 0.01);
			p5.rotateX(p5.frameCount * 0.01);

			p5.normalMaterial();

			let xPos = p5.map(-scaledAccelPoint.x, -400, 400, 0, p5.width, true) / 5
			let yPos = p5.map(scaledAccelPoint.y, -800, 400, 0, p5.height, true) / 5
			let zPos = p5.map(scaledAccelPoint.z, -800, 400, 0, 100, true) / 5

			curY += (yPos - curY) / 10
			curX += (xPos - curX) / 10
			curZ += (zPos - curZ) / 10


			p5.translate(curX, curY, curZ);
			p5.model(flower);

			// let ratios = [0.4, 0.5, 0.6, 0.8, 1, 1, 1, 1]
			let ratios = [1, 1, 1, 1]

			for (let i = 0; i < ratios.length; i++) {
				p5.translate(300, 0, 0);
				p5.rotateY(p5.frameCount * ratios[i] * .01);
				p5.rotateX(p5.frameCount * ratios[i] * .01);

				p5.model(flower);
				p5.translate(0, 0, 200);
				p5.model(flower);

			}



			// // Move and display sprite
			// for (let i = 0; i < sprites.length; i++) {
			// 	sprites[i].move(scaledAccelPoint);
			// 	sprites[i].display(scaledAccelPoint);
			// }
		};
	}, settings);
}