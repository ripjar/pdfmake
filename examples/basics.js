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

var RLE = String.fromCodePoint();

var docDefinition = {
	content: [
		{
			text: [
				{ text: "First paragraph " },
				{ text: "some arabic next " },
				{ text: "ثلاث كلمات في ", font: "NotoSansArabic", rtl: true },
				" Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines",
				{
					stack: [{ text: "ثلاث كلمات في ", font: "NotoSansArabic" }],
					rtl: true,
				},
			],
		},
		{
			text: "ثلاث كلمات في ",
			font: "NotoSansArabic",
			rtl: true,
		},
	],
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("examples/pdfs/basics.pdf"));
pdfDoc.end();
