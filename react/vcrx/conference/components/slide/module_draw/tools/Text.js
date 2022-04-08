import { v4 } from 'uuid';
export const TOOL_TEXT = 'text';

export default (context,socket) => {
  let text = null;
  let imageData = null;

  const onMouseDown = (x, y, color, size, fill) => {
    text = {
      id: v4(),
      tool: TOOL_TEXT,
      color,
      size,
      fill,
      start: { x, y },
      end: null
    };
    imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    return [text];
  };

  const drawText = (item, mouseX, mouseY) => {
    const startX = mouseX < item.start.x ? mouseX : item.start.x;
    const startY = mouseY < item.start.y ? mouseY : item.start.y;
    const widthX = Math.abs(item.start.x - mouseX);
    const widthY = Math.abs(item.start.y - mouseY);

    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.fillStyle = item.fill;
    context.rect(startX, startY, widthX, widthY);
    context.stroke();
    if (item.fill) context.fill();
  };

  const onMouseMove = (x, y) => {
    if (!text) return;
    context.putImageData(imageData, 0, 0);
    context.save();
    drawText(text, x, y);
    context.restore();
  };

  const onMouseUp = (x, y) => {
    if (!text) return;
    onMouseMove(x, y);
    const item = text;
    imageData = null;
    text = null;
    item.end = { x, y };
    return [item];
  };

  const draw = item => drawText(item, item.end.x, item.end.y);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    draw,
  };
};
