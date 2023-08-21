const PDF = require("./");
const fs = require("fs");

let dataBuffer = fs.readFileSync("./test/data/test3.pdf");
PDF(dataBuffer)
	.then(function (data) {
		console.log(data.text);
	})
	.catch(function (err) {
		console.log("err: ", err);
	});
