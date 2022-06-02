// place your const, vars, functions or classes here

// clear the screen
g.clear();

var alarms = require("sched").getAlarms();

var titles = [ "Work", "Clean", "Relax", "Game", "Elden Ring", "Watch", "Tik Tok" ];


const iconTimerOn = "\0" + (g.theme.dark
  ? atob("GBjBAP////8AAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5wAAwwABgYABgYABgYAH/+AH/+AAAAAAAAAAAAA=")
  : atob("GBjBAP//AAAAAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5wAAwwABgYABgYABgYAH/+AH/+AAAAAAAAAAAAA="));
const iconTimerOff = "\0" + (g.theme.dark
  ? atob("GBjBAP////8AAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5HgAwf4BgbYBgwMBg4cH84cH8wMAAbYAAf4AAHg=")
  : atob("GBjBAP//AAAAAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5HgAwf4BgbYBgwMBg4cH84cH8wMAAbYAAf4AAHg="));


function showMenu() {
    var menu = {
        "": { title: "Tasks Timer", y: 30 },
        "< Back": function () { load(); },
        "Edit >": function () { showEditMenu(); },
        "History >": function() { showHistory(); }
    };

    alarms.forEach(function(alarm, i) {
        if (!alarm.task) return;

        var label = titles[alarm.title] + " for " + formatDuration(alarm.timer);

        menu[label] = {
            value: alarm.on,
            onchange: function() {
                toggleTimer(i);
                saveAndReload();
            },
            format: function(value) {return value ? iconTimerOn : iconTimerOff;}
        };
    });

    E.showMenu(menu);

}

function toggleTimer(idx) {
    alarms[idx].on = !alarms[idx].on;
    saveAndReload();
}

function showHistory() {

}

function formatDuration(time) {
    return require("time_utils").formatDuration(time);
//   return time / 60 / 1000;
}

function newDefaultTask() {
    var timer = require("sched").newDefaultTimer();

    timer.on = false;
    timer.timer = 30 * 60 * 1000;
    timer.task = true;
    timer.title = 0;

    return timer;
}

function saveAndReload() {
    require("sched").setAlarms(alarms);
    require("sched").reload();
}

function showEditMenu() {
    var menu = {
        "": { title: "Edit Tasks", y: 30 },
        "< Back": function() { showMenu(); },
        "New >": function () { showEditTask(null); }
    };

    
    alarms.forEach(function(alarm, i) {
        if (!alarm.task) return;

        var label = titles[alarm.title] + " for " + formatDuration(alarm.timer);

        menu[label] = function() { showEditTask(i); };
    });

    E.showMenu(menu);
}

function showEditTask(idx) {
    var isNew = idx === null;
    var task = null;

    if (isNew) {
        task = newDefaultTask();

        alarms.push(task);
        idx = alarms.length - 1;
    } else {
        task = alarms[idx];
    }

    var menu = {
        "": { title: "Edit Task", y: 30 },
        "< Save": function() {
                saveAndReload();
                showEditMenu(); 
            },
        "Title": {
            value: task.title,
            step: 1,
            min: 0,
            max: titles.length-1,
            wrap: true,
            onchange: function(value) {task.title = value;},
            format: function(value) {return titles[value];}
        },
        "Timer": {
            value: task.timer,
            step: 5 * 60 * 1000, // 5 minutes
            min: 5 * 60 * 1000, // 5 minutes
            max: 2 * 60 * 60 * 1000, // 2 hours
            wrap: false,
            onchange: function(value) {task.timer = value;},
            format: function(value) {
                return formatDuration(value);
            }
        },
        "Delete": function() {
            E.showPrompt("Are you sure?", {title: "Delete Task"}).then((confirm) => {
                if (confirm) {
                    alarms = alarms.splice(idx, 1);
                    saveAndReload();
                } else {
                    showEditTask(idx);
                }
            });
        }
    };


    E.showMenu(menu);
}

showMenu();

// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();
