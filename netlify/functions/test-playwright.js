const { chromium } = require("playwright");

async function trace(url) {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    const chain = [];

    page.on("response", response => {

        if (response.request().resourceType() === "document") {

            chain.push({
                url: response.url(),
                status: response.status()
            });

        }

    });

    await page.goto(url, {
        waitUntil: "networkidle"
    });

    console.log(chain);

    console.log("Final URL:");
    console.log(page.url());

    await browser.close();
}

trace("https://app.appsflyer.com/id505521160?pid=charitabl5o_int&af_siteid={aff_id}&c=DM_AGENCY_CPA_RJT_VIR_SPORTS&af_sub_siteid={sub_aff_id}&af_ad={ad}&af_ad_id={ad_id}&af_adset={ad_set}&af_c_id={campaign_id}&af_adset_id={ad_set_id}&af_click_lookback=7d&reserve1={reserve1}&clickid={click_id}&advertising_id={gaid}&idfa={idfa}&af_model={model}&af_os_version={os_version}&af_prt=aeonadz");
trace("https://goniyo.onelink.me/cKyR?pid=vikingmedia_int&af_siteid={af_siteid}&c=DIGIMODO_AGENCY_CPA_RJT_VIK&af_sub_siteid={af_sub_siteid}&af_c_id={af_c_id}&af_ad_id={af_ad_id}&af_adset_id={af_adset_id}&af_ad_type={af_ad_type}&af_channel={af_channel}&af_click_lookback=7d&af_ip={af_ip}&af_lang={af_lang}&af_ua={af_ua}&clickid={clickid}&advertising_id={gaid}&idfa={idfa}&af_prt=digimodoadin391");
trace("https://cars.com");
