# billplz-rest
`billplz-rest` provides a minimal higher-level wrapper around [BillPlz's API](https://www.billplz-sandbox.com/api).</br>
Currently support only stable version API v3 with Typescript.</br>
Other version need to be stable before development is proceed.

## Installation
`billplz-rest` is available from [npm](https://www.npmjs.com/package/billplz-rest).

```shell
npm i billplz-rest
```

or you can use yarn
```shell
yarn add billplz-rest
```

## Setup
1. Register for a Billplz account at [Billplz Website](https://www.billplz.com/)
2. Fetch your **BillPlz Secret (String)** and **Billplz XSignature (String)**
3. Prepare your `callback url` and `redirect url` endpoint for webhook callback and website redirect. You can use [Webhook Site](https://webhook.site/) to test webhook.
4. Import and initialize billplz module using these information.
5. Do set `isProduction` to `false` if you are using sandbox account.

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

    // check status fetch
    if (res.fetchSucess) {
        console.info(res);
    }
}

GetCollectionById();
```

```javascript
// Verify webhook callback

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

    // if verification success, return payload
    if (res) {
        console.info(res);
    }
}

VerifyCallback({
    // billplz webhook payload
});

```


## Available Methods

| Module                                | Description                                                                                                       |
| --------------------------------------| ------------------------------------------------------------------------------------------------------------------|
| **V3 - Bill**                         | `bill()`                                                                                                          |
| `create()`                            | Each bill must be created within a collection                                                                     |
| `getById()`                           | To request a bill to check                                                                                        |
| `delete()`                            | Only due bill can be deleted. Paid bill can't be deleted.                                                         |
| `getTransactions()`                   | Retrieve your bill's transactions                                                                                 |
| **V3 - Collection**                   | `collection()`                                                                                                    |
| `getIndex()`                          | Retrieve your collections list                                                                                    |
| `getById()`                           | Query your collection record                                                                                      |
| `create()`                            | Create a Collection                                                                                               |
| `deactivate()`                        | Deactivate a Collection                                                                                           |
| `activate()`                          | Activate a Collection                                                                                             |
| `getPaymentMethods()`                 | Retrieve all available payment methods that you can enable / disable to a collection.                             |
| `updatePaymentMethod()`               | Update your collection's payment methods                                                                          |
| **V3 - Open Collection**              | `openCollection()`                                                                                                |
| `getIndex()`                          | Retrieve your open collections list                                                                               |
| `getById()`                           | Query your open collection record                                                                                 |
| `create()`                            | Create an open Collection                                                                                         |
| **V3 - FPX Banks**                    | `fpxBanks()`                                                                                                      |
| `getIndex()`                          | Get a list of bank codes                                                                                          |