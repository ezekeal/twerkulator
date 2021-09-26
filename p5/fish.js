import canvasSketch from 'canvas-sketch';
import p5 from 'p5'


let size;
let r; // radius
let x, y; // location
let xspeed; // speed
let bcolor; // color
let rotation; //rotation
//number of sprites in 3 layers
let bground = 10;
let mdground = 10;
let frground = 11;
let total = bground + mdground + frground;
//size of sprites in 3 layers
let bgsize = 25;
let mdsize = 50;
let frsize = 80;
let spriteIndex = 1;

let sprite1;
let sprite2;
let sprite3;

let spriteTable = {}
//how many frames to wait before increasing the animation frame
let animationLag = 100;
let animationIndex = 0;
let loc;
let offset;
let sprites = []

// Attach p5.js it to global scope
const preload = p5 => {
	let filePrefix = "fish"
	for (let i = 1; i <= 11; i++) {
		let spriteName = "sprite" + i
		let filename
		if (i < 10) {
			filename = filePrefix + "000" + i
		} else if (i < 100) {
			filename = filePrefix + "00" + i
		} else {
			filename = filePrefix + "0" + i
		}
		spriteTable[spriteName] = p5.loadImage('assets/fish/' + filename + '.png');
	}
};

const settings = {
	// The file name without extension, defaults to current time stamp
	// Optional prefix applied to the file name
	prefix: 'fish',
	// Tell canvas-sketch we're using p5.js
	p5: {
		p5,
		preload
	},
	// Turn on a render loop (it's off by default in canvas-sketch)
	animate: true,
};


export default function fish(accelData) {
	canvasSketch(({
		p5
	}) => {
		p5.smooth();
		// p5.frameRate(25);

		// Jitter class
		class Sprite {
			constructor(tempR) {
				this.r = tempR
				this.x = p5.random(p5.width);
				this.y = p5.random(p5.height);
				this.xspeed = p5.map(this.r, bgsize, frsize, 0.5, 2, true); //map the speed in x-direction based on the size/layer of the sprites
				this.diameter = p5.random(10, 30);
				this.speed = 1;
				this.bcolor = p5.color(255, 204, 10);
				// this.rotation = p5.radians(p5.random(360));

			}
			move(scaledAccelPoint) {
				this.x += this.xspeed * p5.map((scaledAccelPoint.x), -400, 400, -5, 5, true) // Increment x
				this.y += this.xspeed * p5.map(scaledAccelPoint.y, -200, 200, -5, 5, true);
				// Check edges
				if (this.x > p5.width + r || x < -r) {
					this.x = p5.random(p5.width);
					this.y = p5.random(p5.height);
				}
				if (this.y > p5.height + this.r || this.y < -this.r) {
					this.x = p5.random(p5.width);
					this.y = p5.random(p5.height);
				}
				// this.rotation += p5.radians(1);
			}
			display(scaledAccelPoint) {
				p5.push();
				p5.translate(this.x, this.y);
				p5.rotate(this.rotation);
				//Display the animated sprite
				let currSprite = "sprite" + spriteIndex
				//resize for parallax effect
				let sizeFactor = p5.map((scaledAccelPoint.z + scaledAccelPoint.x) / 2, -400, 400, .8, 1.2, true)
				p5.image(spriteTable[currSprite], 0, 0, this.r * 3 * sizeFactor, this.r * 3 * sizeFactor);
				//next frame
				if (animationIndex > animationLag) {
					if (scaledAccelPoint.x > 50) {
						if (spriteIndex > 10) {
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

		// accelData.start();
		return ({
			p5,
			time,
			width,
			height,
			frame
		}) => {

			const accelPoint = accelData.getValue();
			if (!accelPoint) return;
			if (frame === 0) {
				// clear canvas
				context.fillStyle = 'black';
				context.fillRect(0, 0, width, height);
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

			// Draw loop
			p5.background(accelPoint.z * scaleFactorShade);
			// Move and display sprite
			for (let i = 0; i < sprites.length; i++) {
				sprites[i].move(scaledAccelPoint);
				sprites[i].display(scaledAccelPoint);
			}
			// p5.fill(accelPoint.z * scaleFactorShade);
			// p5.noStroke();
		};
	}, settings);
}