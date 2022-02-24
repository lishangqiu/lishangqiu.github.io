var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

function assignToDiv(){ // this kind of function you are looking for
}

console.log(canvas.height)

// bad code, but i don't know any other way.
assignToDiv();
var nodesjs = new NodesJs({
    id: 'nodes',
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,

    backgroundFrom: [0, 5, 60],
    backgroundTo: [10, 25, 75],
    backgroundDuration: 6000,

    number: 100,
    speed: 20,
}, assignToDiv);
