var deathpageLoaded = false;
var deathpage = new this.Image();

var characterType = localStorage.getItem("cTypeLocalStorage");

this.deathpage.onerror = function() {
    ctx = null;
    alert("Failed to load sprites");
};
this.deathpage.onload = function() {
    deathpageLoaded = true;
};

if (characterType == "archer") {
    this.deathpage.src = "assets/images/deathpagearcher.png";
}
if (characterType == "knight") {
    this.deathpage.src = "assets/images/deathpagenight.png";
}
if (characterType == "mage") {
    this.deathpage.src = "assets/images/deathpagemage.png";
}

var ctx = document.getElementById("myCanvas").getContext("2d");
window.onload = function() {
    ctx.drawImage(deathpage, 0, 0);
}