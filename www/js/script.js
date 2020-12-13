var body;

var bgCanvas;
var bgContext;
var optimalHeight = 722;

var scrollProportion = 0;

var bgParticles = {};
var bgParticleIndex = 0;

var bgParticleSpawnTimer = 0;
var currentBgParticles = 0;

var bgParticleProperties =
{
  prewarm: 200,

  maxParticles: 150,
  spawnInterval: 2,
  spawnAmount: 4,

  minXSpeed: 2, maxXSpeed: 3,
  minYSpeed: 2, maxYSpeed: 5,
  particleSize: 3,

  maxLife: 200
};

function BGParticle()
{
  if(currentBgParticles < bgParticleProperties.maxParticles)
  {
    this.x = (Math.random() * (bgCanvas.width + bgCanvas.height)) - bgCanvas.height;
    this.y = 0;

    this.xSpeed = (Math.random() * (bgParticleProperties.maxXSpeed - bgParticleProperties.minXSpeed)) + bgParticleProperties.minXSpeed;
    this.ySpeed = (Math.random() * (bgParticleProperties.maxYSpeed - bgParticleProperties.minYSpeed)) + bgParticleProperties.minYSpeed;

    bgParticleIndex++;
    currentBgParticles++;

    bgParticles[bgParticleIndex] = this;
    this.id = bgParticleIndex;

    this.currentLife = 0;
  }
}

BGParticle.prototype.update = function()
{
  this.x += this.xSpeed;
  this.y += this.ySpeed;

  this.currentLife++;
  if(this.x > bgCanvas.width || this.y > bgCanvas.height || this.currentLife >= bgParticleProperties.maxLife)
  {
    currentBgParticles--;
    delete bgParticles[this.id];
  }
}

BGParticle.prototype.draw = function()
{
  var lifetimePercentage = this.currentLife / bgParticleProperties.maxLife;

  bgContext.fillStyle = "rgba(255, 255, 255, " +  (1 - lifetimePercentage) + ")";
  bgContext.fillRect(this.x, this.y, bgParticleProperties.particleSize, bgParticleProperties.particleSize);
}

function onLoad()
{
  body = document.getElementById("body");
  body.onscroll = scrollBody;

  bgCanvas = document.getElementById("background-particles");

  setCanvasSize();

  bgContext = bgCanvas.getContext("2d");

  loadCanvas();
}

function scrollBody()
{
  var maxScroll = body.scrollHeight - body.clientHeight;
  if(maxScroll > 0)
  {
    scrollProportion = body.scrollTop / maxScroll;
  }
  else
  {
    scrollProportion = 0;
  }

  scrollProportion = Math.min(Math.max(scrollProportion, 0), 1);

  console.log(scrollProportion);
}

function loadCanvas()
{
  bgContext.fillStyle = "rgba(0, 0, 0, 0)";
  bgContext.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  for(var i = 0; i < bgParticleProperties.prewarm; i++)
  {
    updateBGParticles()
  }

  updateCanvas();
}

function updateCanvas()
{
  bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  updateBGParticles();

  for(var i in bgParticles)
  {
    bgParticles[i].draw();
  }

  window.requestAnimationFrame(updateCanvas);
}

function updateBGParticles()
{
  bgParticleSpawnTimer++;
  if(bgParticleSpawnTimer % bgParticleProperties.spawnInterval == 0)
  {
    for(var i = 0; i < bgParticleProperties.spawnAmount; i++)
    {
      new BGParticle();
    }
  }

  for(var i in bgParticles)
  {
    bgParticles[i].update();
  }
}

function setCanvasSize()
{
  bgCanvas.width = window.innerWidth / (window.innerHeight / optimalHeight);
  bgCanvas.height = optimalHeight;
}

window.onload = onLoad;
window.onresize = setCanvasSize;
