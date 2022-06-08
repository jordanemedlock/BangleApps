
(() => {
    var titles = [ "Work", "Clean", "Relax", "Game", "Elden Ring", "Watch", "Tik Tok" ];

    function draw() {
        const alarms = require('Storage').readJSON('sched.json',1) || [];
        const tasks = alarms.filter(a => a.task && a.on);

        const task = tasks[0];
        if (task) {
            g.reset();var time = new Date();
            var currentTime = (time.getHours()*3600000)+(time.getMinutes()*60000)+(time.getSeconds()*1000);
            var text = titles[task.title] + " " + require("time_utils").formatDuration(task.t - currentTime, true);
            g.setFont("6x8:1x2");
            g.setFontAlign(-1,-1);
            g.drawString(text, this.x, this.y, true);
            if (this.width === 0) {
                this.width = 6*text.length+2;
                Bangle.drawWidgets();
            }
        }
    }

    function reload() {
        this.draw(this);
    }

    setInterval(function() {
        WIDGETS["alarm"].reload();
    }, 30*1000);

    WIDGETS["alarm"] = {
        area: "tl",
        width: 0,
        draw: draw,
        reload: reload
    };
})();