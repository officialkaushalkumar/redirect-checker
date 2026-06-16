const axios = require("axios");

async function test(url) {

    try {

        const response = await axios.get(url, {
            maxRedirects: 0,
            validateStatus: () => true
        });

        console.log("Status:", response.status);
        console.log("URL:", url);

        if (
            response.status >= 300 &&
            response.status < 400 &&
            response.headers.location
        ) {

            const nextUrl = new URL(
                response.headers.location,
                url
            ).href;

            console.log("Redirects To:", nextUrl);
            console.log("-------------------");

            await test(nextUrl);

        } else {

            console.log("Final Landing Page:", url);

        }

    } catch (error) {

        console.error(error.message);

    }
}

test("https://dm.gotrackier.io/click?campaign_id=130&pub_id=2&source=test");