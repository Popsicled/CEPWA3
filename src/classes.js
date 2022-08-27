const fs = require("fs");

let year = 2022;
class Student {
    constructor(name, gradYear, email, phoneNo, ID) {
        this.name = name;
        this.gradYear = gradYear;
        this.email = email;
        this.phone = phoneNo;
        this.id = ID;
    }
    edit(param, value) {
        
    }
    attendance(time) {

    }
}

class Member extends Student {
    constructor(name, class1, email, phoneNo, ID) {
        super(name, 6-class1.substr(0,1)+year, email, phoneNo, ID);
        this.class1 = class1;
    }
}