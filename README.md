# billplz-rest
`billplz-rest` provides a minimal higher-level wrapper around [BillPlz's API.](https://www.billplz-sandbox.com/api).
Currently only support stable version API v3 with Typescript.

## Installation
`billplz-rest` is available from [npm](https://www.npmjs.com/package/billplz-rest).

```shell
npm i billplz-rest
```

### Setup
1. Register for Billplz account at [Billplz](https://www.billplz.com/)
2. Fetch your **BillPlz Secret - String** and **Billplz XSignature - String**
3. Prepare your `callback URL` and `redirect callback` endpoint for redirect and webhook. You can use [Webhook](https://webhook.site/) to test webhook.
4. Import and initialize billplz module using these information.

## Usage

```javascript
// Get Collection By Collection ID

import Billpz from 'billplz-rest'

const GetCollectionById = async () => {

    const billplz = new Billpz({
        isProduction: false,
        secretKey: 'secret-key-from-billplz-account',
        signature: 'signature-from-billplz-account',
        redirectUrl: 'https://mywebsite.com/payment-page',
        callbackUrl: ' 	https://webhook.site/8b4c6eb5-5977-4ba1-beea-abcd12345',
    });

    const res = await billplz
        .collection()
        .getById('abcd123')

    if (res?.fetchSucess) {
        console.info(res);
    }
}

GetCollectionById();
```

```javascript
// Verify webhook

import Billpz from 'billplz-rest'
import { BplzCallback } from './node_modules/billplz-rest/dist/lib/type'

const VerifyCallback = async (payload: BplzCallback) => {

    const billplz = new Billpz({
        isProduction: false,
        secretKey: 'secret-key-from-billplz-account',
        signature: 'signature-from-billplz-account',
        redirectUrl: 'https://mywebsite.com/payment-page',
        callbackUrl: ' 	https://webhook.site/8b4c6eb5-5977-4ba1-beea-abcd12345',
    });

    const res = await billplz
        .callback()
        .verify(payload)

    if (res) {
        console.info(res);
    }
}

VerifyCallback({
    // billplz webhook payload
});

```
