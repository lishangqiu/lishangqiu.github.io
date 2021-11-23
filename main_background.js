var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

function assignToDiv(){ // this kind of function you are looking for
  dataUrl = canvas.toDataURL();
  //document.getElementById('main-body').style.background='url('+dataUrl+')';
  //document.getElementById("main-body").style.backgroundRepeat = 'no-repeat';

  //canvas.style.display = 'none';
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

    backgroundFrom: [0, 5, 80],
    backgroundTo: [10, 25, 95],
    backgroundDuration: 6000,

    number: 100,
    speed: 20,
}, assignToDiv);

var data = [
    [0, 4, "Good night"], 
    [5, 11, "Good morning"],          //Store messages in an array
    [12, 17, "Good afternoon"],
    [18, 24, "Good evening"]
],
    hr = new Date().getHours();

for(var i = 0; i < data.length; i++){
    if(hr >= data[i][0] && hr <= data[i][1]){
        document.getElementById('greeting-text').innerHTML= data[i][2] + " !";
    }
}
