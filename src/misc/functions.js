const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { Resource, Resources } = require('./classes.js');
const fs = require("fs");

const isEXCO = (interaction, user) => interaction.client.guilds.cache.get("861574538823335936").members.cache.has(user.id) && interaction.client.guilds.cache.get("861574538823335936").members.cache.get(user.id).roles.cache.has("861588427907399692");

// a quick way to create an actionrow with buttons!
function buttonrow() {
    let row = new ActionRowBuilder();
    for (let i = 0; i < arguments.length; i++) {
        let newcomp = new ButtonBuilder().setCustomId(arguments[i]["id"]).setLabel(arguments[i]["label"]).setStyle(arguments[i]["style"]);
        if (arguments[i]["disabled"] === undefined) {
            row.addComponents(newcomp);
        } else {
            row.addComponents(newcomp.setDisabled(true));
        }
    }
    return row;
}

// writes the object to a JSON file to be saved
function writememberJSON(object) { 
    let objectJSON = [];
    let membersJSON = {};
    for (const property in object) {
        objectJSON.push({ "Name": object[property]["name"], "Class": object[property]["class"], "Email": object[property]["email"], "phoneNo": object[property]["phone"], "ID": object[property]["id"], "pizza": object[property]["pizza"]});
        membersJSON[object[property]["email"].toLowerCase()] = { "Name": object[property]["name"], "Class": object[property]["class"], "Email": object[property]["email"], "phoneNo": object[property]["phone"], "ID": object[property]["id"], "pizza": object[property]["pizza"]};
    }
    try {
        fs.writeFileSync('./updatedinfo.json', `{ "members": ${JSON.stringify(objectJSON)} }`);
        fs.writeFileSync('./info_members.json', `{ "membersEmail": ${JSON.stringify(membersJSON)} }`);
    } catch (err) {
        console.log(err);
    }
}

// writes the resource object into a JSON
function writeresourceJSON(resources) { 
    let resourceJSON = [];
    console.log(resources.arr);
    resources.arr.forEach(pushintoJSON);

    function pushintoJSON(value) {
        resourceJSON.push(JSON.parse(value.toJSON()));
        console.log(resourceJSON);
    }
    try {
        fs.writeFileSync('./updatedresources.json', `{ "resourceJSON": ${JSON.stringify(resourceJSON)} }`);
    } catch (err) {
        console.log(err);
    }
}

// checks if a string is a ISO date (more specifically one that only specifies the day, without the time)
function isISOdate(str) {
    // regex that makes sure the date is in the correct format
    if (!/\d{4}-\d{2}-\d{2}/.test(str) || !str.length == 10) return false;
    const d = new Date(str);
    // a few more checks to make sure it is valid
    return d instanceof Date && !isNaN(d) && d.toISOString().slice(0,10)===str;

}

// prevents api call when message is deleted, ending the messageInteractionCollector
const isDeleted = (reason) => ["messageDelete", "messageDeleteBulk", "channelDelete", "guildDelete"].includes(reason) 

module.exports = {
    isEXCO: isEXCO,
    buttonrow: buttonrow,
    writememberJSON: writememberJSON,
    writeresourceJSON: writeresourceJSON,
    isDeleted: isDeleted,
    isISOdate: isISOdate
}