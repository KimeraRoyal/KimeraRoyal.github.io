var body;

var bgCanvas;
var bgContext;
var optimalHeight = 722;

/* Helper Functions */

function lerp(a, b, amount)
{
  return a + (b - a) * amount;
}

/* BG Scroll */
var bgImage;
var bgScrollX = 0;
var bgScrollY = 0;

var displayBgScrollX = 0;
var displayBgScrollY = 0;

var bgScrollProperties =
{
  bgScrollXSpeed: -0.3,
  bgScrollYSpeed: 1.2,

  mouseMoveOffset: 3,
  scrollOffset: 60
}

function initBgScroll()
{
  bgImage = document.getElementById("background-image");
  var bgScrollX = 0;
  var bgScrollY = 0;
}

function updateBgScroll()
{
  var xScrollAmount = deltaTime;

  bgScrollX += bgScrollProperties.bgScrollXSpeed * deltaTime;
  bgScrollY += bgScrollProperties.bgScrollYSpeed * deltaTime;

  var trueDisplayScrollX = bgScrollX - (mouseProportionX * bgScrollProperties.mouseMoveOffset);
  var trueDisplayScrollY = bgScrollY + (mouseProportionY * bgScrollProperties.mouseMoveOffset) - (scrollProportion * bgScrollProperties.scrollOffset);

  displayBgScrollX = lerp(displayBgScrollX, trueDisplayScrollX, 0.1);
  displayBgScrollY = lerp(displayBgScrollY, trueDisplayScrollY, 0.1);

  bgImage.style.backgroundPosition = ("right " + displayBgScrollX + "% top " + displayBgScrollY + "%");
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
  minParticleSize: 2, maxParticleSize: 4,

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

    this.particleSize = (Math.random() * (bgParticleProperties.maxParticleSize - bgParticleProperties.minParticleSize)) + bgParticleProperties.minParticleSize;

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
  bgContext.fillRect(this.displayX, this.displayY, this.particleSize, this.particleSize);
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

/* General Body */

var bodyBlurred = false;

function changeBlur(blur)
{
  if(bodyBlurred != blur)
  {
    if(blur)
    {
      document.getElementById("body").className += " blurred-body";
    }
    else
    {
      document.getElementById("body").className -= " blurred-body";
    }
    bodyBlurred = blur;
  }
}

/* Art Page */
var columns = [];

var maxArtColumns = 4;
var artElements = [];

var artPopupShown = false;
var popupValueChangedThisFrame = false;

function zoomSelected()
{
  var artZoom = document.getElementById("art-zoom");
  for(i = 0; i < columns.length; i++)
  {
    var zoomLevel = parseInt(artZoom.value);
    columns[i].style.flex = (100 / zoomLevel) + "%";
  }
}

function onClickArt(event)
{
  if(!artPopupShown && !popupValueChangedThisFrame)
  {
    var popup = document.getElementById("popup");
    popup.className = "popup-visible";

    var art = artworkJSON.objects[event.target.getAttribute("data-id")];

    var popupHeader = document.getElementById("popup-header");
    popupHeader.innerHTML = art.name;

    var popupImage = document.getElementById("popup-image");
    popupImage.setAttribute("src", art.url);
    popupImage.setAttribute("alt", art.name);

    artPopupShown = true;
    popupValueChangedThisFrame = true;

    changeBlur(true);
  }
}

function onClickDocument(event)
{
  if(artPopupShown && !popupValueChangedThisFrame)
  {
    var popup = document.getElementById("popup");
    popup.className = "popup-hidden";

    artPopupShown = false;
    popupValueChangedThisFrame = true;

    changeBlur(false);
  }
}

function addArt(art)
{
  var artElement = document.createElement("img");
  artElement.setAttribute("src", art.url);
  artElement.setAttribute("alt", art.name);
  artElement.setAttribute("style", "width:100%");
  artElement.setAttribute("data-id", art.id);

  artElement.onclick = onClickArt;

  columns[art.id % maxArtColumns].appendChild(artElement);
  artElements[art.id] = artElement;
}

function loadArt()
{
  var artGrid = document.getElementById("art-grid");
  for(var i = 0; i < maxColumns; i++)
  {
    var column = document.createElement("div");
    column.className = "art-grid-column";
    artGrid.appendChild(column);
    columns[i] = column;
  }

    for(var i = 0; i < artworkJSON.objects.length; i++)
    {
      addArt(artworkJSON.objects[i]);
    }
  }
}

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
  if(deltaTime > 1)
  {
    deltaTime = 1;
  }

  lastTime = currentTime;
}

/* Canvas */

function loadCanvas()
{
  bgContext.fillStyle = "rgba(0, 0, 0, 0)";
  bgContext.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  initBgScroll();

  updateCanvas();
}

function updateCanvas()
{
  bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  popupValueChangedThisFrame = false;

  calculateDeltaTime();

  updateBgScroll();

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

  if(document.getElementById("art-grid") != null)
  {
    document.onclick = onClickDocument;
    loadArt();
  }

  bgCanvas = document.getElementById("background-particles");

  setCanvasSize();

  bgContext = bgCanvas.getContext("2d");

  loadCanvas();
  initializeDeltaTime();
}

window.onload = onLoad;
window.onresize = setCanvasSize;
