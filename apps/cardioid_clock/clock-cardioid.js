const width = g.getWidth(), height = g.getHeight();

require("Font7x11Numeric7Seg").add(Graphics);


const is12Hour = (require("Storage").readJSON("setting.json",1)||{"12hour":true})["12hour"];
const X = 0, Y = 30;
var prev = new Date();

var palette = ['#FFF', '#F00', '#F80', '#FF0', '#0F0', '#0FF', '#00F', '#80F', '#F0F'];
var colorIdx = 0;
var color = palette[colorIdx];

var points = [];
var numPoints = 120;
var r = 90;
var dTh = 360 / numPoints;
var degToRad = (deg) => deg / 180 * Math.PI;
var cx = width/2 + 20, cy = height/2 + 20;
for (var i=0; i < numPoints; i++) {
    var x = Math.cos(degToRad(i * dTh)) * r + cx;
    var y = Math.sin(degToRad(i * dTh)) * r + cy;
    points.push([x,y]);
}
var period = 2;
var pointIndex = 0;

function avg(p1, p2) {
  var p3 = p1.map(x => 0);
  for (var i=0; i < p1.length; i++) {
    p3[i] = (p1[i] + p2[i])/2;
  }
  return p3;
}

function draw() {
    drawCardioid();
    drawClock();
}

function drawCardioid() {
    if (pointIndex >= numPoints) {
        pointIndex = 0;
        period++;
        drawBackground();
    }
    // 877 646 6804
    var startPoint = points[pointIndex];
    var endPoint = points[pointIndex * period % points.length];
    pointIndex++;
    g.setColor(color);
    g.drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);

}

function drawBackground() {
    g.setColor(0,0,0);
    g.fillCircle(cx, cy, r+2);
    g.setColor(color);
    points.forEach((ps) => {
        g.fillRect(ps[0], ps[1], ps[0], ps[1]);
    });
}

function drawClock() {
    // work out how to display the current time
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes(), ap = "AM";
    if (is12Hour) {
        ap = h >= 12 ? "PM" : "AM";
        h = ((h + 11) % 12) + 1;
    }
    var time = (" "+h).substr(-2) + ":" + ("0"+m).substr(-2);
    // Reset the state of the graphics library
    g.reset();
    g.setColor(color);
    // draw the current time (4x size 7 segment)
    g.setFont("7x11Numeric7Seg",2);
    g.setFontAlign(-1,-1); // align right bottom
    g.drawString(time, X, Y, true /*clear background*/);
    
    // Draw AM/PM
    if (is12Hour) {
        g.setFont("6x8", 1.5);
        g.setFontAlign(-1,-1);
        g.drawString(ap, X+70, Y, true);
    }
    
    // draw the seconds (2x size 7 segment)
    g.setFont("7x11Numeric7Seg",1);
    g.setFontAlign(-1,-1); // align right bottom
    g.drawString(("0"+d.getSeconds()).substr(-2), X+70, Y+11, true /*clear background*/);
    
    if (prev.getDay() != d.getDay()) {
        drawDate();  
        prev = d;
    }
}


function drawDate() {
    var d = new Date();
    // draw the date, in a normal font
    g.setColor(color);
    g.setFont("6x8", 1);
    g.setFontAlign(-1,-1); // align center bottom
    // pad the date - this clears the background if the date were to change length
    var weekday = require("locale").dow(d);
    g.drawString(weekday, 7, Y+24, true /*clear background*/);
    
  
    var dateStr = require("locale").date(d);
    g.drawString(dateStr, 7, Y+32, true /*clear background*/);
}

// Clear the screen once, at startup
g.clear();


// draw immediately at first
drawBackground();
draw();
drawDate();

var secondInterval = setInterval(draw, 250);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
    if (secondInterval) clearInterval(secondInterval);
    secondInterval = undefined;
    if (on) {
        secondInterval = setInterval(draw, 250);
        draw(); // draw immediately
    }
});

setWatch(() => {
    colorIdx = (colorIdx + 1) % palette.length;
    color = palette[colorIdx];
    period = 2;
    pointIndex = 0;
    drawBackground();
    draw();
    drawDate();
}, BTN1, {repeat:true});

// Show launcher when middle button pressed
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();