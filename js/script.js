var body;
var scrollProportion = 0;

function onLoad()
{
  body = document.getElementById("body");
  body.onscroll = scrollBody;
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

window.onload = onLoad;
