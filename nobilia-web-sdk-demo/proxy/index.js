import fetch from 'node-fetch';
import { pipeline } from 'stream/promises';

/*
* This is an example of a proxy google cloud function that forwards your requests to the desired endpoints,
* in this case it would be HOMAG Cloud URLs.
* Set the following env variables to the desired values.
* SUBSCRIPTION_ID
* API_KEY
* BASE_URL // would usually be https://connect.homag.com/
*/

export const proxy_request = async (req, res) => {
    res.set('access-control-allow-origin', '*');
    res.set('access-control-allow-methods', 'GET, POST, OPTIONS');
    res.set(
        'access-control-allow-headers',
        'content-type, authorization, access-control-allow-origin'
    );
    res.set('access-control-allow-credentials', 'true');
    res.set('access-control-allow-headers', '*');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    /*
    * EXAMPLE USAGE!
    *
    * Make a request to this proxy with the following URL query parameters:
    *  ?url=example.com // This defines the target URL the proxy should forward this request to.
    *  ?subscriptionId=xxx // this overrides the subscription ID with the one present in the URL rather than  the one present in the .env
    *  &apiKey=xxx // same as above
    *  &overrideBaseUrl=xxx // same as above
    *
    * In production you would not be overriding the subscriptionId and apiKey as those creds should only be accessed from this proxy's environment variables.
    * So you do not expose sensitive credentials to the browser.
    *
    * So an example URL for a request would be:
    *  https://proxy.cloudfunctions.net/proxy_request?url=api%2Fpos%2Flibraries%2Fnobilia_Minifabrik%2Fcalc.js&subscriptionId=xyz&apiKey=abc
    *  https://proxy.cloudfunctions.net/proxy_request?url=api%2Fpos%2Flibraries%2Fnobilia_Minifabrik%2Fcalc.js
    */

    try {
        const targetUrl = decodeURIComponent(req.query.url ?? '');
        const overrideSubscriptionId = req.query.subscriptionId;
        const subscriptionId = overrideSubscriptionId
            ? decodeURIComponent(overrideSubscriptionId)
            : process.env.SUBSCRIPTION_ID;
        const overrideApiKey = req.query.apiKey;
        const apiKey = overrideApiKey
            ? decodeURIComponent(overrideApiKey)
            : process.env.API_KEY;
        const overrideBaseUrl = req.query.baseUrl;
        const baseUrl = overrideBaseUrl
            ? decodeURIComponent(overrideBaseUrl)
            : process.env.BASE_URL;

        const mandatory = { apiKey, subscriptionId, baseUrl };
        const missing = Object.keys(mandatory).filter(key => !!!mandatory[key]);
        if (missing.length > 0) {
            const errorMessage = `Error: BAD REQUEST, the following params are missing: ${missing.join(', ')}`;
            console.error(errorMessage);
            if (!res.headersSent) {
                res.status(400).json({ error: errorMessage });
            }
            return;
        }

        const headersToForward = {
            accept: req.headers.accept,
            'accept-encoding': req.headers['accept-encoding'],
            'accept-language': req.headers['accept-language'],
            'user-agent': req.headers['user-agent'],
            'content-type': req.headers['content-type'],
            authorization: `Basic ${Buffer.from(
                `${subscriptionId}:${apiKey}`
            ).toString('base64')}`
        };

        let fullUrl = baseUrl + targetUrl;

        const payload = {
            method: req.method,
            headers: headersToForward,
            compress: false
        };

        if (req.method === 'POST') {
            payload.body = JSON.stringify(req.body || {});
        }

        console.log('FullUrl:', fullUrl);
        const response = await fetch(fullUrl, payload);

        for (const [key, value] of response.headers.entries()) {
            if (!key.toLowerCase().startsWith('access-control-')) {
                res.set(key, value);
            }
        }

        res.status(response.status);

        await pipeline(response.body, res);
        console.log('Stream finished with', response.status, fullUrl);
    } catch (error) {
        console.error('Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    }
};
