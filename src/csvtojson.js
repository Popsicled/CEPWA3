const fs = require("fs");
const { parse } = require("csv-parse");

const data = [];

fs.createReadStream("info.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // push the object row into the array
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    // log the result array
    console.log("parsed csv data:");
    console.log(data);
  });
