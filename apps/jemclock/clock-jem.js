// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
var is12Hour = true; // (require("Storage").readJSON("setting.json",1)||{})["12hour"];
// position on screen
const width = g.getWidth(), height = g.getHeight();
const X = width / 1.5, Y = height / 1.8;

var flags = {
    "nb": {
        colors: ["#FCF434","#FFFFFF","#9C59D1","#000000"],
        offset: height / 8,
        time: { y: 0, bg: "#FFFFFF" },
        dow: { y: 27, bg: "#9C59D1" },
        date: { y: 50, bg: "#9C59D1" }
    },
    "pride": {
        colors: ["#D12229","#F68A1E","#FDE01A","#007940","#24408E","#732982"],
        offset: 0,
        time: { y: -15, bg: "#FDE01A" },
        dow: { y: 27, bg: "#007940" },
        date: { y: 50, bg: "#24408E" }
    }
};

var flagType = 'nb';
var flag = flags[flagType];

var prev = new Date();
var numSize = 3.8;

function draw() {
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
    g.setBgColor(flag.time.bg);
    g.setColor("#000");
    // draw the current time (4x size 7 segment)
    g.setFont("7x11Numeric7Seg",numSize);
    g.setFontAlign(1,1); // align right bottom
    g.drawString(time, X, Y + flag.time.y, true /*clear background*/);
    
    // Draw AM/PM
    if (is12Hour) {
        g.setFont("6x8", 1.5);
        g.setFontAlign(-1,1);
        g.drawString(ap, X+5, Y-25 + flag.time.y, true);
    }
    
    // draw the seconds (2x size 7 segment)
    g.setFont("7x11Numeric7Seg",numSize*0.6);
    g.setFontAlign(-1,1); // align right bottom
    g.drawString(("0"+d.getSeconds()).substr(-2), X+5, Y + flag.time.y, true /*clear background*/);
    
    if (prev.getDay() != d.getDay()) {
        drawDate();  
        prev = d;
    }
}

function drawDate() {
    var d = new Date();
    // draw the date, in a normal font
    g.setBgColor(flag.dow.bg);
    g.setColor("#000");
    g.setFont("6x8", 2);
    g.setFontAlign(0,1); // align center bottom
    // pad the date - this clears the background if the date were to change length
    var weekday = "    "+require("locale").dow(d, 1)+"    ";
    // g.drawString(weekday, g.getWidth()/2, Y+flag.dow.y, true /*clear background*/);
    
    g.setBgColor(flag.date.bg);
  
    var dateStr = require("locale").dow(d, 1) + " "+require("locale").month(d, 1) + " " + d.getDate();
    g.drawString(dateStr, g.getWidth()/2, Y+flag.dow.y, true /*clear background*/);
}

function drawBackground() {
    g.reset();
    var offset = flag.offset;
    var bands = flag.colors.length;
    var bandHeight = (height - offset) / bands;
    g.setColor('#000');
    g.fillRect(0, 0, width, offset);
    for (var i=0; i < bands; i++) {
        var color = flag.colors[i];
        g.setColor(color);
        g.fillRect(0, bandHeight * i + offset, width, bandHeight * (i+1) + offset);
    }
}

// Clear the screen once, at startup
g.clear();
drawBackground();


// draw immediately at first
draw();
drawDate();

var secondInterval = setInterval(draw, 1000);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
    if (secondInterval) clearInterval(secondInterval);
    secondInterval = undefined;
    if (on) {
        secondInterval = setInterval(draw, 1000);
        draw(); // draw immediately
    }
});

setWatch(() => {
  flagType = flagType == 'nb' ? 'pride' : 'nb';
  flag = flags[flagType];
  drawBackground();
  draw();
  drawDate();
}, BTN1, {repeat: true});

// Show launcher when middle button pressed
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();