import { v4 } from 'uuid';
export const TOOL_CLEAR_RECT = 'clearreact';

export default (context ,socket) => {
  let clearreact = null;
  let imageData = null;

  const onMouseDown = (x, y, color, size, fill) => {
    clearreact = {
      id: v4(),
      tool: TOOL_CLEAR_RECT,
      color,
      size,
      fill,
      start: { x, y },
      end: null
    };
    imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    return [clearreact];
  };

  const drawclearreact = (item, mouseX, mouseY) => {
    const startX = mouseX < item.start.x ? mouseX : item.start.x;
    const startY = mouseY < item.start.y ? mouseY : item.start.y;
    const widthX = Math.abs(item.start.x - mouseX);
    const widthY = Math.abs(item.start.y - mouseY);

    context.beginPath();
    context.lineWidth = item.size;
    context.fillStyle = 'rgba(153, 187, 255,0.5)';
    context.fillRect(startX, startY, widthX, widthY);
    context.stroke();
  };

  const clear = (item, mouseX, mouseY) => {
    const startX = mouseX < item.start.x ? mouseX : item.start.x;
    const startY = mouseY < item.start.y ? mouseY : item.start.y;
    const widthX = Math.abs(item.start.x - mouseX);
    const widthY = Math.abs(item.start.y - mouseY);
    context.clearRect(startX-1,startY-1,widthX+1,widthY+2);
  }

  const onMouseMove = (x, y) => {
    if (!clearreact) return;
    context.putImageData(imageData, 0, 0);
    context.save();
    drawclearreact(clearreact, x, y);
    context.restore();
  };

  const onMouseUp = (x, y) => {
    if (!clearreact) return;
    onMouseMove(x, y);
    const item = clearreact;
    imageData = null;
    clearreact = null;
    item.end = { x, y };
    clear(item,x,y);
    return [item];
  };

  const draw = item => {
    drawclearreact(item, item.end.x, item.end.y);
  };
    
  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    draw,
    clear
  };
};
