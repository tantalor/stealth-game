StealthGame = function(canvas) {
  this.canvas_ = canvas;
  
  var clientWidth = document.documentElement.clientWidth;
  var clientHeight = document.documentElement.clientHeight;
  
  var maxWidth = 1024;
  var maxHeight = maxWidth * 3 / 4;
  
  this.width_ = this.canvas_.width = Math.min(clientWidth, maxWidth);
  this.height_ = this.canvas_.height = Math.min(clientHeight, maxHeight);
  
  this.canvas_.style.marginTop = (clientHeight - this.height_) / 2 + 'px';
  
  this.context_ = this.canvas_.getContext('2d');
  
  startFrames(this);
};


StealthGame.prototype.drawFrame = function(t) {
  this.context_.clearRect(0, 0, this.width_, this.height_);
  
  // Model coordinates
  var x = Math.sin(t / 1000);
  var y = Math.cos(t / 1000);
  
  // Screen coordinates.
  var cx = this.width_ / 2;
  var cy = this.height_ / 2;
  var r = Math.min(cx, cy);
  var dx = x * r, dy = -y * r;
  
  this.context_.strokeStyle = 'black';
  this.context_.lineWidth = 3;
  this.context_.beginPath();
  this.context_.moveTo(cx - dx, cy - dy);
  this.context_.lineTo(cx + dx, cy + dy);
  this.context_.stroke();
};


function startFrames(obj) {
  var runFrame = function(t) {
    obj.drawFrame(t);
    window.requestAnimationFrame(runFrame);
  };
  runFrame();
}

if (this.wtf) {
  StealthGame = wtf.trace.instrumentType(StealthGame, 'StealthGame', {
    drawFrame: 'drawFrame'
  });
}
