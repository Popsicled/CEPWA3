const fs = require("fs");
const { members } = require("../updatedinfo.json");

let year = 2022;
class Student {
    constructor(name, gradYear, email, phoneNo, ID) {
        this.name = name;
        this.gradYear = gradYear;
        this.email = email;
        this.phone = phoneNo;
        this.id = ID;
    }
    access(param) {
        return this.fetch(param);
    }
    access(param,value) {
        this.edit(param,value);
    }
    fetch(param) {
        param = param.toLowerCase();
        if (param == "name") {
            return this.name;
        } else if (param == "year") {
            return this.year;
        } else if (param == "email") {
            return this.email;
        } else if (param == "phone") {
            return this.phone;
        } else if (param == "id") {
            return this.id;
        } else {
            return -1; //invalid
        }
    }
    edit(param, value) {
        param = param.toLowerCase();
        if (param == "name") {
            this.name = value;
        } else if (param == "year") {
            this.year = value;
        } else if (param == "email") {
            this.email = value;
        } else if (param == "phone") {
            this.phone = value;
        } else if (param == "id") {
            this.id = value;
        } else {
            return -1; //invalid
        }
    }
}


class Member extends Student {
    constructor(name, class1, email, phoneNo, ID, pizza) {
        super(name, 6-class1.substr(0,1)+year, email, phoneNo, ID);
        this.class = class1;
        this.pizza = pizza;
    }

    access(param) {
        if (param == "class") {
            return this.class1;
        } else if (param == "pizza") {
            return this.pizza;
        } else {
            return this.fetch(param);
        }
    }

    access(param, value) {
        if (param == "class") {
            this.class1 = value;
        } else if (param == "pizza") {
            this.pizza = value;
        } else {
            this.edit(param, value);
        }
    }

    add(value) {
        this.pizza += value;
    }
}

class Resource {
    constructor(date, type) {
        this.date = date;
        this.type = type;
    }

}


memberObj = {};
for (let i = 0; i < members.length; i++) {
    memberObj[members[i]["ID"]] = new Member(members[i]["Name"], members[i]["Class"], members[i]["Email"], members[i]["phoneNo"], members[i]["ID"], members[i]["pizza"]);
}



// let memberJSON = {};
// for (let i = 0; i < members.length; i++) {
//     memberJSON[members[i]["Email"].toLowerCase()] = members[i];
// }
// fs.writeFileSync('members.json', JSON.stringify(memberJSON));

module.exports = {
    Student: Student,
    Member: Member,
    memberObj: memberObj
}