// place your const, vars, functions or classes here

// clear the screen
g.clear();

var alarms = require("sched").getAlarms();
var history = require("Storage").readJSON("task-history.json", 1) || [];

var titles = [ "Work", "Clean", "Relax", "Game", "Elden Ring", "Watch", "Tik Tok" ];


const iconTimerOn = "\0" + (g.theme.dark
  ? atob("GBjBAP////8AAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5wAAwwABgYABgYABgYAH/+AH/+AAAAAAAAAAAAA=")
  : atob("GBjBAP//AAAAAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5wAAwwABgYABgYABgYAH/+AH/+AAAAAAAAAAAAA="));
const iconTimerOff = "\0" + (g.theme.dark
  ? atob("GBjBAP////8AAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5HgAwf4BgbYBgwMBg4cH84cH8wMAAbYAAf4AAHg=")
  : atob("GBjBAP//AAAAAAAAAAAAAAAH/+AH/+ABgYABgYABgYAA/wAA/wAAfgAAPAAAPAAAfgAA5HgAwf4BgbYBgwMBg4cH84cH8wMAAbYAAf4AAHg="));


function showMenu() {
    var menu = {
        "": { title: "Tasks Timer" },
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
    history.push({
        title: alarms[idx].title,
        timer: alarms[idx].timer,
        time: new Date()
    })
    require("Storage").writeJSON('task-history.json', history);
    saveAndReload();
}

function showHistory() {

    var menu = {
        "": { title: "Tasks History" },
        "< Back": function () { showMenu(); },
        // "Edit >": function () { showEditMenu(); },
        // "History >": function() { showHistory(); }
    };

    history.forEach(h => {
        var label = titles[h.title] + " for " + formatDuration(h.timer) + " @" + require("time_utils").time(h.time);
        menu[label] = () => {}
    })

    E.showMenu(menu);
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
        "": { title: "Edit Tasks" },
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
        "": { title: "Edit Task" },
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
            max: 120 * 60 * 1000, // 2 hours
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

// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();

showMenu();

