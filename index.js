StealthGame = {};

StealthGame.Game = function(canvas) {
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
  
  this.world_ = [
    this.agent_,
    new StealthGame.Enemy([.5, .5, .5, -.5, .25, 0]),
    new StealthGame.Enemy([-.5, -.5, -.5, .5, -.25, 0])
  ];
  
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

StealthGame.Game.prototype.updateState = function() {
  var t = new Date().getTime();
  var dt = t - this.t0_;
  this.t0_ = t;
  for (var i = 0; i < this.world_.length; i++) {
    this.world_[i].update(dt);
  }
};


StealthGame.Game.prototype.drawFrame = function() {
  this.context_.clearRect(0, 0, this.screen_.width, this.screen_.height);

  this.context_.save();
  this.camera_.transform(this.context_);
  for (var i = 0; i < this.world_.length; i++) {
    this.world_[i].draw(this.context_);
  }
  this.context_.restore();
  
  window.requestAnimationFrame(this.boundDrawFrame_);
};


StealthGame.Util = {};

StealthGame.Util.drawAsCircle = function(context) {
  context.save();
  context.translate(this.x_, this.y_);
  context.scale(this.r_, this.r_);
  context.lineWidth = .125;
  context.strokeStyle = 'black';
  context.fillStyle = this.color_;
  this.drawFirst && this.drawFirst(context);
  context.beginPath();
  context.arc(0, 0, 1, 0, 6.284);
  context.fill();
  context.stroke();
  context.restore();
};

StealthGame.Util.followStep = function(dt) {
  var dx = this.x2_ - this.x_;
  var dy = this.y2_ - this.y_;
  var step = dt * this.speed_;
  var angle = Math.atan2(dy, dx);
  var stepx = Math.cos(angle) * step;
  var stepy = Math.sin(angle) * step;
  this.x_ += stepx;
  this.y_ += stepy;
  
  if (Math.abs(stepx) > Math.abs(dx) && Math.abs(stepy) > Math.abs(dy)) {
    return true;
  }
  
  return false;
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


StealthGame.Agent = function(x, y) {
  this.x_ = x;
  this.y_ = y;
  this.x2_ = x;
  this.y2_ = y;
  this.r_ = .05;
  this.speed_ = 0.001;
  this.color_ = 'blue';
};

StealthGame.Agent.prototype.moveTo = function (x, y) {
  this.x2_ = x;
  this.y2_ = y;
};

StealthGame.Agent.prototype.stop = function () {
  this.x2_ = this.x_;
  this.y2_ = this.y_;
};

StealthGame.Agent.prototype.update = function(dt) {
  if ((this.x2_ !== this.x_ || this.y2_ != this.y_) && this.followStep(dt)) {
    this.x_ = this.x2_;
    this.y_ = this.y2_;
  }
};

StealthGame.Agent.prototype.followStep = StealthGame.Util.followStep;

StealthGame.Agent.prototype.draw = StealthGame.Util.drawAsCircle;


StealthGame.Enemy = function(path) {
  this.path_ = path;
  this.x_ = path[0];
  this.y_ = path[1];
  this.x2_ = path[2];
  this.y2_ = path[3];
  this.r_ = .05;
  this.a_ = Math.atan2(this.y2_ - this.y_, this.x2_ - this.x_);
  this.a2_ = this.a_;
  this.speed_ = 0.0005;
  this.speeda_ = this.speed_ * 5;
  this.nextIndex_ = 1;
  this.color_ = 'red';
  this.state_ = StealthGame.Enemy.State.MOVING;
};

StealthGame.Enemy.State = {
  TURNING: 0,
  MOVING: 1,
};

StealthGame.Enemy.prototype.draw = StealthGame.Util.drawAsCircle;

StealthGame.Enemy.prototype.drawFirst = function(context) {
  context.rotate(this.a_);
  context.beginPath();
  context.moveTo(5, 1);
  context.lineTo(0, 0);
  context.lineTo(5, -1);
  context.globalAlpha = 0.25;
  context.fill();
  context.stroke();
  context.globalAlpha = 1;
};

StealthGame.Enemy.prototype.update = function(dt) {
  if (this.state_ == StealthGame.Enemy.State.TURNING) {
    var da = this.a2_ - this.a_;
    var stepa = (da > 0 ? 1 : -1) * dt * this.speeda_;
    this.a_ += stepa;
    if (Math.abs(stepa) > Math.abs(da)) {
      this.a_ = this.a2_;
      this.state_ = StealthGame.Enemy.State.MOVING;
    }    
  } else if (this.followStep(dt)) {
    this.nextIndex_ = (this.nextIndex_ + 1) % (this.path_.length / 2);
    this.x2_ = this.path_[this.nextIndex_ * 2];
    this.y2_ = this.path_[this.nextIndex_ * 2 + 1];
    
    // Don't turn more than 180 degrees.
    var a2 = Math.atan2(this.y2_ - this.y_, this.x2_ - this.x_);
    var da = (a2 - this.a_) % (2 * Math.PI);
    if (da > Math.PI) {
      da -= 2 * Math.PI;
    } else if (da < -Math.PI) {
      da += 2 * Math.PI;
    }
    this.a2_ = this.a_ + da;

    this.state_ = StealthGame.Enemy.State.TURNING;
  }
};

StealthGame.Enemy.prototype.followStep = StealthGame.Util.followStep;


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
  this.agent_.stop();
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
      this.camera_.clientToWorldX(touch.screenX),
      this.camera_.clientToWorldY(touch.screenY));
};

StealthGame.EventHandler.prototype.ontouchstart = function(evt) {
  this.ontouchmove(evt);
};


if (this.wtf) {
  StealthGame = wtf.trace.instrumentType(
    StealthGame,
    'StealthGame',
    { drawFrame: 'drawFrame',
      updateState: 'updateState'
    }
  );
  StealthGame.Camera = wtf.trace.instrumentType(
    StealthGame.Camera,
    'StealthGame.Camera',
    { transform: 'transform'
    }
  );
  StealthGame.Agent = wtf.trace.instrumentType(
    StealthGame.Agent,
    'StealthGame.Agent',
    { draw: 'draw',
      update: 'update'
    }
  );
  StealthGame.Enemy = wtf.trace.instrumentType(
    StealthGame.Enemy,
    'StealthGame.Enemy',
    { draw: 'draw',
      update: 'update'
    }
  );
}
