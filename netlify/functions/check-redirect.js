const axios = require("axios");

exports.handler = async (event) => {
    try {

        const { url } = JSON.parse(event.body);

        let currentUrl = url;

        if (!currentUrl.startsWith("http")) {
            currentUrl = "https://" + currentUrl;
        }

        const results = [];
        const visited = new Set();

        while (true) {

            if (visited.has(currentUrl)) {
                break;
            }

            visited.add(currentUrl);

            const response = await axios.get(currentUrl, {
                maxRedirects: 0,
                validateStatus: () => true,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36"
                }
            });

            let nextUrl = null;

            // HTTP Redirect
            if (
                response.status >= 300 &&
                response.status < 400 &&
                response.headers.location
            ) {
                nextUrl = new URL(
                    response.headers.location,
                    currentUrl
                ).href;
            }

            // Meta Refresh Redirect
            if (!nextUrl && typeof response.data === "string") {

                const metaMatch = response.data.match(
                    /http-equiv=["']refresh["'][^>]*content=["'][^;]+;\s*url=([^"']+)/i
                );

                if (metaMatch) {
                    nextUrl = new URL(
                        metaMatch[1],
                        currentUrl
                    ).href;
                }
            }

            results.push({
                url: currentUrl,
                status: response.status,
                redirect: nextUrl
            });

            if (!nextUrl) {
                break;
            }

            currentUrl = nextUrl;
        }

        return {
            statusCode: 200,
            body: JSON.stringify(results)
        };

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
                name: error.name
            })
        };

    }
};