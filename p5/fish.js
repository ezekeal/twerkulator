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
//array length = all layers together
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
	// for (i = 0; i < 10; i++) {
	//
	// }
	spriteTable.sprite1 = p5.loadImage('assets/fish/fish0001.png');
	spriteTable.sprite2 = p5.loadImage('assets/fish/fish0002.png');
	spriteTable.sprite3 = p5.loadImage('assets/fish/fish0003.png');
	spriteTable.sprite4 = p5.loadImage('assets/fish/fish0004.png');
	spriteTable.sprite5 = p5.loadImage('assets/fish/fish0005.png');
	spriteTable.sprite6 = p5.loadImage('assets/fish/fish0006.png');
	spriteTable.sprite7 = p5.loadImage('assets/fish/fish0007.png');
	spriteTable.sprite8 = p5.loadImage('assets/fish/fish0008.png');
	spriteTable.sprite9 = p5.loadImage('assets/fish/fish0009.png');
	spriteTable.sprite10 = p5.loadImage('assets/fish/fish0010.png');
	spriteTable.sprite11 = p5.loadImage('assets/fish/fish0011.png');
};

const settings = {
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
				// p5.noStroke();
				p5.push();
				p5.translate(this.x, this.y);
				p5.rotate(this.rotation);
				//Display the animated sprite
				let currSprite = "sprite" + spriteIndex
				//resize for parallax effect
				p5.image(spriteTable[currSprite], 0, 0, this.r * 3, this.r * 3);
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