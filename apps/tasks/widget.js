
(() => {
    var titles = [ "Work", "Clean", "Relax", "Game", "Elden Ring", "Watch", "Tik Tok" ];

    function draw() {
        const alarms = require("sched").getAlarms();
        const tasks = alarms.filter(a => a.task && a.on);

        const task = tasks[0];
        if (task) {
            g.reset();
            var text = titles[task.title] + " " + require("time_utils").formatDuration(task.timer);
            g.setFont("6x8:1x2");
            g.setFontAlign(-1,-1);
            g.drawString(text, this.x, this.y, true);
            if (this.width === 0) {
                this.width = 6*text.length+2;
                Bangle.drawWidgets();
            }
        }
    }

    setInterval(function() {
        WIDGETS["alarm"].draw(WIDGETS["alarm"]);
    }, 30*1000);

    WIDGETS["alarm"] = {
        area: "tl",
        width: 0,
        draw: draw
    };
})();