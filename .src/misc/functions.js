const { ActionRowBuilder, ButtonBuilder, Message} = require("discord.js");
const fs = require("fs");

const isEXCO = (interaction, user) => interaction.client.guilds.cache.get("861574538823335936").members.cache.has(user.id) && interaction.client.guilds.cache.get("861574538823335936").members.cache.get(user.id).roles.cache.has("861588427907399692");

function buttonrow() { // a quick way to create an actionrow with buttons!
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

function writeJSON(object) { // writes the object to a JSON file to be saved
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

const isDeleted = (reason) => ["messageDelete", "messageDeleteBulk", "channelDelete", "guildDelete"].includes(reason) // prevents api call when message is deleted, ending the messageInteractionCollector

module.exports = {
    isEXCO: isEXCO,
    buttonrow: buttonrow,
    writeJSON: writeJSON,
    isDeleted: isDeleted
}