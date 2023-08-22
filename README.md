# pdf-parse-fork

**Pure javascript cross-platform module to extract texts from PDFs.**

## Why?

This project is based on [pdf-parse](https://gitlab.com/autokent/pdf-parse), which worked fine for me during development, but I've found some problems to run it in production, specially when I tried to use it with AWS's Lambda functions.

The project import's and use the [Mozilla's PDF.js](https://mozilla.github.io/pdf.js/) library on it's latest version.

## Installation

This package isn't in npm's registry since my intetion with this fork was very specific. But, if you want to try it out, you can install it directly from this repository.

To install this library, just add the following line into your **package.json**'s dependencies section:

```js
...
"pdf-parse": "https://github.com/steniowagner/pdf-parse-fork/tarball/<branch|commit>"
...
```

**You can install it directly from a specific branch or choose a specific commit (but I suggest you to always grab the latest commit, though).**

And then, just reinstall your dependencies. That's it!

## Usage

```js
const parsePdf = require("pdf-parse");
const fs = require("fs");

const dataBuffer = fs.readFileSync("path-to-your-pdf-file");

parsePdf(dataBuffer.buffer)
	.then(function (data) {
		// pdf's text content
		console.log(data);
	})
	.catch(function (err) {
		// some error
		console.log(err);
	});
```

## License

[MIT licensed](https://gitlab.com/autokent/pdf-parse/blob/master/LICENSE) and all it's dependencies are MIT or BSD licensed.
