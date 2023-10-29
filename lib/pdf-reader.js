const pdfjs = require("./v1.10.100/build/pdf.js");

/**
 * Converts a PDF file data buffer into text content.
 *
 * @param {Buffer} pdfDataBuffer - The data buffer containing the PDF file.
 * @return {Promise<string>} A promise that resolves to the text content extracted from the PDF.
 * @throws {Error} If there is an issue parsing or extracting text from the PDF.
 */
const pdfReader = async (data, returnAsArray) => {
	const document = await pdfjs.getDocument({ data });
	const readPDFContentPromises = Array(document.numPages)
		.fill()
		.map(async (_, index) => {
			let pageContent = "";
			let cursorPosition;
			const page = await document.getPage(index + 1);
			const textContent = await page.getTextContent();
			for (let item of textContent.items) {
				const isReadingSameLine =
					cursorPosition == item.transform[5] || !cursorPosition;
				pageContent += isReadingSameLine
					? item.str + " "
					: "\n" + item.str + " ";
				cursorPosition = item.transform[5];
			}
			return pageContent;
		});
	const pagesContent = await Promise.all(readPDFContentPromises);
	if (returnAsArray) {
		return pagesContent;
	}
	return pagesContent.join("");
};

module.exports = pdfReader;
