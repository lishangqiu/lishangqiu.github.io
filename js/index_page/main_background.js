var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

function assignToDiv(){ // this kind of function you are looking for
  canvas.height = document.getElementById('main-body').offsetHeight;
  canvas.width = document.getElementById('main-body').offsetWidth;
}

// bad code, but i don't know any other way.
document.getElementById('main-body').setAttribute("style",`height:${$(document).height()-50}px`);
assignToDiv();
var nodesjs = new NodesJs({
    id: 'nodes',
    width: canvas.width,
    height: canvas.height,

    backgroundFrom: [0, 5, 60],
    backgroundTo: [10, 25, 75],
    backgroundDuration: 6000,

    number: 100,
    speed: 20,
}, assignToDiv);
