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
