var fonts = {
	NotoSansArabic: {
		normal: "examples/fonts/NotoSansEnglishArabic-reg.ttf",
		bold: "examples/fonts/NotoSansEnglishArabic-Bold.ttf",
		italics: "examples/fonts/NotoSansEnglishArabic-reg.ttf",
		bolditalics: "examples/fonts/NotoSansEnglishArabic-Bold.ttf",
	},
	Roboto: {
		normal: "examples/fonts/Roboto-Regular.ttf",
		bold: "examples/fonts/Roboto-Medium.ttf",
		italics: "examples/fonts/Roboto-Italic.ttf",
		bolditalics: "examples/fonts/Roboto-MediumItalic.ttf",
	},
};

var PdfPrinter = require("../src/printer");
var printer = new PdfPrinter(fonts);
var fs = require("fs");

const shortArabic = "ثلاث كلمات في "; // <<<--- needs space at the end
const mediumArabic = "ستكون هذه جملة عربية معقولة ";

var docDefinition = {
	content: [
		{
			text: [
				{ text: "Short phrase " },
				{ text: shortArabic, font: "NotoSansArabic", inlineRtl: true },
				" followed by english to test it breaking over the line ", // <<<--- may need to prepend a space here in UI,
				{ text: mediumArabic, font: "NotoSansArabic", inlineRtl: true },
				" and being followed by english too",
			],
			fontSize: 14,
		},
		{
			text: shortArabic,
			font: "NotoSansArabic",
			rtl: true,
		},
		{
			text: mediumArabic,
			font: "NotoSansArabic",
			rtl: true,
		},
	],
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("examples/pdfs/arabic-tests.pdf"));
pdfDoc.end();
