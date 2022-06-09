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

let spriteTable = {}
let flower;
let spriteCount = 1
//how many frames to wait before increasing the animation frame
let animationLag = 10;
let animationIndex = 0;
let loc;
let offset;
let sprites = []


const n = 8; // size of the grid

let idFrom = 0;
let idTo = 0;

//wave configuration
const OCTAVES = 6;
const LACUNARITY = 2.;
const GAIN = .5;

var t;
//from catlike coding, only works 0 to 1
//https://catlikecoding.com/unity/tutorials/noise/
function Smooth(t){
  return t * t * t * (t * (t * 6- 15) + 10);
}
function fBm( p, freq, amp) {
  //point, frequency of noise , and amplitude exponential gain
  var val = 0;
  for ( i = 0; i < OCTAVES; i++){
    val += amp * noise(p * freq);
    freq *= LACUNARITY;
    amp *= GAIN;
  }

  return val;
}

var depth = 40;

//smoothness of the lines
var waveNodes = 60;
var waveHeight;

// Attach p5.js it to global scope
const preload = p5 => {
	let filePrefix = "raft"
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
		spriteTable[spriteName] = p5.loadImage('assets/boat/' + filename + '.png');
	}
	flower = p5.loadImage('assets/boat/raft.png');
};

const settings = {
	// The file name without extension, defaults to current time stamp
	// Optional prefix applied to the file name
	prefix: 'boat',
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

		p5.fill(100);
		p5.stroke(255);
		waveHeight = p5.height/5;

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

				//add easing for each layer relative to pos
				this.bx += (this.x - this.bx) / 2
				this.by += (this.y - this.by) / 2

				this.cx += (this.x - this.cx) / 3
				this.cy += (this.y - this.cy) / 3

				this.dx += (this.x - this.dx) / 3
				this.dy += (this.y - this.dy) / 3

				this.rotation += p5.radians(1);
			}
			display(scaledAccelPoint) {
				p5.push();
				//Display the animated sprite
				let currSprite = "sprite" + spriteIndex

				p5.imageMode(p5.CENTER)
				p5.tint(183, 0, 79, 126);
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
				p5.tint(255,105,180);

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

		for (let i = 0; i < total; i++) {
			if (i < bground) {
				sprites[i] = new Sprite(bgsize);
			} else if (i < mdground + bground) {
				sprites[i] = new Sprite(mdsize);
			} else if (i >= mdground) {
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
			p5.background("#008b8b");

			//create waves
			p5.ellipse (p5.width/2, p5.height*.3,175,175);

			p5.stroke(255);
			for(var z = 0; z < p5.height; z+= 4*depth/p5.height ){
				p5.fill(255,120,(z/depth)*290);
				p5.beginShape();

				var buffer = p5.width*.2 * ((depth-z)/depth);
				p5.vertex(buffer,1000);
					//remember this stupid line for the future
				var lineWidth = (p5.width-buffer) - buffer*(1-(z/depth));
				for( var x = 0; x < lineWidth; x += lineWidth/waveNodes){
					p5.vertex(x+buffer,
								 p5.height/depth + p5.height/z + p5.noise(x*.01+p5.frameCount*.005,z-p5.frameCount*.0075) * waveHeight + 10*z);
				}
				p5.vertex(p5.width-buffer, 1000);
				p5.endShape();
			}

			// Move and display sprite
			for (let i = 0; i < sprites.length; i++) {
				sprites[i].move(scaledAccelPoint);
				sprites[i].display(scaledAccelPoint);
			}
		};
	}, settings);
}
