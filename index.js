const D = require("discord.js");
const test = new D.Client();

test.login("NDQ2NTU1NzQ1MjQ1MzMxNDYz.Dd6vEQ.azN7Mhva-L7zOMk0SnJWa8Zt7m0");

test.on("message", (message) => {
    if (message.content == "ping") {
        message.reply("pong");
    }
});
