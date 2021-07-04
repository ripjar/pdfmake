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
var mediumArabic = "ستكون هذه جملة عربية معقولة";

var RLE = String.fromCodePoint();

var docDefinition = {
	content: [
		{
			text: [
				{ text: "Short phrase " },
				{ text: shortArabic, font: "NotoSansArabic", inlineRtl: true },
				" followed by english",
			],
		},
		{
			text: shortArabic,
			font: "NotoSansArabic",
			rtl: true,
		},
	],
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("examples/pdfs/basics.pdf"));
pdfDoc.end();
