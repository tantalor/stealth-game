StealthGame = function(canvas) {
  this.screen_ = new StealthGame.Screen(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight);
      
  this.camera_ = new StealthGame.Camera(this.screen_);
  
  this.canvas_ = canvas;
  this.canvas_.width = this.screen_.width;
  this.canvas_.height = this.screen_.height;
  this.canvas_.style.left = this.screen_.left + 'px';
  this.canvas_.style.top = this.screen_.top + 'px';
  
  this.context_ = this.canvas_.getContext('2d');
  
  this.agent_ = new StealthGame.Agent(0, 0);
  
  this.boundDrawFrame_ = this.drawFrame.bind(this);
  window.requestAnimationFrame(this.boundDrawFrame_);
  
  this.t0_ = new Date().getTime();
  var fps = 60;
  this.interval_ = setInterval(this.updateState.bind(this), 1000 / fps);
  
  this.eventHandler_ = new StealthGame.EventHandler(
      this.agent_, this.camera_);
  
  var events = ['mousedown', 'mouseup', 'mousemove', 'touchmove', 'touchstart'];
  for (var i = 0; i < events.length; i++) {
    this.canvas_.addEventListener(events[i],
        this.eventHandler_.getHandler(events[i]));
  }
};

StealthGame.Camera = function(screen) {
  var widthToHeight = screen.width / screen.height;
  var widthScale = widthToHeight < 0 ? 1 : widthToHeight;
  var heightScale = widthToHeight > 0 ? 1 : 1 / widthToHeight;
  
  // World coordinates.
  this.width_ = 2 * widthScale;
  this.height_ = 2 * heightScale;
  this.x_ = -this.width_ / 2;
  this.y_ = -this.height_ / 2;
  
  this.screen_ = screen;
}

StealthGame.Camera.prototype.screenToWorldX = function(x) {
  return (x / this.screen_.width) * this.width_ + this.x_;
};

StealthGame.Camera.prototype.screenToWorldY = function(y) {
  return (1 - y / this.screen_.height) * this.height_ + this.y_;
};

StealthGame.Camera.prototype.clientToWorldX = function(x) {
  return this.screenToWorldX(this.screen_.clientToScreenX(x));
};

StealthGame.Camera.prototype.clientToWorldY = function(y) {
  return this.screenToWorldY(this.screen_.clientToScreenY(y));
};

StealthGame.Camera.prototype.transform = function(context) {
  var scaleX = this.screen_.width / this.width_;
  var scaleY = this.screen_.height / this.height_;
  context.translate(0, this.screen_.height);
  context.scale(scaleX, -scaleY);
  context.translate(-this.x_, -this.y_);
};

StealthGame.Screen = function(clientWidth, clientHeight) {
  var maxWidth = 1024;
  var maxHeight = maxWidth * 3 / 4;
  
  // Client coordinates.
  this.width = Math.min(clientWidth, maxWidth);
  this.height = Math.min(clientHeight, maxHeight);
  this.top = (clientHeight - this.height) / 2;
  this.left = (clientWidth - this.width) / 2;
};

StealthGame.Screen.prototype.clientToScreenX = function(x) {
  return x - this.left;
};

StealthGame.Screen.prototype.clientToScreenY = function(y) {
  return y - this.top;
};

StealthGame.prototype.updateState = function() {};


StealthGame.prototype.drawFrame = function() {
  this.context_.clearRect(0, 0, this.screen_.width, this.screen_.height);

  this.context_.save();
  this.camera_.transform(this.context_);
  this.agent_.draw(this.context_);
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

StealthGame.Agent.prototype.draw = function(context) {
  context.beginPath();
  context.arc(this.x, this.y, this.r, 0, 6.284);
  context.fillStyle = 'blue';
  context.fill();
  context.lineWidth = this.r / 8;
  context.strokeStyle = 'black';
  context.stroke();
};

StealthGame.EventHandler = function(agent, camera) {
  this.agent_ = agent;
  this.camera_ = camera;
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
      this.camera_.clientToWorldX(evt.clientX),
      this.camera_.clientToWorldY(evt.clientY));
};

StealthGame.EventHandler.prototype.ontouchmove = function(evt) {
  if (this.isAndroid_) evt.preventDefault();
  
  var touch = evt.touches[evt.touches.length - 1];
  this.agent_.moveTo(
      this.camera_.screenToWorldX(
        this.screen_.clientToScreenX(touch.screenX)),
      this.camera_.screenToWorldY(
        this.screen_.clientToScreenY(touch.screenY)));
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
