function onLoad()
{
  var navbarButtons = document.getElementsByClassName("navbar_button");
  for(var i = 0; i < navbarButtons.length; i++)
  {
    navbarButtons[i].onclick = onClickHeader;

    var destination = navbarButtons[i].getAttribute("data-destination");
    if(destination == window.location.pathname)
    {
      navbarButtons[i].className += "active-navbar_button";
    }
  }
}

function onClickHeader(event)
{
  var destination = event.target.getAttribute("data-destination");
  location.assign(location.hostname + destination);
}

window.onload = onLoad;
