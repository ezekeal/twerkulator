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
    canvasSketch(() => {
        const accelPoint = accelData.next();
        if (!accelPoint) return;
        return ({ context, width, height }) => {
            // Fill the canvas
            context.fillStyle = 'black';
            context.fillRect(0, 0, width, height);

            const squareSize = width / 20;
            const centerX = width / 2 - squareSize;
            const rowSpacing = height / 4;
            const scaling = 10;
            const posX = {
                x: centerX + accelPoint.x * scaling,
                y: centerX + accelPoint.y * scaling,
                z: centerX + accelPoint.z * scaling,
            };
            const posY = {
                x: rowSpacing * 1 - squareSize / 2,
                y: rowSpacing * 2 - squareSize / 2,
                z: rowSpacing * 3 - squareSize / 2,
            };

            // draw x
            context.fillStyle = 'red';
            context.fillRect(posX.x, posY.x, squareSize, squareSize);

            // draw y
            context.fillStyle = 'green';
            context.fillRect(posX.y, posY.y, squareSize, squareSize);

            // draw z
            context.fillStyle = 'blue';
            context.fillRect(posX.z, posY.z, squareSize, squareSize);
        };
    }, canvasSettings);
}
