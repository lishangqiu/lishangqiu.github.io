var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

function assignToDiv(){ // this kind of function you are looking for
  dataUrl = canvas.toDataURL();
  document.getElementById('main-body').style.background='url('+dataUrl+')'
  document.getElementById("main-body").style.backgroundRepeat = 'no-repeat';

  canvas.style.display = 'none';
  canvas.height = document.getElementById('main-body').offsetHeight;
  canvas.width = document.getElementById('main-body').offsetWidth;
}


document.getElementById('main-body').setAttribute("style",`height:${$(document).height()-90}px`);
assignToDiv();
var nodesjs = new NodesJs({

    // container ID
    id: 'nodes',

    // width
    width: canvas.width,

    // height
    height: canvas.height,

    // background transition options
    backgroundFrom: [10, 25, 100],
    backgroundTo: [25, 50, 150],
    backgroundDuration: 4000,

    // the number of particles
    number: 100,

    // animation speed
    speed: 20,
}, assignToDiv);