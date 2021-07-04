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

// for ease of assigning fonts
const arabic = "NotoSansArabic";
const english = "Roboto";

const shortEnglish = "The man and his dog";
const mediumEnglish = "The man and his dog and his cat";
const longEnglish =
	"The man and his dog and his cat and his snake went for a really long walk to ensure that they started a new line";
const longEnglishWithPunctuation =
	"The man, [his] dog: his cat! and his (snake) went {} for a really <long> walk to /ensure? that ...they started a new line";
const longEnglishWithNewlines =
	"The man and his dog and his cat\nand his snake went for a really long walk\nto test out newlines";
// All arabic sentences generated by using google translate on the corresponding english sentences
// A space is then manually added to the RHS of the string - required for current way that BIDI is
// implemented to avoid word order problems

const shortArabic = "الرجل وكلبه ";
const mediumArabic = "الرجل وكلبه وقطته ";
const longArabic =
	"ذهب الرجل وكلبه وقطته وثعبانه في نزهة طويلة حقًا للتأكد من أنهم بدأوا خطًا جديدًا ";
const longArabicWithPunctuation =
	"الرجل كلبه: قطه! وذهب (الأفعى) {} في نزهة <طويلة> حقًا من أجل / ضمان؟ أن ... بدأوا سطرًا جديدًا ";
const longArabicWithNewlines =
	"الرجل وكلبه وقطته \nوذهب ثعبانه في نزهة طويلة حقًا \nلاختبار الخطوط الجديدة ";

let testCounter = 0;
const generateTestHeader = (string) => {
	return { text: string, fontSize: 16 };
};
const generateTestString = (string) => {
	return { text: `Test ${testCounter++}: ${string}` };
};

// accepts an array of arrays [string, language]
const generateInlineRtlTest = (stringsAndLanguages = []) => {
	const nestedTextArray = [];
	stringsAndLanguages.forEach(([string, language]) => {
		nestedTextArray.push({
			text: string,
			font: language,
			inlineRtl: language === arabic,
		});
	});
	return {
		text: nestedTextArray,
	};
};
const generateRtlTest = (string, font = "Roboto") => {
	return { text: string, font, rtl: font === arabic };
};
const newline = () => {
	return { text: "\n" };
};

const ARABIC_TESTS = [
	generateTestString("Short line"),
	generateInlineRtlTest([[shortArabic, arabic]]),
	generateRtlTest(shortArabic, arabic),
	newline(),
	generateTestString("Medium line"),
	generateInlineRtlTest([[mediumArabic, arabic]]),
	generateRtlTest(mediumArabic, arabic),
	newline(),
	generateTestString("Long line"),
	generateInlineRtlTest([[longArabic, arabic]]),
	generateRtlTest(longArabic, arabic),
	newline(),
	generateTestString("Long line plus punctuation"),
	generateInlineRtlTest([[longArabicWithPunctuation, arabic]]),
	generateRtlTest(longArabicWithPunctuation, arabic),
	newline(),
	generateTestString("Long line with newline characters"),
	generateInlineRtlTest([[longArabicWithNewlines, arabic]]),
	generateRtlTest(longArabicWithNewlines, arabic),
	newline(),
];

const ENGLISH_ARABIC_TESTS = [
	generateTestString("Short"),
	// NB have to manually add end of line spaces here
	generateInlineRtlTest([
		[shortEnglish + " ", english],
		[shortArabic, arabic],
	]),
	generateRtlTest(shortArabic, arabic),
	newline(),
	generateTestString("Medium"),
	generateInlineRtlTest([
		[mediumEnglish + " ", english],
		[mediumArabic, arabic],
	]),
	generateRtlTest(mediumArabic, arabic),
	newline(),
	generateTestString("Long (english line-break)"),
	generateInlineRtlTest([
		[longEnglish + " ", english],
		[longArabic, arabic],
	]),
	generateRtlTest(longArabic, arabic),
	newline(),
	generateTestString("Medium-long (arabic line-break)"),
	generateInlineRtlTest([
		[mediumEnglish + " ", english],
		[longArabic, arabic],
	]),
	generateRtlTest(longArabic, arabic),
	newline(),
	generateTestString("Medium-long 2 (arabic line-break)"),
	generateInlineRtlTest([
		[mediumEnglish + " some nonsense for spacing ", english],
		[longArabic, arabic],
	]),
	generateRtlTest(longArabic, arabic),
	newline(),
];

const ARABIC_ENGLISH_TESTS = [
	generateTestString("Short"),
	// NB have to manually add spaces here prior to the english string
	generateInlineRtlTest([
		[shortArabic, arabic],
		[" " + shortEnglish + " ", english],
	]),
	generateRtlTest(shortArabic, arabic),
	newline(),
	generateTestString("Medium"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[" " + mediumEnglish, english],
	]),
	generateRtlTest(mediumArabic, arabic),
	newline(),
	generateTestString("Long (english line-break)"),
	generateInlineRtlTest([
		[longArabic, arabic],
		[" " + longEnglish, english],
	]),
	generateRtlTest(longArabic, arabic),
	newline(),
	generateTestString(
		"Double long (arabic line-break), nb this entire first line reads right to left"
	),
	generateInlineRtlTest([
		[longArabic, arabic],
		[longArabic, arabic],
		[" " + mediumEnglish, english],
	]),
	generateRtlTest(longArabic, arabic),
	newline(),
];

const ENGLISH_ARABIC_ENGLISH_TESTS = [
	generateTestString("Short"),
	// NB have to manually add end of line spaces here
	generateInlineRtlTest([
		[shortEnglish + " ", english],
		[shortArabic, arabic],
		[" " + shortEnglish, english],
	]),
	generateRtlTest(shortArabic, arabic),
	newline(),
	generateTestString("Medium"),
	generateInlineRtlTest([
		[mediumEnglish + " ", english],
		[mediumArabic, arabic],
		[" " + mediumEnglish, english],
	]),
	generateRtlTest(mediumArabic, arabic),
	newline(),
	generateTestString("Long (english line-break)"),
	generateInlineRtlTest([
		[longEnglish + " ", english],
		[longArabic, arabic],
		[" " + longEnglish, english],
	]),
	generateRtlTest(longArabic, arabic),
	generateTestString("Long (arabic line-break)"),
	generateInlineRtlTest([
		[
			longEnglish + " some more words to generate an arabic line break ",
			english,
		],
		[longArabic, arabic],
		[" " + longEnglish, english],
	]),
	generateRtlTest(longArabic, arabic),
];

const ARABIC_ENGLISH_ARABIC_TESTS = [
	generateTestString("Short"),
	// NB have to manually add spaces here prior to the english string
	generateInlineRtlTest([
		[shortArabic, arabic],
		[" " + shortEnglish + " ", english],
		[shortArabic, arabic],
	]),
	generateRtlTest(shortArabic, arabic),
	newline(),
	generateTestString("Medium"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[" " + mediumEnglish + " ", english],
		[mediumArabic, arabic],
	]),
	generateRtlTest(mediumArabic, arabic),
	newline(),
	generateTestString("Long (english line-break)"),
	generateInlineRtlTest([
		[longArabic, arabic],
		[" " + longEnglish + " ", english],
		[longArabic, arabic],
	]),
	generateRtlTest(longArabic, arabic),
	newline(),
	generateTestString(
		"Double long (arabic line-break), nb this entire first line reads right to left"
	),
	generateInlineRtlTest([
		[longArabic, arabic],
		[" " + mediumEnglish + " ", english],
		[longArabic, arabic],
	]),
	generateRtlTest(longArabic, arabic),
	newline(),
];

const MIXED_TESTS = [
	generateTestString("mix of strings, arabic order long, medium, short"),
	generateInlineRtlTest([
		[mediumEnglish + " ", english],
		[longArabic, arabic],
		[" " + shortEnglish + " ", english],
		[mediumArabic, arabic],
		[" " + mediumEnglish + " ", english],
		[shortArabic, arabic],
	]),
	generateRtlTest(longArabic, arabic),
	generateRtlTest(mediumArabic, arabic),
	generateRtlTest(shortArabic, arabic),
];

var docDefinition = {
	content: [
		generateTestHeader(
			"ARABIC ONLY: inlineRtl (left justified) FOLLOWED BY rtl (right justified)"
		),
		...ARABIC_TESTS,
		generateTestHeader(
			"ARABIC-ENGLISH-MIX: inlineRtl FOLLOWED BY rtl (right justified) to allow checking of arabic"
		),
		generateTestHeader("ENGLISH-ARABIC"),
		...ENGLISH_ARABIC_TESTS,
		generateTestHeader("ARABIC-ENGLISH"),
		...ARABIC_ENGLISH_TESTS,
		generateTestHeader("ENGLISH-ARABIC-ENGLISH"),
		...ENGLISH_ARABIC_ENGLISH_TESTS,
		generateTestHeader("ARABIC-ENGLISH-ARABIC"),
		...ARABIC_ENGLISH_ARABIC_TESTS,
		generateTestHeader("MIXED TESTS"),
		...MIXED_TESTS,
	],
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("examples/pdfs/arabic-tests.pdf"));
pdfDoc.end();
