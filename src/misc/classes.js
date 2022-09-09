const fs = require("fs");
const { resourceJSON } = require("../updatedresources.json");
const { members } = require("../updatedinfo.json");
const { sessions } = require("../updatedsessions.json");

let year = 2022;
class Student { // currently I do not need to use this class on its own but it is useful to have in the future
    constructor(name, gradYear, email, phoneNo, ID) {
        this.name = name;
        this.gradYear = gradYear;
        this.email = email;
        this.phone = phoneNo;
        this.id = ID;
    }
}


class Member extends Student {
    // had to use class1 instead of class because it's a reserved word
    constructor(name, class1, email, phoneNo, ID, pizza) {
        super(name, 6-class1.substr(0,1)+year, email, phoneNo, ID);
        this.class = class1;
        this.pizza = pizza;
    }

    add(value) {
        this.pizza += value;
    }
}

class Resource {
    constructor(link, date, type) {
        this.link = link;
        this.date = new Date(date);
        this.type = type;
    }

    embedLink() {
        return `[${this.type}](${this.link})`;
    }

    toJSON() {
        return `{ "link": "${this.link}", "date": "${this.date.toISOString().slice(0, 10)}", "type": "${this.type}" }`;
    }
}

class Resources {
    constructor(resourceArr) {
        resourceArr.sort(function(x, y) { // custom sort :D
            return - Date.parse(x["date"]) + Date.parse(y["date"]);
        });
        resourceArr.forEach(createObj);
        function createObj(value, index) {
            resourceArr[index] = new Resource(value["link"], value["date"], value["type"]);
        }
        this.arr = resourceArr;
    }

    toString(subjects) { // converts the objects into a string
        let stringOut = "";
 
        for (let i = 0; i < this.arr.length; i++) {
            if (!subjects.includes(sessions[this.arr[i]["date"].toISOString().slice(0,10)]["subject"]) && subjects.length != 0) continue;
            if ( i == 0 || this.arr[i]["date"].toISOString() != this.arr[i-1]["date"].toISOString()) {
                stringOut = stringOut.concat(`\n**${sessions[this.arr[i]["date"].toISOString().slice(0,10)]["title"]} (${sessions[this.arr[i]["date"].toISOString().slice(0,10)]["subject"]})** *(<t:${Math.round(this.arr[i]["date"].getTime()/1000)}:D>)*\n`);

            }
            stringOut = stringOut.concat(this.arr[i].embedLink() + '\n');
        }
        return stringOut;
    }

}


const memberObj = {};
for (let i = 0; i < members.length; i++) {
    memberObj[members[i]["ID"]] = new Member(members[i]["Name"], members[i]["Class"], members[i]["Email"], members[i]["phoneNo"], members[i]["ID"], members[i]["pizza"]);
} // convert JSON into JS object



// ignore this, its for setting up purposes
// let memberJSON = {};
// for (let i = 0; i < members.length; i++) {
//     memberJSON[members[i]["Email"].toLowerCase()] = members[i];
// }
// fs.writeFileSync('members.json', JSON.stringify(memberJSON));

module.exports = {
    Student: Student,
    Member: Member,
    memberObj: memberObj,
    Resource: Resource,
    Resources: Resources
}