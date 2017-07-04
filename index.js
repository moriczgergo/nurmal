const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
var fs = require('fs');
const uconfig = "users.json";
var parser = require('rss-parser');
var weather = require('yahoo-weather');

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === 'Hello' || message.content === 'Hello!' || message.content === 'hello' || message.content === 'hello!' || message.content === 'Hi' || message.content === 'Hi!' || message.content === 'hi' || message.content === 'hi!' || message.content === 'Hey' || message.content === 'Hey!' || message.content === 'hey' || message.content === 'hey!') {
        if (message.channel.type == "dm"){
            var userData = JSON.parse(fs.readFileSync(uconfig, "UTF-8"));
            if (typeof userData[message.author.id.toString()] == undefined){
                parser.parseURL('https://news.google.com/news?output=rss', function(err, parsed) {
                    message.channel.send("Hello! Here are today's hot topics:");
                    parsed.feed.entries.forEach(function(entry) {
                        message.channel.send({embed: {
                            title: entry.title,
                            url: entry.link
                        }});
                        console.dir(entry);
                    });
                    if (typeof userData[message.author.id.toString()] == undefined){
                        message.channel.send("I don't know where you live! Please send me a command like this: `!info city:temperaturescale`. Example: `!info paris:c` or `!info phoenix:f`");
                    } else {
                        var args = userData[message.author.id.toString()].split(":");
                        weather(args[0], args[1]).then(info => {
                            message.channel.send("It's " + info.item.condition.temp + " degrees outside and it's " + info.item.condition.text + ".\nThe sunrise is at " + info.astronomy.sunrise.toUpperCase() + ", and the sunset is at " + info.astronomy.sunset.toUpperCase() + ".\nThe wind is blowing at " + info.wind.speed + " " + info.units.speed + ".\nThe humidity is at " + info.atmosphere.humidity + "%.")
                            message.channel.send("Have a great day!");
                        });
                    }
                })
            } else {
                parser.parseURL('https://news.google.com/news?output=rss&geo=' + userData[message.author.id.toString()].split(":")[0], function(err, parsed) {
                    message.channel.send("Hello! Here are today's hot topics:");
                    parsed.feed.entries.forEach(function(entry) {
                        message.channel.send({embed: {
                            title: entry.title,
                            url: entry.link
                        }});
                        console.dir(entry);
                    });
                    if (typeof userData[message.author.id.toString()] == undefined){
                        message.channel.send("I don't know where you live! Please send me a command like this: `!info city:temperaturescale`. Example: `!info paris:c` or `!info phoenix:f`");
                    } else {
                        var args = userData[message.author.id.toString()].split(":");
                        weather(args[0], args[1]).then(info => {
                            message.channel.send("It's " + info.item.condition.temp + " degrees outside and it's " + info.item.condition.text + ".\nThe sunrise is at " + info.astronomy.sunrise.toUpperCase() + ", and the sunset is at " + info.astronomy.sunset.toUpperCase() + ".\nThe wind is blowing at " + info.wind.speed + " " + info.units.speed + ".\nThe humidity is at " + info.atmosphere.humidity + "%.")
                            message.channel.send("Have a great day!");
                        });
                    }
                })
            }
        }
    } else if (message.content.startsWith("!info ")){
        var args = message.content.substr("!info ".length).split(":");
        if (args.length == 2){
            var userData = JSON.parse(fs.readFileSync(uconfig, "UTF-8"));
            userData[message.author.id.toString()] = message.content.substr("!info ".length);
            fs.writeFileSync(uconfig, JSON.stringify(userData), "UTF-8");
            message.channel.send("Got it!");
        } else {
            message.channel.send("Invalid command! Example: `!info phoenix:f`");
        }
    }
});

client.login(config.token);