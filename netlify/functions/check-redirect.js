const axios = require("axios");

exports.handler = async (event) => {

    try {

        const { url } = JSON.parse(event.body);

        let currentUrl = url;

        if (!currentUrl.startsWith("http")) {
            currentUrl = "https://" + currentUrl;
        }

        const results = [];

        while (true) {

            const response = await axios.get(currentUrl, {
                maxRedirects: 0,
                validateStatus: () => true,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });

            results.push({
                url: currentUrl,
                status: response.status,
                redirect: response.headers.location || null
            });

            if (
                response.status >= 300 &&
                response.status < 400 &&
                response.headers.location
            ) {

                currentUrl = new URL(
                    response.headers.location,
                    currentUrl
                ).href;

            } else {

                break;

            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(results)
        };

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };

    }

};