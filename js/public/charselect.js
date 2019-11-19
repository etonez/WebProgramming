//Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

//assigning the canvas variables
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');


//The rectangle should have x,y,width,height properties
var archer = {
    x:0,
    y:0,
    width:200,
    height:600
};

var knight = {
    x:200,
    y:0,
    width:200,
    height:600
};

var mage = {
    x:400,
    y:0,
    width:200,
    height:600
};

//draw the charselect.png image onto the canvas
var img = new Image();
img.onload = function () {
    context.drawImage(img, 0, 0);
}
img.src = "charselect.png";

//Binding the click event on the canvas
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,archer)) {
        window.open("main.html","_self");
    }
}, false);

canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,knight)) {
        window.open("main.html","_self");
    }
}, false);

canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,mage)) {
        window.open("main.html","_self");
    }
}, false);
