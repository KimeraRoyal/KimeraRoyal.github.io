function onLoad()
{
  var navbarButtons = document.getElementsByClassName("navbar_button");
  for(var i = 0; i < navbarButtons.length; i++)
  {
    navbarButtons[i].onclick = onClickHeader;

    var destination = navbarButtons[i].getAttribute("data-destination");
    console.log(window.location.hostname);
    console.log(window.location.pathname);
  }
}

function onClickHeader(event)
{
  var destination = event.target.getAttribute("data-destination");
}

window.onload = onLoad;
