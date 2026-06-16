const { chromium } = require("playwright");

exports.handler = async (event) => {

    let browser;

    try {

        const { url } = JSON.parse(event.body);

        let targetUrl = url;

        if (!targetUrl.startsWith("http")) {
            targetUrl = "https://" + targetUrl;
        }

        browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage();

        const chain = [];

        page.on("response", (response) => {

            const request = response.request();

            if (request.resourceType() === "document") {

                chain.push({
                    url: response.url(),
                    status: response.status()
                });

            }

        });

        await page.goto(targetUrl, {
            waitUntil: "networkidle",
            timeout: 30000
        });

        const finalUrl = page.url();

        await browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                finalUrl,
                redirects: chain
            })
        };

    } catch (error) {

        if (browser) {
            await browser.close();
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };

    }

};