#!/usr/bin/env node

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var version = "0.4b";
var dist = "LIVE"

//Configure logger
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

//Init
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    bot.setPresence( {game: {name:"Feeling suicidal"}} );
    logger.info('UmletBot Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' (' + bot.id + ')');
});

//Scenario booleans, for now this does nothing
var DeathScenarioActive = false;

//If true, bot won't respond
var IsBotSleeping = false;

//Define our responselines, TODO: get this from a db?
var ReactLines = ["I'm suicidal", "Life is pain", "Blame my devs for my existence", "FUCK", "why", "Climate change isn't real and the earth is flat", "Cutprogramma", "Yoeskees", "Fucking people in the ass since 2010", "Finger lickin' shit™", "Press X to kill yourself", "OOR", "Yes", "No", "Hundreds of students failed their year because of me, keep that in mind", "Hi", "Sadly, nobody cares about your opinion"]
var DeathLines = ["Goodbye cruel world", "You died.", "If only it was that easy huh", "You will be missed"]

bot.on('message', function (user, userID, channelID, message, evt) {
    try {
        //Filter out our own messages
        if (userID == 628219783665549333) return;

        //Create a random digit for each scenario
        var rndReact = ReactLines[Math.floor(Math.random() * ReactLines.length)];
        var rndDeath = DeathLines[Math.floor(Math.random() * DeathLines.length)];

        /// Check if bot is sleeping, wake up when needed ///
        if(IsBotSleeping) {
            if(message.toLowerCase().startsWith("umletbot")){
                if(message.toLowerCase().includes("wake up")) {
                    IsBotSleeping = false;
                    bot.setPresence( {game: {name:"Feeling suicidal"}} );
                    sendMessage(channelID, "It sure is a beautiful day to get umletin'");
                }
                else sendMessage(channelID, "UmletBot is sleeping");
            }
            return;
        }

        /// BOT SPECIFIC ///
        if (message.toLowerCase().startsWith("umletbot")) {
            if (message.toLowerCase().includes("help")) return sendMessage(channelID, "Do you seriously need help with a discord bot? Pathetic.");
            if (message.toLowerCase().includes("version")) return sendMessage(channelID, "UmletBot is currently at " + version + dist + ". For changelog consult 'changelog', duh");
            if (message.toLowerCase().includes("hack")) return sendMessage(channelID, "Try me bitch");
            if (message.toLowerCase().includes("info")) return sendMessage(channelID, "I'm a Passive-Aggresive Discord bot, with some mental issues");
            if (message.toLowerCase().includes("sleep") && userID == 249633655100669952) {
                bot.setPresence( {game: {name:"Sleeping"}} );
                IsBotSleeping = true;
                return sendMessage(channelID, ":zzz:");
            }
            if (message.toLowerCase().includes("changelog")) {
                fs.readFile('changelog', 'utf8', function(err, chlog) {
                    if (err) throw err;
                    sendMessage(channelID, chlog);
                });
                return;
            }
        }

        /// --DEFAULT-- ///
        if (message.toLowerCase().includes("umlet")) return sendMessage(channelID, rndReact);
        if (message.toLowerCase().includes("umslet")) return sendMessage(channelID, "I don't know what you mean by: " + message + ". Shall I search the web for it?");

        /// --CUSTOM-- ///
        if (message.includes(":anuna:")) return sendMessage(channelID, ":dizzy_face: :gun:");
        if (message.includes(":christel:")) return sendMessage(channelID, "This is beautiful :heart_eyes:");
        if (message.includes(":mark:")) return sendMessage(channelID, "110100100");
        if (message.includes(":antoon:")) return sendMessage(channelID, "Friendly reminder, Microsoft Office is ILLEGAL");
        if (message.includes(":ear:")) return sendMessage(channelID, "OOR");
        if (message.toLowerCase() == "f") return sendMessage(channelID, "F");
        if (message.toLowerCase().includes("cyberpunk")) return sendMessage(channelID, "Wake the fuck up Samurai, we have a city to burn.");

        /// --SCENARIO-- ///
        // These should only activate when in a specific scenario
        if (message.toLowerCase() == "x") throw "NotImplementedException()";

    } catch (err) {
        logger.warn("Bot crashed, error: " + err);
        sendMessage(channelID, "(500) My mental status caused me to crash, here's my error: " + err);
    }
});

function sendMessage(chId, botResp) {
    bot.sendMessage({
        to: chId,
        message: botResp
    });
    logger.info('UmletBot replied: ' + botResp);
}
