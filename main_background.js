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


/*(requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback, element) { window.setTimeout(callback, 1000 / 60); };


function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height));
    
    for (i=0; i<100; i++)
    {
       ctx.lineTo(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height));
                  
    }
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    ctx.stroke();

    setTimeout(function(){
        requestAnimationFrame(draw);
    }, (5));
    
}


console.log("hi");
requestAnimationFrame(draw);*/
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