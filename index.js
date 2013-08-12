function StealthGame(canvas) {
  this.canvas_ = canvas;
  
  this.width_ = this.canvas_.width = 1024;
  this.height_ = this.canvas_.height = this.width_ * 3 / 4;
  
  this.context_ = this.canvas_.getContext('2d');
  this.context_.strokeStyle = 'black';
  this.context_.lineWidth = 1;
  this.context_.strokeRect(0, 0, this.width_, this.height_);
};
