import canvasSketch from 'canvas-sketch';
import p5 from 'p5'

// Attach p5.js it to global scope
const preload = p5 => {
	// You can use p5.loadImage() here, etc...
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


export default function basicP5(accelData) {
	canvasSketch(({}) => {
		return ({
			p5,
			time,
			width,
			height
		}) => {

			const accelPoint = accelData.next();
			if (!accelPoint) return;
			// console.log(accelPoint)
			const scaleFactor = 30;
			const scaleFactorShade = 20;
			const scaledAccelPoint = {
				x: accelPoint.x * scaleFactor,
				y: accelPoint.y * scaleFactor,
				z: accelPoint.z * scaleFactor,
			};

			// Draw with p5.js things
			p5.background(0);
			p5.fill(accelPoint.z * scaleFactorShade);
			p5.noStroke();
			p5.rect(Math.abs(scaledAccelPoint.x), Math.abs(scaledAccelPoint.y), Math.abs(scaledAccelPoint.x), Math.abs(scaledAccelPoint.y))
		};
	}, settings);
}