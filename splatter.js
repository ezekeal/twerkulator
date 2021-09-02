/**
 * graph the movement of each axis
 */
import canvasSketch from 'canvas-sketch';

const canvasSettings = {
    animate: true,
    dimensions: [1080, 1350],
    fps: 10,
};

export default function splatter(accelData) {
    canvasSketch(() => {
        return ({ context, width, height, frame }) => {
            const accelPoint = accelData.next();
            if (!accelPoint) return;
            if (frame === 0) {
                // clear canvas
                context.fillStyle = 'black';
                context.fillRect(0, 0, width, height);
            }

            const PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
            const PROJECTION_CENTER_X = width / 2; // x center of the canvas
            const PROJECTION_CENTER_Y = height / 2; // y center of the canvas
            const projectPoint = ({ x, y, z }) => {
                const scaleProjected = PERSPECTIVE / (PERSPECTIVE + z);
                return {
                    x: x * scaleProjected + PROJECTION_CENTER_X,
                    y: y * scaleProjected + PROJECTION_CENTER_Y,
                    scale: scaleProjected,
                };
            };

            const scaleFactor = 50;
            const scaledAccelPoint = {
                x: accelPoint.x * scaleFactor,
                y: accelPoint.y * scaleFactor,
                z: accelPoint.z * scaleFactor,
            };
            const line = {
                origin: projectPoint({ x: 0, y: 0, z: 0 }),
                end: projectPoint(scaledAccelPoint),
            };

            const hueValue = Math.round((accelPoint.z + 17) * 9);
            context.strokeStyle = `hsl(${hueValue}, 100%, 50%)`;
            context.beginPath();
            context.moveTo(line.origin.x, line.origin.y);
            context.lineTo(line.end.x, line.end.y);
            context.stroke();
        };
    }, canvasSettings);
}
