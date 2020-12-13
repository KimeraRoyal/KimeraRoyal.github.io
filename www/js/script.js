var body;

var bgCanvas;
var bgContext;
var optimalHeight = 722;

/* Helper Functions */

function lerp(a, b, amount)
{
  return a + (b - a) * amount;
}

/* BG Particles */

var bgParticles = {};
var bgParticleIndex = 0;

var bgParticleSpawnTimer = 0;
var currentBgParticles = 0;

var bgParticleProperties =
{
  maxParticles: 200,
  spawnInterval: 3,
  spawnAmount: 30,

  minXSpeed: 4, maxXSpeed: 8,
  minYSpeed: 6, maxYSpeed: 10,
  particleSize: 3,

  minTotalLife: 150,
  maxTotalLife: 700,
  lifeIncrementSlow: 1,
  lifeIncrementFast: 10,

  mouseMoveOffset: 50,
  scrollOffset: 500
};

function BGParticle()
{
  if(currentBgParticles < bgParticleProperties.maxParticles)
  {
    this.x = (Math.random() * (bgCanvas.width + bgCanvas.height)) - bgCanvas.height;
    this.y = 0;

    this.xSpeed = (Math.random() * (bgParticleProperties.maxXSpeed - bgParticleProperties.minXSpeed)) + bgParticleProperties.minXSpeed;
    this.ySpeed = (Math.random() * (bgParticleProperties.maxYSpeed - bgParticleProperties.minYSpeed)) + bgParticleProperties.minYSpeed;

    this.startingMouseProportionX = mouseProportionX;
    this.startingMouseProportionY = mouseProportionY;
    this.startingScrollOffset = currentScrollOffset;

    this.displayX = this.x;
    this.displayY = this.y;

    bgParticleIndex++;
    currentBgParticles++;

    bgParticles[bgParticleIndex] = this;
    this.id = bgParticleIndex;

    this.currentLife = 0;
    this.totalLife = (Math.random() * (bgParticleProperties.maxTotalLife - bgParticleProperties.minTotalLife)) + bgParticleProperties.minTotalLife;
  }
}

BGParticle.prototype.update = function()
{
  this.x += this.xSpeed * deltaTime;
  this.y += this.ySpeed * deltaTime;

  if(this.x > bgCanvas.width || this.y > bgCanvas.height)
  {
    this.currentLife += bgParticleProperties.lifeIncrementFast;
  }
  else
  {
    this.currentLife += bgParticleProperties.lifeIncrementSlow;
  }

  if(this.currentLife >= this.totalLife)
  {
    currentBgParticles--;
    delete bgParticles[this.id];
  }
}

BGParticle.prototype.draw = function()
{

  var lifetimePercentage = this.currentLife / this.totalLife;

  bgContext.fillStyle = "rgba(255, 255, 255, " +  (1 - lifetimePercentage) + ")";

  var displayX = this.x + ((mouseProportionX - this.startingMouseProportionX) * bgParticleProperties.mouseMoveOffset);
  var displayY = this.y + ((mouseProportionY - this.startingMouseProportionY) * bgParticleProperties.mouseMoveOffset) - (currentScrollOffset - this.startingScrollOffset);

  this.displayX = lerp(this.displayX, displayX, 0.1);
  this.displayY = lerp(this.displayY, displayY, 0.1);
  bgContext.fillRect(this.displayX, this.displayY, bgParticleProperties.particleSize, bgParticleProperties.particleSize);
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

/* Delta Time */

var startTime = 0;
var lastTime = 0;

var totalTime = 0;
var deltaTime = 1;

function initializeDeltaTime()
{
  startTime = Date.now();
}

function calculateDeltaTime()
{
  var currentTime = Date.now();
  totalTime = currentTime - startTime;

  deltaTime = (currentTime - lastTime) / 60;

  lastTime = currentTime;
}

/* Canvas */

function loadCanvas()
{
  bgContext.fillStyle = "rgba(0, 0, 0, 0)";
  bgContext.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  updateCanvas();
}

function updateCanvas()
{
  bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  calculateDeltaTime();

  updateBGParticles();
  for(var i in bgParticles)
  {
    bgParticles[i].draw();
  }

  window.requestAnimationFrame(updateCanvas);
}

function setCanvasSize()
{
  bgCanvas.width = window.innerWidth / (window.innerHeight / optimalHeight);
  bgCanvas.height = optimalHeight;
}

/* Window Events */

var mouseProportionX = 0;
var mouseProportionY = 0;

var scrollProportion = 0;
var currentScrollOffset = 0;

function onMouseMove(event)
{
  mouseProportionX = event.pageX / window.innerWidth;
  mouseProportionY = event.pageY / window.innerHeight;
}

function scrollBody(event)
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
  currentScrollOffset = bgParticleProperties.scrollOffset * scrollProportion;
}

function onLoad()
{
  document.onmousemove = onMouseMove;

  body = document.getElementById("body");
  body.onscroll = scrollBody;

  bgCanvas = document.getElementById("background-particles");

  setCanvasSize();

  bgContext = bgCanvas.getContext("2d");

  loadCanvas();
  initializeDeltaTime();
}

window.onload = onLoad;
window.onresize = setCanvasSize;
