const w = window.innerWidth;
const h = window.innerHeight;

//Set canvas size: TO DO: Make this according to the window size... For now, 800 works well for me.
let canvas_size = 600;

// Create the canvas and add it to the page:
var canvas_hull = document.createElement("div");
canvas_hull.setAttribute("style", "width:1000px; margin-left:auto; margin-right:auto; text-align:center;");
var our_canvas = document.createElement("canvas");
our_canvas.setAttribute("width", canvas_size);
our_canvas.setAttribute("height", canvas_size);
our_canvas.id = "theCanvas";
canvas_hull.appendChild(our_canvas);
document.body.appendChild(canvas_hull);


// Add the temperature slider and readout:
var paragraph = document.createElement("p");
paragraph.setAttribute("style", "text-align:center;");
var temp_hull = document.createElement("div");
temp_hull.setAttribute("style", "text-align:center;");
temp_hull.innerHTML = "Temperature = ";
var tempReadout = document.createElement("span");
tempReadout.setAttribute("id", "tempReadout");
tempReadout.innerHTML = "2.27";
temp_hull.appendChild(tempReadout);
paragraph.appendChild(temp_hull);
document.body.appendChild(paragraph);


var paragraph = document.createElement("p");
paragraph.setAttribute("style", "text-align:center;");
var temp_hull = document.createElement("div");
var tempSlider = document.createElement("input");
tempSlider.setAttribute("id", "tempSlider");
tempSlider.setAttribute("type", "range");
tempSlider.setAttribute("min", "0.01");
tempSlider.setAttribute("max", "9.99");
tempSlider.setAttribute("step", "0.01");
tempSlider.setAttribute("value", "2.27");
tempSlider.setAttribute("oninput", "showTemp();");
tempSlider.setAttribute("onchange", "showTemp();");
tempSlider.setAttribute("style", "width:" + canvas_size + "px");
temp_hull.appendChild(tempSlider);
paragraph.appendChild(temp_hull);
document.body.appendChild(paragraph);


var paragraph = document.createElement("p");
paragraph.setAttribute("style", "text-align:center;");
var temp_hull = document.createElement("div");
var startButton = document.createElement("input");
startButton.setAttribute("id", "startButton");
startButton.setAttribute("type", "button");
startButton.setAttribute("onclick", "startStop()");
startButton.setAttribute("value", "  Start  ");
startButton.setAttribute("style", "font-size:large;");
temp_hull.appendChild(startButton);
paragraph.appendChild(temp_hull);
document.body.appendChild(paragraph);






// Set up the simulation parameters:
const size = 200;                          // lattice dimension in each direction (must divide canvas size)        
const canvas = document.getElementById('theCanvas');         
const context = canvas.getContext('2d');
const squareWidth = canvas.width / size;      // width of each lattice site in pixels
const stepsPerFrame = 10000;                  // number of steps to take per animation frame
var running = false;                        // will be true when running
const colorSpinUp = 'rgb(0,0,0)';              // color for spin up
const colorSpinDown = 'rgb(200,200,200)';            // color for spin down



// Get the HTML elements:
var startButton = document.getElementById('startButton');
var tempSlider  = document.getElementById('tempSlider');
var tempReadout = document.getElementById('tempReadout');

// Create the 2D array of spins, initially random (1 for up, -1 for down):
var s = new Array(size);
for (var i=0; i<size; i++) {
    s[i] = new Array(size);             // a 2D array is just an array of arrays
    for (var j=0; j<size; j++) {
        if (Math.random() < 0.5) s[i][j] = 1; else s[i][j] = -1;
        colorSquare(i, j);
    }
}

//run the simulation
simulate();     
  

// Simulate function executes a bunch of steps and then schedules another call to itself:
function simulate() {
    if (running) { //only run if the simulation is running
        var T = Number(tempSlider.value);
        for (var step=0; step<stepsPerFrame; step++) {
            // choose a random site and compute energy change from hypothetical flip:
            var i = Math.floor(Math.random()*size);         
            var j = Math.floor(Math.random()*size);
            var energyDifference = deltaU(i, j);
            //This is the update step in the Metropolis algorithm
            if ((energyDifference <=0) || (Math.random() < Math.exp(-energyDifference/T))) {  
                s[i][j] *= -1;
                colorSquare(i, j);
            }
        }
    }
    window.setTimeout(simulate, 1);     // run simulate again 1 ms later.
}


// Given a lattice site, calculate the change in energy if that site were flipped:
function deltaU(i, j) {
    var leftS, rightS, topS, bottomS;  // values of neighboring spins
    if (i == 0) leftS = s[size-1][j];   else leftS = s[i-1][j];
    if (i == size-1) rightS = s[0][j];  else rightS = s[i+1][j];
    if (j == 0) topS = s[i][size-1];    else topS = s[i][j-1];
    if (j == size-1) bottomS = s[i][0]; else bottomS = s[i][j+1];
    return 2.0 * s[i][j] * (leftS + rightS + topS + bottomS);
}


// Color a given square according to its alignment:
function colorSquare(i, j) {
    if (s[i][j] == 1) context.fillStyle = colorSpinUp; 
        else context.fillStyle = colorSpinDown;             
    context.fillRect(i*squareWidth, j*squareWidth, squareWidth, squareWidth);       
}

// Function to start or pause the simulation:
function startStop() {
    running = !running;
    if (running) {
        startButton.value = " Pause ";
    } else {
        startButton.value = "Resume";
    }
}

// Function to update the temperature readout:
function showTemp() {
    tempReadout.innerHTML = Number(tempSlider.value).toFixed(2);
}
