const D = require("discord.js");
const test = new D.Client();

test.login("NDQ2NTU1NzQ1MjQ1MzMxNDYz.Dd6vEQ.azN7Mhva-L7zOMk0SnJWa8Zt7m0");

var command = "!";
var targetList;

init();
//startTest();
//argvTest();

test.on("message", (message) => {
    if (message.content[0] != command) {
        return;
    }
    if (message.content.indexOf("컷") != -1) {
        if (doCut(message.content) == true) {
            message.reply(message.comtent + " 확인");
        }
    } else if (message.content.indexOf("점검") != -1) {
        doReset(message.content);
        message.reply(getTargets());
    } else if (message.content.indexOf("보스") != -1) {
        message.reply(getTargets());
    } else {
        doCut(message.content);
    } 
});

function init() {
    targetList = [];
    targetList.push(new Target("감시자", 6));
    targetList.push(new Target("거드", 3));
    targetList.push(new Target("기감", 1));
    targetList.push(new Target("녹샤", 2));
    targetList.push(new Target("대흑장", 3));
    targetList.push(new Target("데스", 7));
    targetList.push(new Target("동드", 3));
    targetList.push(new Target("마요", 3));
    targetList.push(new Target("빨샤", 2));
    targetList.push(new Target("산적", 3));
    targetList.push(new Target("서드1", 2));
    targetList.push(new Target("서드2", 2));
    targetList.push(new Target("스피", 3));
    targetList.push(new Target("아르", 4));
    targetList.push(new Target("에자", 5));
    targetList.push(new Target("웜", 2));
    targetList.push(new Target("이프", 2));
    targetList.push(new Target("자크", 3));
    targetList.push(new Target("중드", 3));
    targetList.push(new Target("카파", 2));
    targetList.push(new Target("커츠", 5));
    targetList.push(new Target("피닉", 7));
}

function Target(id, time) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    this.id = id;
    this.time = time;
    this.cut = date;
    date.setHours(time);
    this.gen = date;
}

function setCut(id, time) {
    for (var i = 0; i < targetList.length; i++) {
        if (id == targetList[i].id) {
            var date = new Date();
            var splitted = time.split(":");
            date.setHours(splitted[0], splitted[1], 0, 0);
            targetList[i].cut = date;
            date.setHours(date.getHours() + targetList[i].time);
            targetList[i].gen = date;
            return true;
        }
    }
    return false;
}

function getTime(time) {
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    return hours + ":" + minutes;
}

function reset(time) {
    for (var i = 0; i < targetList.length; i++) {
        setCut(targetList[i].id, time);
    }
}

function getTargets()
{
    sortTargets();
    var now = new Date();
    now.setHours(now.getHours() - 1);
    var targets = "";
    for (var i = 0; i < targetList.length; i++) {
        targets = targets + targetList[i].id + " " + getTime(targetList[i].gen) + 
        (targetList[i].gen < now ? " 누락" : "") +
        "\n";
    }
    return targets;
}

function sortTargets()
{
    targetList.sort(function(a, b) { return (a.gen > b.gen) ? 1 : -1; });
}

function doReset(str)
{
    var splitted = refineStr(str);
    if (splitted.length != 1) {
        console.log("doReset : invalid length! : " + splitted.length);
        for (var i = 0; i < splitted.length; i++) {
            console.log("splitted = " + splitted[i]);
        }
        return;
    }
    var time = splitted[0];
    if (time.indexOf(":") == -1) {
        var newTime = "";
        for (var i = 0; i < time.length; i++) {
            if (i == time.length -2) {
                newTime = newTime + ":";
            }
            newTime = newTime + time[i];
        }
        time = newTime;
    }
    reset(time);
}

function doCut(str)
{
    var splitted = refineStr(str);
    if (splitted.length != 2) {
        return;
    }
    var time = splitted[0];
    var id = splitted[1];
    if (time.indexOf(":") == -1) {
        var newTime = "";
        for (var i = 0; i < time.length; i++) {
            if (i == time.length -2) {
                newTime = newTime + ":";
            }
            newTime = newTime + time[i];
        }
        time = newTime;
    }

    return setCut(id, time);
}

function refineStr(str)
{
    str = str.replace(command, "");
    str = str.replace("컷", "");
    str = str.replace("점검", "");
    var splitted = str.split(" ");
    splitted = splitted.filter((val) => val.trim() != "");
    splitted.sort();
    return splitted;
}

function printTargets()
{
    console.log(getTargets());
}

function startTest()
{
    printTargets();
    doCut("!기감컷 2038");
    printTargets();
    doReset("!점검 09:00");
    printTargets();
    doCut("!1231 빨샤컷");
    printTargets();
}

function argvTest()
{
    var str = "";
    var arg = process.argv;
    for (var i = 2; i < arg.length; i++) {
        str = str + arg[i];
        if (i < arg.length -1) {
            str = str + " ";
        }
    }

    console.log("input = " + str);
    if (str[0] != command) {
        return;
    }
    if (str.indexOf("컷") != -1) {
        doCut(str);
    } else if (str.indexOf("점검") != -1) {
        doReset(str);
    } else {
        doCut(str);
    }

    console.log(getTargets());
}