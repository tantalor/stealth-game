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
  
  this.scale_ = Math.min(this.width_ / 2, this.height_ / 2);
  
  this.agent_ = new StealthGame.Agent(0, 0);
  
  startFrames(this);
};


StealthGame.prototype.drawFrame = function(t) {
  this.context_.clearRect(0, 0, this.width_, this.height_);

  // Model coordinates
  var x = Math.sin(t / 2000);
  var y = Math.cos(t / 2000);

  this.context_.save();
  this.context_.translate(this.width_ / 2, this.height_ / 2);
  this.context_.scale(this.scale_, this.scale_);
  this.agent_.moveTo(x, -y);
  this.agent_.drawFrame(this.context_);
  this.context_.restore();
};


StealthGame.Agent = function(x, y) {
  this.x = x;
  this.y = y;
  this.r = .05;
};


StealthGame.Agent.prototype.moveTo = function (x, y) {
  this.x = x;
  this.y = y;
}

StealthGame.Agent.prototype.drawFrame = function(context) {
  context.beginPath();
  context.arc(this.x, this.y, this.r, 0, 6.284);
  context.fillStyle = 'blue';
  context.fill();
  context.lineWidth = this.r / 8;
  context.strokeStyle = 'black';
  context.stroke();
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
