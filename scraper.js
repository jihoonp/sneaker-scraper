const readline = require('readline');
const puppeteer = require('puppeteer');

// off white presto blacks, size 9
var offWhitePrestoUrls = new Map();
offWhitePrestoUrls.set('https://www.stadiumgoods.com/nike-air-presto-off-white-black-aa3830-001', '//*[@id="product-options-wrapper"]/div[2]/div[2]/label[3]/span/span[2]/span'); // stadium goods
offWhitePrestoUrls.set('https://www.flightclub.com/the-10-nike-air-presto-black-black-muslin-801820?size=9', '//*[@id="product-price-209116 current-price"]/span'); // flight club

var offWhitePrestoSiteNames = ["Stadium Goods", "Flight Club"];

// yeezy 350 v2 triple white, size 9
var yeezyTripleWhitesUrls = new Map();
yeezyTripleWhitesUrls.set('https://www.stadiumgoods.com/yeezy-boost-350-v2-cp9366-cwhite-cwhite-cwhite', '//*[@id="product-options-wrapper"]/div[2]/div[2]/label[10]/span/span[2]/span'); // stadium goods
yeezyTripleWhitesUrls.set('https://www.flightclub.com/yeezy-boost-350-v2-white-core-black-red-800502?size=9', '//*[@id="product-price-186358 current-price"]/span'); // flight club

var yeezyTripleWhitesSiteNames = ["Stadium Goods", "Flight Club"];

// off white air jordan 1
var offWhiteAirJordan1Urls = new Map();
offWhiteAirJordan1Urls.set('https://www.stadiumgoods.com/the-10-air-jordan-1-aa3834-101-white-black-varsity-red', '//*[@id="product-options-wrapper"]/div[2]/div[2]/label[4]/span/span[2]/span'); // stadium goods
offWhiteAirJordan1Urls.set('https://www.flightclub.com/the-10-air-jordan-1-white-black-varsity-red-801781?size=9', '//*[@id="product-price-208324 current-price"]/span'); // flight club

var offWhiteAirJordan1SiteNames = ["Stadium Goods", "Flight Club"];

function greetMessage() {
	console.log("Which shoe would you like to search for? Enter the number next to the option.");
	console.log("1) Off White Air Jordan 1, size 9");
	console.log("2) Yeezy Boost 350 v2, Triple White, size 9");
	console.log("3) Off White Presto Black, size 9");
	console.log("4) Quit");
}

function exitMessage() {
	console.log("Quitting application. Goodbye.");
}

async function searchHelper(url, xpath, siteName) {

	const browser = await puppeteer.launch( {headless: false});
	const page = await browser.newPage();
  
	await page.goto(url);
  
	const priceElement = (await page.$x(xpath))[0];

	const price = await page.evaluate(el => {
        return el.textContent;
    }, priceElement);

	console.log("The price on " + siteName + " is " + price);

	browser.close();
}

async function search(urlAndXPaths, siteNames) {

	var siteNameIndex = 0;

	for (const [key, value] of urlAndXPaths) // key = url, value = xpath
	{
		await searchHelper(key, value, siteNames[siteNameIndex]);
		siteNameIndex++;
	}
}

async function main() {

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const getLine = (function () {
    	const getLineGen = (async function* () {
        	for await (const line of rl) {
            	yield line;
        	}
    	})();
    	return async () => ((await getLineGen.next()).value);
	})();

	var userInput = 0;

	// main loop
	while (userInput != 4)
	{
		greetMessage();

		var userInput = Number(await getLine());

		if (userInput == 1)
		{
			console.log("You've chosen the Off White Air Jordan 1, size 9, searching for the price on multiple sites...");
			console.log("------------------------------");

			await search(offWhiteAirJordan1Urls, offWhiteAirJordan1SiteNames);
		}
		else if (userInput == 2)
		{
			console.log("You've chosen the Yeezy Boost 350 v2 - Triple Whites, size 9, searching for the price on multiple sites...");
			console.log("------------------------------");

			await search(yeezyTripleWhitesUrls, yeezyTripleWhitesSiteNames);
		}
		else if (userInput == 3)
		{
			console.log("You've chosen the Off-White Presto Blacks, size 9, searching for the price on multiple sites....");
			console.log("------------------------------");

			await search(offWhitePrestoUrls, offWhitePrestoSiteNames);
		}
		else if (userInput == 4)
		{
			exitMessage();
			process.exit();
		}
		else
		{
			console.log("Invalid choice. Try again.");
		}

		console.log("------------------------------");
	}

}

main();