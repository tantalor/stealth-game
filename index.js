function StealthGame(canvas) {
  this.canvas_ = canvas;
  
  this.width_ = this.canvas_.width = 1024;
  this.height_ = this.canvas_.height = this.width_ * 3 / 4;
  
  this.context_ = this.canvas_.getContext('2d');
  this.context_.strokeStyle = 'black';
  this.context_.lineWidth = 1;
  this.context_.strokeRect(0, 0, this.width_, this.height_);
  
  startFrames(this);
}

StealthGame.prototype.drawFrame = function(t) {
  this.context_.clearRect(1, 1, this.width_ - 2, this.height_ - 2);
  
  // Model coordinates
  var x = Math.sin(t / 1000);
  var y = Math.cos(t / 1000);
  
  // Screen coordinates.
  var cx = this.width_ / 2;
  var cy = this.height_ / 2;
  var r = cx / 3;
  var dx = x * r, dy = -y * r;
  
  this.context_.lineWidth = 3;
  this.context_.beginPath();
  this.context_.moveTo(cx, cy);
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
