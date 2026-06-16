const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/check", async (req, res) => {

    let { url } = req.body;

    if (!url) {
        return res.json({
            error: "Please enter URL"
        });
    }

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    const results = [];

    try {

        let currentUrl = url;

        while (true) {

            const response = await axios.get(currentUrl, {
                maxRedirects: 0,
                validateStatus: () => true,
                headers: {
                    "User-Agent":
                    "Mozilla/5.0"
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

        res.json(results);

    } catch (error) {

        res.json({
            error: error.message
        });

    }

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});