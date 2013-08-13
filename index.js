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
  
  this.boundDrawFrame_ = this.drawFrame.bind(this);
  window.requestAnimationFrame(this.boundDrawFrame_);
  
  this.t0_ = new Date().getTime();
  var fps = 60;
  this.interval_ = setInterval(this.updateState.bind(this), 1000 / fps);
};


StealthGame.prototype.updateState = function() {
  var t1 = new Date().getTime();
  var t = t1 - this.t0_;
  var x = Math.sin(t / 1000);
  var y = Math.cos(t / 1000);
  this.agent_.moveTo(x, y);
};


StealthGame.prototype.drawFrame = function() {
  this.context_.clearRect(0, 0, this.width_, this.height_);

  this.context_.save();
  this.context_.translate(this.width_ / 2, this.height_ / 2);
  this.context_.scale(this.scale_, -this.scale_);
  this.agent_.drawFrame(this.context_);
  this.context_.restore();
  
  window.requestAnimationFrame(this.boundDrawFrame_);
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


if (this.wtf) {
  StealthGame = wtf.trace.instrumentType(StealthGame, 'StealthGame', {
    drawFrame: 'drawFrame',
    updateState: 'updateState'
  });
}
