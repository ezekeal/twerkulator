/**
 * graph the movement of each axis
 */

import canvasSketch from 'canvas-sketch';
import { loadData } from './accelerometer';

(async function () {
    draw(await loadData('accel.csv'));
})();

const canvasSettings = {
    animate: true,
    duration: 3,
    dimensions: [800, 600],
    fps: 10,
};

function draw(accelData) {
    let prevPos;
    canvasSketch(() => {
        return ({ context, width, height }) => {
            const accelPoint = accelData.next();
            if (!accelPoint) return;
            // Fill the canvas
            context.fillStyle = 'black';
            context.fillRect(0, 0, width, height);

            const squareSize = width / 20;
            const centerX = width / 2 - squareSize;
            const rowSpacing = height / 4;
            const scaling = 0.1;
            if (!prevPos)
                prevPos = {
                    x: { x: 0, y: rowSpacing * 1 - squareSize / 2 },
                    y: { x: 0, y: rowSpacing * 2 - squareSize / 2 },
                    z: { x: 0, y: rowSpacing * 3 - squareSize / 2 },
                };
            const currPos = {
                x: { ...prevPos.x, x: prevPos.x.x + accelPoint.x * scaling },
                y: { ...prevPos.y, x: prevPos.y.x + accelPoint.y * scaling },
                z: { ...prevPos.z, x: prevPos.z.x + accelPoint.z * scaling },
            };

            // draw x
            context.fillStyle = 'red';
            context.fillRect(currPos.x.x, currPos.x.y, squareSize, squareSize);

            // draw y
            context.fillStyle = 'green';
            context.fillRect(currPos.y.x, currPos.y.y, squareSize, squareSize);

            // draw z
            context.fillStyle = 'blue';
            context.fillRect(currPos.z.x, currPos.z.y, squareSize, squareSize);

            prevPos = currPos;
        };
    }, canvasSettings);
}
