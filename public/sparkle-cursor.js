// public/sparkle-cursor.js
var colour = "#FFFFFF";
var sparkles = 40;

var x = ox = 400;
var y = oy = 300;
var swide = 800;
var shigh = 600;
var sleft = sdown = 0;
var tiny = new Array();
var star = new Array();
var starv = new Array();
var starx = new Array();
var stary = new Array();
var tinyx = new Array();
var tinyy = new Array();
var tinyv = new Array();

window.addEventListener('load', function () {
  if (!document.getElementById) return;

  for (var i = 0; i < sparkles; i++) {
    var rats = createDiv(3, 3);
    rats.style.visibility = "hidden";
    document.body.appendChild(tiny[i] = rats);
    starv[i] = 0;
    tinyv[i] = 0;

    rats = createDiv(5, 5);
    rats.style.backgroundColor = "transparent";
    rats.style.visibility = "hidden";

    var rlef = createDiv(1, 5);
    var rdow = createDiv(5, 1);
    rats.appendChild(rlef);
    rats.appendChild(rdow);
    rlef.style.top = "2px";
    rlef.style.left = "0px";
    rdow.style.top = "0px";
    rdow.style.left = "2px";

    document.body.appendChild(star[i] = rats);
  }

  set_width();
  sparkle();
});

function sparkle() {
  var c;
  if (x != ox || y != oy) {
    ox = x;
    oy = y;
    for (c = 0; c < sparkles; c++) if (!starv[c]) {
      star[c].style.left = (starx[c] = x) + "px";
      star[c].style.top = (stary[c] = y) + "px";
      star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
      star[c].style.visibility = "visible";
      starv[c] = 50;
      break;
    }
  }
  for (c = 0; c < sparkles; c++) {
    if (starv[c]) update_star(c);
    if (tinyv[c]) update_tiny(c);
  }
  setTimeout(sparkle, 40);
}

function update_star(i) {
  if (--starv[i] == 25) star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
  if (starv[i]) {
    stary[i] += 1 + Math.random() * 3;
    if (stary[i] < shigh + sdown) {
      star[i].style.top = stary[i] + "px";
      starx[i] += (i % 5 - 2) / 5;
      star[i].style.left = starx[i] + "px";
    } else {
      star[i].style.visibility = "hidden";
      starv[i] = 0;
    }
  } else {
    tinyv[i] = 50;
    tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
    tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
    tiny[i].style.width = "2px";
    tiny[i].style.height = "2px";
    star[i].style.visibility = "hidden";
    tiny[i].style.visibility = "visible";
  }
}

function update_tiny(i) {
  if (--tinyv[i] == 25) {
    tiny[i].style.width = "1px";
    tiny[i].style.height = "1px";
  }
  if (tinyv[i]) {
    tinyy[i] += 1 + Math.random() * 3;
    if (tinyy[i] < shigh + sdown) {
      tiny[i].style.top = tinyy[i] + "px";
      tinyx[i] += (i % 5 - 2) / 5;
      tiny[i].style.left = tinyx[i] + "px";
    } else {
      tiny[i].style.visibility = "hidden";
      tinyv[i] = 0;
    }
  } else {
    tiny[i].style.visibility = "hidden";
  }
}

document.addEventListener('mousemove', function (e) {
  set_scroll();
  y = e.pageY || (e.clientY + sdown);
  x = e.pageX || (e.clientX + sleft);
});

function set_scroll() {
  sdown = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  sleft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}

window.addEventListener('resize', set_width);

function set_width() {
  swide = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  shigh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function createDiv(height, width) {
  var div = document.createElement("div");
  div.style.position = "absolute";
  div.style.height = height + "px";
  div.style.width = width + "px";
  div.style.overflow = "hidden";
  div.style.backgroundColor = colour;
  return (div);
}
