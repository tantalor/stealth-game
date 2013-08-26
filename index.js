StealthGame = function(canvas) {
  this.screen_ = new StealthGame.Screen(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight);
  
  this.canvas_ = canvas;
  this.canvas_.width = this.screen_.width;
  this.canvas_.height = this.screen_.height;
  this.canvas_.style.left = this.screen_.screenLeft + 'px';
  this.canvas_.style.top = this.screen_.screenTop + 'px';
  
  this.context_ = this.canvas_.getContext('2d');
  
  this.agent_ = new StealthGame.Agent(0, 0);
  
  this.boundDrawFrame_ = this.drawFrame.bind(this);
  window.requestAnimationFrame(this.boundDrawFrame_);
  
  this.t0_ = new Date().getTime();
  var fps = 60;
  this.interval_ = setInterval(this.updateState.bind(this), 1000 / fps);
  
  this.eventHandler_ = new StealthGame.EventHandler(
      this.agent_, this.screen_);
  
  var events = ['mousedown', 'mouseup', 'mousemove', 'touchmove', 'touchstart'];
  for (var i = 0; i < events.length; i++) {
    this.canvas_.addEventListener(events[i],
        this.eventHandler_.getHandler(events[i]));
  }
};

StealthGame.Screen = function(clientWidth, clientHeight) {
  var maxWidth = 1024;
  var maxHeight = maxWidth * 3 / 4;
  
  this.width = Math.min(clientWidth, maxWidth);
  this.height = Math.min(clientHeight, maxHeight);
  
  this.screenTop = (clientHeight - this.height) / 2;
  this.screenLeft = (clientWidth - this.width) / 2;
  
  this.top = -1;
  this.right = 1;
  this.bottom = 1;
  this.left = -1;
  
  this.offsetX = this.width / (this.right - this.left);
  this.offsetY = this.height / (this.bottom - this.top);
  
  this.scale = Math.min(this.offsetX, this.offsetY);
};

StealthGame.Screen.prototype.toMx = function(x) {
  return (x - this.offsetX) / this.scale;
};

StealthGame.Screen.prototype.toMy = function(y) {
  return (this.offsetY - y) / this.scale;
};

StealthGame.prototype.updateState = function() {};


StealthGame.prototype.drawFrame = function() {
  this.context_.clearRect(0, 0, this.screen_.width, this.screen_.height);

  this.context_.save();
  this.context_.translate(this.screen_.width / 2, this.screen_.height / 2);
  this.context_.scale(this.screen_.scale, -this.screen_.scale);
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

StealthGame.EventHandler = function(agent, screen) {
  this.agent_ = agent;
  this.screen_ = screen;
  this.mouseDown_ = false;
  this.isAndroid_ = navigator.userAgent.indexOf("Android") >= 0;
};

StealthGame.EventHandler.prototype.getHandler = function(name) {
  return this['on' + name].bind(this);
};

StealthGame.EventHandler.prototype.onmouseup = function(evt) {
  this.mouseDown_ = false;
};

StealthGame.EventHandler.prototype.onmousedown = function(evt) {
  this.mouseDown_ = true;
  this.onmousemove(evt);
};

StealthGame.EventHandler.prototype.onmousemove = function(evt) {
  if (!this.mouseDown_) return;
  this.agent_.moveTo(
      this.screen_.toMx(evt.offsetX),
      this.screen_.toMy(evt.offsetY));
};

StealthGame.EventHandler.prototype.ontouchmove = function(evt) {
  if (this.isAndroid_) evt.preventDefault();
  
  var touch = evt.touches[evt.touches.length - 1];
  this.agent_.moveTo(
      this.screen_.toMx(touch.screenX - this.screen_.screenLeft),
      this.screen_.toMy(touch.screenY - this.screen_.screenTop));
};

StealthGame.EventHandler.prototype.ontouchstart = function(evt) {
  this.ontouchmove(evt);
};


if (this.wtf) {
  StealthGame = wtf.trace.instrumentType(StealthGame, 'StealthGame', {
    drawFrame: 'drawFrame',
    updateState: 'updateState'
  });
}
