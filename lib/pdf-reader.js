const pdfjs = require("./pdf.js");

const pdfReader = async (data) => {
	const document = await pdfjs.getDocument({ data });
	const pdf = await document.promise;
	const readPDFContentPromises = Array(pdf.numPages)
		.fill()
		.map(async (_, index) => {
			let pageContent = "";
			let cursorPosition;
			const page = await pdf.getPage(index + 1);
			const textContent = await page.getTextContent();
			for (let item of textContent.items) {
				const isReadingSameLine =
					cursorPosition == item.transform[5] || !cursorPosition;
				pageContent += isReadingSameLine ? item.str : "\n" + item.str;
				cursorPosition = item.transform[5];
			}
			return pageContent;
		});
	const pagesContent = await Promise.all(readPDFContentPromises);
	return pagesContent.join("");
};

module.exports = pdfReader;

function render_page(pageData) {
	//check documents https://mozilla.github.io/pdf.js/
	//ret.text = ret.text ? ret.text : "";

	let render_options = {
		//replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: false,
		//do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false,
	};

	return pageData.getTextContent(render_options).then(function (textContent) {
		let text = "";
		let lastY;
		//https://github.com/mozilla/pdf.js/issues/8963
		//https://github.com/mozilla/pdf.js/issues/2140
		//https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
		//https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3

		for (let item of textContent.items) {
			if (lastY == item.transform[5] || !lastY) {
				text += item.str;
			} else {
				text += "\n" + item.str;
			}
			lastY = item.transform[5];
		}
		// let strings = textContent.items.map((item) => item.str);
		// let text2 = strings.join("\n");
		// text2 = text2.replace(/[ ]+/gi, " ");

		return text;
	});
}

const DEFAULT_OPTIONS = {
	pagerender: render_page,
	max: 0,
	//check https://mozilla.github.io/pdf.js/getting_started/
	version: "v1.10.100",
};

async function PDF(data) {
	const document = PDFJS.getDocument(data);
	const pdf = await document.promise;
	const numberOfPages = pdf.numPages;
	const page = await pdf.getPage(18);
	console.log(page);
	const content = await page.getTextContent();
	console.log(content.items);
	let pageContent = "";
	let lastY;
	for (let item of content.items) {
		if (lastY == item.transform[5] || !lastY) {
			pageContent += item.str;
		} else {
			pageContent += "\n" + item.str;
		}
		lastY = item.transform[5];
	}
	console.log(pageContent);
	for (let i = 0; i < content.items.length; i++) {
		for (let item of content.items[i]) {
			if (lastY == item.transform[5] || !lastY) {
				pageContent += item.str;
			} else {
				pageContent += "\n" + item.str;
			}
			lastY = item.transform[5];
		}
		console.log(content.items);
	}
	let ret = {
		numpages: 0,
		numrender: 0,
		info: null,
		metadata: null,
		text: "",
		version: null,
	};
	if (typeof options == "undefined") options = DEFAULT_OPTIONS;
	if (typeof options.pagerender != "function")
		options.pagerender = DEFAULT_OPTIONS.pagerender;
	if (typeof options.max != "number") options.max = DEFAULT_OPTIONS.max;
	if (typeof options.version != "string")
		options.version = DEFAULT_OPTIONS.version;
	if (options.version == "default") options.version = DEFAULT_OPTIONS.version;

	ret.version = PDFJS.version;

	// Disable workers to avoid yet another cross-origin issue (workers need
	// the URL of the script to be loaded, and dynamically loading a cross-origin
	// script does not work).
	PDFJS.disableWorker = true;
	let doc = await PDFJS.getDocument(dataBuffer);
	ret.numpages = doc.numPages;

	let metaData = await doc.getMetadata().catch(function (err) {
		return null;
	});

	ret.info = metaData ? metaData.info : null;
	ret.metadata = metaData ? metaData.metadata : null;

	let counter = options.max <= 0 ? doc.numPages : options.max;
	counter = counter > doc.numPages ? doc.numPages : counter;

	ret.text = "";

	for (var i = 1; i <= counter; i++) {
		let pageText = await doc
			.getPage(i)
			.then((pageData) => {
				return options.pagerender(pageData);
			})
			.catch((err) => {
				// todo log err using debug
				debugger;
				return "";
			});
		ret.text = `${ret.text}\n\n${pageText}`;
	}

	ret.numrender = counter;
	doc.destroy();

	return ret;
}
