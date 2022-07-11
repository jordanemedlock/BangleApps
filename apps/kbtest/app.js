// place your const, vars, functions or classes here

// clear the screen
g.clear();

var displayText = "";

requestAnimationFrame("textinput").input({text:displayText}).then(result => {
    g.reset();
    g.setFont("6x8:1x2");
    g.setFontAlign(-1,-1);
    g.drawString(displayText, 30, 30, true);

})

// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();
