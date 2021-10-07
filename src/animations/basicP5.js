//basic p5.js template to use
import canvasSketch from 'canvas-sketch';
import p5 from 'p5'

const preload = p5 => {
	// add 'preload' contents here
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
	canvasSketch(({p5}) => {
		//put the 'setup' function contents here

		accelData.start();
		return ({
			p5,
			time,
			width,
			height
		}) => {

			const accelPoint = accelData.values;
			if (!accelPoint) return;
			const scaleFactor = 30;
			const scaleFactorShade = 20;
			const scaledAccelPoint = {
				x: accelPoint.x * scaleFactor,
				y: accelPoint.y * scaleFactor,
				z: accelPoint.z * scaleFactor,
			};

			// put the 'draw' contents here
			p5.background(0);
			p5.fill(accelPoint.z * scaleFactorShade);
			p5.noStroke();
			p5.rect(Math.abs(scaledAccelPoint.x), Math.abs(scaledAccelPoint.y), Math.abs(scaledAccelPoint.x), Math.abs(scaledAccelPoint.y))
		};
	}, settings);
}
