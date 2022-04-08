import { v4 } from 'uuid';
export const TOOL_TRIANGLE = 'triangle';

export default (context,socket) => {
  let triangle = null;
  let imageData = null;

  const onMouseDown = (x, y, color, size, fill) => {
    triangle = {
      id: v4(),
      tool: TOOL_TRIANGLE,
      color,
      size,
      fill,
      start: { x, y },
      end: null
    };
    imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    return [triangle];
  };

  const drawTriangle = (item, mouseX, mouseY) => {
    const startX = mouseX < item.start.x ? mouseX : item.start.x;
    const startY = mouseY < item.start.y ? mouseY : item.start.y;
    const widthX = Math.abs(item.start.x - mouseX);
    const widthY = Math.abs(item.start.y - mouseY);

    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.fillStyle = item.fill;
    context.lineTo(item.start.x, item.start.y);
    context.lineTo(item.start.x-(mouseX-item.start.x), mouseY);
    context.lineTo(mouseX, mouseY);
    context.lineTo(item.start.x, item.start.y);
    context.stroke();
    if (item.fill) context.fill();
  };

  const onMouseMove = (x, y) => {
    if (!triangle) return;
    context.putImageData(imageData, 0, 0);
    context.save();
    drawTriangle(triangle, x, y);
    context.restore();
  };

  const onMouseUp = (x, y) => {
    if (!triangle) return;
    onMouseMove(x, y);
    const item = triangle;
    imageData = null;
    triangle = null;
    item.end = { x, y };
    return [item];
  };

  const draw = item => drawTriangle(item, item.end.x, item.end.y);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    draw,
  };
};
