const PDF = require(".");
const fs = require("fs");

let dataBuffer = fs.readFileSync("./test.pdf");
PDF(dataBuffer.buffer)
	.then(function (data) {
		console.log(data);
	})
	.catch(function (err) {
		console.log("err: ", err);
	});
