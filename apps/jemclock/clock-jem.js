// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
var is12Hour = true; // (require("Storage").readJSON("setting.json",1)||{})["12hour"];
// position on screen
const X = 160, Y = 132;
const width = g.getWidth(), height = g.getHeight() - 30;

var prev = new Date();

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
  g.setBgColor("#FFF");
  g.setColor("#000");
  // draw the current time (4x size 7 segment)
  g.setFont("7x11Numeric7Seg",4);
  g.setFontAlign(1,1); // align right bottom
  g.drawString(time, X, Y, true /*clear background*/);

  // Draw AM/PM
  if (is12Hour) {
    g.setFont("6x8", 1.5);
    g.setFontAlign(-1,1);
    g.drawString(ap, X+5, Y-25, true);
  }
  g.setFontAlign(1,1); // align right bottom

  // draw the seconds (2x size 7 segment)
  g.setFont("7x11Numeric7Seg",2);
  g.drawString(("0"+d.getSeconds()).substr(-2), X+30, Y, true /*clear background*/);
  
  if (prev.getDay() != d.getDay()) {
    drawDate();  
    prev = d;
  }
  
  
}

function drawDate() {
  console.log("drawDate()");
  var d = new Date();
  // draw the date, in a normal font
  g.setBgColor("#9C59D1");
  g.setColor("#000");
  g.setFont("6x8", 2);
  g.setFontAlign(0,1); // align center bottom
  // pad the date - this clears the background if the date were to change length
  var weekday = "    "+require("locale").dow(d)+"    ";
  g.drawString(weekday, g.getWidth()/2, Y+27, true /*clear background*/);
  
  var dateStr = "    "+require("locale").date(d)+"    ";
  g.drawString(dateStr, g.getWidth()/2, Y+50, true /*clear background*/);
}

// Clear the screen once, at startup
g.clear();


g.setColor("#FCF434");
g.fillRect(0, 30, width, height*0.25 + 30);
g.setColor("#FFF");
g.fillRect(0, height*0.25 + 30, width, height*0.5 + 30);
g.setColor("#9C59D1");
g.fillRect(0, height*0.5 + 30, width, height*0.75 + 30);

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
// Show launcher when middle button pressed
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();