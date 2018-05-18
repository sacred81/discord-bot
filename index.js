const D = require("discord.js");
const test = new D.Client();
var targetList;
init();
var version = "v20180518-1";

test.login("NDQ2NTU1NzQ1MjQ1MzMxNDYz.Dd6vEQ.azN7Mhva-L7zOMk0SnJWa8Zt7m0");
var command = "!";

//var command = ".";
//startTest();
//argvTest();

test.on("message", (message) => {
    if (message.content[0] != command) {
        return;
    }
    var processed = false;
    if (message.content.indexOf("컷") != -1) {
        if (doCut(message.content) == true) {
            message.reply(message.content + " 확인");
            processed = true;
        }
    } else if (message.content.indexOf("점검") != -1) {
        doReset(message.content);
        message.reply(getTargets());
        processed = true;
    } else if (message.content.indexOf("예상") != -1) {
        if (doExpect(message.content) == true) {
            message.reply(message.content + " 확인");
            processed = true;
        }
    } else if (message.content.trim().length == 1) {
        message.reply(getTargets());
        processed = true;
    } else {
        if (doCut(message.content) == true) {
            message.reply(message.content + " 확인");
            processed = true;
        }
    }
    if (!processed) {
        message.reply(getUsage(message.content));
    }
});

function getUsage(text)
{
    var str = "";
    if (text) {
        str = str + text + " ??\n";
    }
    str = str + "\"!\" : <목록>, \"!점검 0524\" : <점검시간 입력>, \"!1024 기감\" : <컷시간 입력>, \"!1024 기감 예상\" : <예상 컷시간 입력>\n";
    str = str + "1시간 이전 내용은 누락 표시. ( version : " + version + " )";
    return str;
}

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

function genDate()
{
   var now = new Date();
   return new Date(now - ((now.getTimezoneOffset() + 540) * 60 * 1000));
}

function Target(id, time) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    this.id = id;
    this.time = time;
    this.cut = date;
    date.setHours(time);
    this.gen = date;
    this.expect = false;
}

function setCut(id, time, expect) {
    for (var i = 0; i < targetList.length; i++) {
        if (id == targetList[i].id) {
            var date = new Date();
            var splitted = time.split(":");
            date.setHours(splitted[0], splitted[1], 0, 0);
            targetList[i].cut = date;
            date.setHours(date.getHours() + targetList[i].time);
            targetList[i].gen = date;
            targetList[i].expect = expect;
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
        setCut(targetList[i].id, time, false);
    }
}

function getTargets()
{
    sortTargets();
    var now = genDate();
    now.setHours(now.getHours() - 1);
    var targets = "";
    for (var i = 0; i < targetList.length; i++) {
        targets = targets + targetList[i].id + " " + getTime(targetList[i].gen) + 
        (targetList[i].gen < now ? " 누락" : "") +
        (targetList[i].expect == true ? " 예상" : "") +
        " " + dateString(targetList[i].gen) +
        "\n";
    }
    var now = genDate();
    targets = targets + dateString(now);
    return targets;
}

function sortTargets()
{
    targetList.sort(function(a, b) { return (a.gen > b.gen) ? 1 : -1; });
}

function dateString(date)
{
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
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

function doExpect(str)
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

    return setCut(id, time, true);
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

    return setCut(id, time, false);
}

function refineStr(str)
{
    str = str.replace(command, "");
    str = str.replace("컷", "");
    str = str.replace("점검", "");
    str = str.replace("예상", "");
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
    } else if (str.indexOf("예상") != -1) {
        doExpect(str);
    } else {
        doCut(str);
    }

    console.log(getTargets());
    console.log(getUsage("123"));
}