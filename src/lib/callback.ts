import { createHmac } from "crypto";
import { BplzCallback } from "./type";

export default class Callbackable {

    private signature: string;

    constructor(signature: string,){
        this.signature = signature;
    }

    verify(request: BplzCallback) {
        // check basic or xsignature callback
        if(request?.x_signature) {
            return this.xsignature(request);
        }

        return this.basic(request);
    }

    // no validation
    private basic(request: BplzCallback): BplzCallback {
        return request;
    }

    // validate signature and payload
    private xsignature(request: BplzCallback): BplzCallback|null {
        // #1 Extract all key-value pair parameters except x_signature.
        // #2 Construct source string from each key-value pair parameters above.
        let keyValueStr = [];

        for (const [key, value] of Object.entries(request)) {
            if(key == 'x_signature') continue; //skip

            keyValueStr.push(`${key}${value}`);
        }

        // #3 Sort in ascending order, case-insensitive.
        keyValueStr.sort()

        // #4 Combine sorted source strings with "|" (pipe) character in between.
        const sortStr = keyValueStr.join('|');
        
        // #5 Compute x_signature by signing the final source in #4 using HMAC_SHA256 and the sample XSignature Key.
        const sign: string = createHmac('sha256', this.signature).update(sortStr).digest('hex');
        
        // #6 Compare the computed x_signature with the x_signature passed in the request.
        if(request.x_signature !== sign) return null;
        return request;
    }
}