const puppeteer = require('puppeteer');

const checkPrice = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
        );

        await page.goto('https://opensea.io/collection/gfarm2-nft-1', {
            waitUntil: 'networkidle2',
        });

        let selector = '#main > div > div > div.CollectionHeaderreact__DivContainer-sc-1woywpk-0.leOEIG > div.Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.fZLRIh.jYqxGr > div.Blockreact__Block-sc-1xf18x6-0.hfScwI > div > div:nth-child(3) > a > div > div.Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.elqhCm.jYqxGr.Info--icon > div > span > div';
        try {
            await page.waitForSelector(selector);
        } catch (error) {
            await browser.close();
            console.error(error);
            return null;
        }

        let val = await page.$$eval(
            selector,
            (elem) => elem[0].textContent
        );

        await browser.close();
        return parseFloat(val);
    } catch (error) {
        await browser.close();
        throw error;
    }
};

module.exports = checkPrice;
