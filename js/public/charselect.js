//assigning the canvas variables
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

//creates a variable that will be used to determine the character's class
var characterType = null;

//each of these functions sets the character's class to their respective type and then stores that variable locally in the browser for another .js file to access
var archerSelected = function(){
    characterType = "archer";
    localStorage.setItem("cTypeLocalStorage", characterType); 
}
var knightSelected = function(){
    characterType = "knight"; 
    localStorage.setItem("cTypeLocalStorage", characterType); 
}
var mageSelected = function(){
    characterType = "mage"; 
    localStorage.setItem("cTypeLocalStorage", characterType); 
}



//draw the charselect.png image onto the canvas
var img = new Image();
img.onload = function () {
    context.drawImage(img, 0, 0);
}
img.src = "charselect.png";



