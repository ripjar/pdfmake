var fonts = {
	NotoSansRTL: {
		normal: "examples/fonts/NotoSansRTL-Regular.ttf",
		bold: "examples/fonts/NotoSansRTL-Bold.ttf",
		italics: "examples/fonts/NotoSansRTL-Regular.ttf",
		bolditalics: "examples/fonts/NotoSansRTL-Bold.ttf",
	},
	Roboto: {
		normal: "examples/fonts/Roboto-Regular.ttf",
		bold: "examples/fonts/Roboto-Medium.ttf",
		italics: "examples/fonts/Roboto-Italic.ttf",
		bolditalics: "examples/fonts/Roboto-MediumItalic.ttf",
	},
	NotoSansCJK: {
		normal: "examples/fonts/NotoSansCJKtc-Regular.ttf",
		bold: "examples/fonts/NotoSansCJKtc-Bold.ttf",
		italics: "examples/fonts/NotoSansCJKtc-Regular.ttf",
		bolditalics: "examples/fonts/NotoSansCJKtc-Bold.ttf",
	},
	// bangla
	NotoSansBengali: {
		normal: "examples/fonts/NotoSansBengaliEnglish-Regular.ttf",
		bold: "examples/fonts/NotoSansBengaliEnglish-Bold.ttf",
		italics: "examples/fonts/NotoSansBengaliEnglish-Regular.ttf",
		bolditalics: "examples/fonts/NotoSansBengaliEnglish-Bold.ttf",
	},
	// hindi
	NotoSansDevanagari: {
		normal: "examples/fonts/NotoSansDevanagariEnglish-Regular.ttf",
		bold: "examples/fonts/NotoSansDevanagariEnglish-Bold.ttf",
		italics: "examples/fonts/NotoSansDevanagariEnglish-Regular.ttf",
		bolditalics: "examples/fonts/NotoSansDevanagariEnglish-Bold.ttf",
	},
	// burmese
	NotoSansMyanmar: {
		normal: "examples/fonts/NotoSansMyanmarEnglish-Regular.ttf",
		bold: "examples/fonts/NotoSansMyanmarEnglish-Bold.ttf",
		italics: "examples/fonts/NotoSansMyanmarEnglish-Regular.ttf",
		bolditalics: "examples/fonts/NotoSansMyanmarEnglish-Bold.ttf",
	},
};

var PdfPrinter = require("../src/printer");
var printer = new PdfPrinter(fonts);
var fs = require("fs");

// for ease of assigning fonts
const hebrew = "NotoSansRTL";
const arabic = "NotoSansRTL";
const bangla = "NotoSansBengali";
const hindi = "NotoSansDevanagari";
const burmese = "NotoSansMyanmar";
const cjk = "NotoSansCJK";
const rtl = "NotoSansRTL";
const english = "Roboto";

// ARABIC
const shortArabic = "الرجل وكلبه ";
const mediumArabic = "الرجل وكلبه وقطته ";
const longArabic =
	"ذهب الرجل وكلبه وقطته وثعبانه في نزهة طويلة حقًا للتأكد من أنهم بدأوا خطًا جديدًا ";

// HEBREW
const shortHebrew = "האיש וכלבו ";
const mediumHebrew = "האיש וכלבו והחתול שלו ";
const longHebrew =
	"האיש וכלבו והחתול שלו והנחש שלו יצאו לטיול ממש ארוך כדי להבטיח שהם מתחילים קו חדש ";

// OTHER LTR SCRIPTS
const mediumBangla = "লোকটি এবং তার কুকুর এবং তার বিড়াল";
const mediumChinese = "男人和他的狗和他的猫";
const mediumJapanese = "男と彼の犬と彼の猫";
const mediumKorean = "남자와 그의 개와 그의 고양이";
const mediumHindi = "आदमी और उसका कुत्ता और उसकी बिल्ली";
const mediumBurmese = "လူနှင့်သူ၏ခွေးနှင့်သူ၏ကြောင်";

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
	stringsAndLanguages.forEach(([string, language], i) => {
		let displayString = string;
		// from the UI we're expecting to get space separated chunks of
		// inline text, so this adds a space to all strings apart from first and
		// last
		if (i !== stringsAndLanguages.length - 1) {
			displayString += " ";
		}
		nestedTextArray.push({
			text: displayString,
			font: language,
			inlineRtl: language === rtl,
		});
	});
	return {
		text: nestedTextArray,
	};
};
const generateRtlTest = (string, font = "Roboto") => {
	return { text: string, font, rtl: font === rtl };
};
const newline = () => {
	return { text: "\n" };
};

const commentFromDigestPdfExport = [
	{
		text: [
			{
				text: [
					{
						text: "KYC - Admin\n",
						font: "Roboto",
						style: "commentUser",
						inlineRtl: false,
					},
				],
			},
			{ text: "05 Jul 2021 at 4:21 PM\n", style: "commentTimestamp" },
			{
				text: [
					{
						text: "Some english then ",
						font: "Roboto",
						style: "",
						inlineRtl: false,
					},
					{
						text: "قليلا من العربية ",
						font: "NotoSansRTL",
						style: "",
						inlineRtl: true,
					},
					{
						text: "and more",
						font: "Roboto",
						style: "",
						inlineRtl: false,
					},
				],
			},
			{ text: "\n\n" },
		],
	},
];

const ARABIC_TESTS = [
	generateTestString(
		"Arabic sentence used throughout, inline rtl vs article-type rtl"
	),
	generateInlineRtlTest([[mediumArabic, arabic]]),
	generateRtlTest(mediumArabic, arabic),
	newline(),
	generateTestString("Arabic-Chinese"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[mediumChinese, cjk],
		[mediumArabic, arabic],
		[mediumChinese, cjk],
	]),
	newline(),
	generateTestString("Arabic-Japanese"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[mediumJapanese, cjk],
		[mediumArabic, arabic],
		[mediumJapanese, cjk],
	]),
	newline(),
	generateTestString("Arabic-Korean"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[mediumKorean, cjk],
		[mediumArabic, arabic],
		[mediumKorean, cjk],
	]),
	newline(),
	generateTestString("Arabic-Bangla"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[mediumBangla, bangla],
		[mediumArabic, arabic],
		[mediumBangla, bangla],
	]),
	newline(),
	generateTestString("Arabic-Hindi"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[mediumHindi, hindi],
		[mediumArabic, arabic],
		[mediumHindi, hindi],
	]),
	newline(),
	generateTestString("Arabic-Burmese"),
	generateInlineRtlTest([
		[mediumArabic, arabic],
		[mediumBurmese, burmese],
		[mediumArabic, arabic],
		[mediumBurmese, burmese],
	]),
	newline(),
];

const HEBREW_TESTS = [
	generateTestString(
		"Hebrew sentence used throughout, inline rtl vs article-type rtl"
	),
	generateInlineRtlTest([[mediumHebrew, hebrew]]),
	generateRtlTest(mediumHebrew, hebrew),
	newline(),
	generateTestString("Hebrew-Chinese"),
	generateInlineRtlTest([
		[mediumHebrew, hebrew],
		[mediumChinese, cjk],
		[mediumHebrew, hebrew],
		[mediumChinese, cjk],
	]),
	newline(),
	generateTestString("Hebrew-Japanese"),
	generateInlineRtlTest([
		[mediumHebrew, hebrew],
		[mediumJapanese, cjk],
		[mediumHebrew, hebrew],
		[mediumJapanese, cjk],
	]),
	newline(),
	generateTestString("Hebrew-Korean"),
	generateInlineRtlTest([
		[mediumHebrew, hebrew],
		[mediumKorean, cjk],
		[mediumHebrew, hebrew],
		[mediumKorean, cjk],
	]),
	newline(),
	generateTestString("Hebrew-Bangla"),
	generateInlineRtlTest([
		[mediumHebrew, hebrew],
		[mediumBangla, bangla],
		[mediumHebrew, hebrew],
		[mediumBangla, bangla],
	]),
	newline(),
	generateTestString("Hebrew-Hindi"),
	generateInlineRtlTest([
		[mediumHebrew, hebrew],
		[mediumHindi, hindi],
		[mediumHebrew, hebrew],
		[mediumHindi, hindi],
	]),
	newline(),
	generateTestString("Hebrew-Burmese"),
	generateInlineRtlTest([
		[mediumHebrew, hebrew],
		[mediumBurmese, burmese],
		[mediumHebrew, hebrew],
		[mediumBurmese, burmese],
	]),
	newline(),
];

const LARGE_TESTS = [
	generateTestString("Arabic and hebrew strings for ref"),
	generateRtlTest(longArabic, arabic),
	generateRtlTest(shortArabic, arabic),
	generateRtlTest(longHebrew, hebrew),
	generateRtlTest(shortHebrew, hebrew),
	generateInlineRtlTest([
		["This sentence will contain all scripts", english],
		[longArabic, arabic],
		[mediumChinese, cjk],
		["and some more english", english],
		[mediumHebrew, hebrew],
		[mediumJapanese, cjk],
		[mediumKorean, cjk],
		[shortArabic, arabic],
		[mediumBangla, bangla],
		[shortHebrew, hebrew],
		[mediumHindi, hindi],
		["thank goodness that's over.", english],
	]),
];
var docDefinition = {
	content: [
		// generateTestHeader("Test nesting"),
		// generateTestString(
		// 	"Comment from an alert, lifted directly from digest-pdf-export"
		// ),
		// commentFromDigestPdfExport,
		// newline(),
		// generateTestHeader("Arabic vs LTR fonts"),
		// ...ARABIC_TESTS,
		// generateTestHeader("Hebrew vs LTR fonts"),
		// ...HEBREW_TESTS,
		// generateTestHeader("All scripts megamix"),
		// ...LARGE_TESTS,
		// highlighting test
		{
			text: [
				{ text: "تلقى الأمير  ", font: "NotoSansRTL", style: "" },
				{
					text: [
						{
							text: "محمد بن سلمان بن عبدالعزيز ",
							font: "NotoSansRTL",
							style: "personAlerting",
						},
					],
				},
				{
					text: "، ولي العهد السعودي نائب رئيس مجلس الوزراء وزير الدفاع، اتصالاً هاتفياً، اليوم الجمعة، من وزير الخارجية الأميركي مايك بومبيو. ",
					font: "NotoSansRTL",
					style: "",
				},
			],
			rtl: true,
		},
	],
	styles: {
		personAlerting: {
			background: "#ffd1dd",
			bold: true,
		},
	},
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("examples/pdfs/rtl-tests.pdf"));
pdfDoc.end();
