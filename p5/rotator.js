import canvasSketch from 'canvas-sketch';
import p5 from 'p5'


let size;
let r; // radius
let x, y; // location
let xspeed = 5; // speed
let bcolor; // color
let rotation; //rotation
//number of sprites in 3 layers
let bground = 10;
let mdground = 10;
let frground = 11;
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
let spriteCount = 30
//how many frames to wait before increasing the animation frame
let animationLag = 100;
let animationIndex = 0;
let loc;
let offset;
let sprites = []

const N_FRAMES = 96; // number of frames in each phase (static or transition)
const N_PATTERNS = 4; // number of patterns coded in getRotation below

const n = 8; // size of the grid

let idFrom = 0;
let idTo = 0;

// Attach p5.js it to global scope
const preload = p5 => {
	let filePrefix = ""
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
		spriteTable[spriteName] = p5.loadImage('assets/rotator/' + filename + '.png');
	}
};

const settings = {
	// The file name without extension, defaults to current time stamp
	// Optional prefix applied to the file name
	prefix: 'rotator',
	// Tell canvas-sketch we're using p5.js
	p5: {
		p5,
		preload
	},
	// Turn on a render loop (it's off by default in canvas-sketch)
	animate: true,
};


export default function rotator(accelData, demo) {
	canvasSketch(({
		p5
	}) => {
		p5.smooth();
		// p5.frameRate(25);
		p5.fill(100);
		p5.noStroke();

		// Jitter class
		class Sprite {
			constructor(tempR) {
				this.r = tempR
				// this.x = p5.random(p5.width);
				this.x = p5.width / 2;
				this.y = p5.height / 2;
				// this.xspeed = p5.map(this.r, bgsize, frsize, 0.5, 2, true); //map the speed in x-direction based on the size/layer of the sprites
				// this.diameter = p5.random(10, 30);
				this.speed = 1;
				// this.bcolor = p5.color(255, 204, 10);
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
				this.rotation += p5.radians(1);
			}
			display(scaledAccelPoint) {
				p5.push();
				p5.translate(this.x, this.y);
				p5.rotate(this.rotation);
				//Display the animated sprite
				let currSprite = "sprite" + spriteIndex
				//resize for parallax effect
				p5.image(spriteTable[currSprite], p5.map((scaledAccelPoint.x), -400, 400, -p5.width / 5, p5.width / 5, true), p5.map((scaledAccelPoint.y), -400, 400, -p5.height / 5, p5.height / 5, true), this.r * 10, this.r * 10);
				//next frame
				if (animationIndex > animationLag) {
					//change animation frame
					// if ((scaledAccelPoint.x + scaledAccelPoint.y + scaledAccelPoint.z)/3 > 50) {
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

		// accelData.start();
		return ({
			p5,
			time,
			width,
			height,
			frame
		}) => {
			var accelPoint;
			if (demo) {
				accelPoint = accelData.next();
			} else {
				const accelPoint = accelData.getValue();
			}
			if (!accelPoint) return;
			if (frame === 0) {
				// // clear canvas
				// context.fillStyle = 'black';
				// context.fillRect(0, 0, width, height);
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
			let backgroundShade = p5.map(accelPoint.z, -100, 100, 0, 100, false);
			p5.background(p5.color('hsl(309, ' + backgroundShade + '%, 61%)'));
			// p5.background(accelPoint.z * scaleFactorShade);

			const realSize = p5.min([width * 0.8, height * 0.8]); // real width and height of the sketch
			const s = realSize / n; // size of each grid tile
			const m = 4; // space between 2 arcs

			let xCorner = (width - realSize) / 2;
			let yCorner = (height - realSize) / 2;

			let t = (p5.frameCount % N_FRAMES) / N_FRAMES;
			t = easeInOutExpo(t);

			if (p5.frameCount % (2 * N_FRAMES) == 0) {
				idFrom = idTo;
				// for the next N_FRAMES, the pattern will stay the same
			} else if (p5.frameCount % (2 * N_FRAMES) == N_FRAMES) {
				idTo = (idTo + 1) % N_PATTERNS;
				// for the next N_FRAMES, the pattern will change to the next one
			}

			for (let i = 0; i < n; i++) {
				for (let j = 0; j < n; j++) {
					let thetaFrom = getRotation(i, j, idFrom);
					let thetaTo = getRotation(i, j, idTo);
					let theta = p5.map(t, 0, 1, thetaFrom, thetaTo);

					p5.push();
					p5.translate(xCorner + (i + 1 / 2) * s, yCorner + (j + 1 / 2) * s);
					p5.rotate(theta);
					p5.image(spriteTable["sprite5"], m / 2 - s / 2, m / 2 - s / 2, s * 2 - m * 2, s * 2 - m * 2);
					p5.pop();
				}
			}

			function getRotation(i, j, id) {
				let rot;
				switch (id) {
					case 0:
						rot = (j < n / 2) ? (2 + p5.floor(i / (n / 2))) : (1 - p5.floor(i / (n / 2)));
						break;
					case 1:
						rot = (j % 2 == 0) ? (2 + (i % 2)) : (1 - (i % 2));
						break;
					case 2:
						rot = (j % 2 == 0) ? (1 + 2 * (i % 2)) : (1 + 2 * (1 - i % 2));
						break;
					case 3:
						rot = (i % 2) + (j % 2) * 2 + 1;
						break;
				}
				return rot * p5.PI / 2;
			}

			// from https://easings.net/
			function easeInOutExpo(x) {
				return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? p5.pow(2, 20 * x - 10) / 2 : (2 - p5.pow(2, -20 * x + 10)) / 2;
			}

			function windowResized() {
				// resizeCanvas(windowWidth, windowHeight);
			}




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
