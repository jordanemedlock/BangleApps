

var Layout = require("Layout");

var setTimer = (msg, h, m, s) => {
    require("sched").setAlarm(msg, {
        on: true,
        msg: msg,
        timer:  s * 1000 + m * 60 * 1000 + h * 60 * 60 * 1000,
        del: true
    });
    require("sched").reload();
    load();
};

var layout = new Layout({
    type: "v", fillx: 1, filly: 1, c: [
        {type: "h", fillx: 1, filly: 1, c: [
            {type: "btn", font: "6x8:2", label: "1m", fillx: 1, filly: 1, cb: l=>setTimer("1m", 0,1,0)},
            {type: "btn", font: "6x8:2", label: "2m", fillx: 1, filly: 1, cb: l=>setTimer("2m", 0,2,0)},
            {type: "btn", font: "6x8:2", label: "3m", fillx: 1, filly: 1, cb: l=>setTimer("3m", 0,3,0)}
        ]},
        {type: "h", fillx: 1, filly: 1, c: [
            {type: "btn", font: "6x8:2", label: "5m", fillx: 1, filly: 1, cb: l=>setTimer("5m", 0,5,0)},
            {type: "btn", font: "6x8:2", label: "10m", fillx: 1, filly: 1, cb: l=>setTimer("10m", 0,10,0)},
            {type: "btn", font: "6x8:2", label: "15m", fillx: 1, filly: 1, cb: l=>setTimer("15m", 0,15,0)}
        ]},
        {type: "h", fillx: 1, filly: 1, c: [
            {type: "btn", font: "6x8:2", label: "30m", fillx: 1, filly: 1, cb: l=>setTimer("30m", 0,30,0)},
            {type: "btn", font: "6x8:2", label: "1h", fillx: 1, filly: 1, cb: l=>setTimer("1h", 1,0,0)},
            {type: "btn", font: "6x8:2", label: "2h", fillx: 1, filly: 1, cb: l=>setTimer("2h", 2,0,0)}
        ]},
    ]
});


g.clear();
layout.render();