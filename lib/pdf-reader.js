const pdfjs = require("./pdf.js");

/**
 * Converts a PDF file data buffer into text content.
 *
 * @param {Uint8Array} pdfDataBuffer - The data buffer containing the PDF file.
 * @return {Promise<string>} A promise that resolves to the text content extracted from the PDF.
 * @throws {Error} If there is an issue parsing or extracting text from the PDF.
 */
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
