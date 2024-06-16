import Bill_V3 from "./lib/v3/bill.v3";
import Callbackable from "./lib/callback";
import Collection_V3 from "./lib/v3/collection.v3";
import FpxBank_V3 from "./lib/v3/fpx-banks.v3";
import OpenCollection_V3 from "./lib/v3/open-collection.v3";

/**
 * BillPlz encapsulates the functionality to create various API wrapper objects.
 */
class BillPlz {

    private headers: Record<string, string> = {};
    private baseUrl: string;
    private signature: string;
    private redirectUrl: string;
    private callbackUrl: string;

    constructor(dto:{
        isProduction: boolean,
        secretKey: string,
        signature: string,
        redirectUrl: string,
        callbackUrl: string,
    }) {
        this.baseUrl = dto.isProduction
            ? 'https://www.billplz.com/api'
            : 'https://www.billplz-sandbox.com/api';

        this.signature = dto.signature;
        this.redirectUrl = dto.redirectUrl;
        this.callbackUrl = dto.callbackUrl;

        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + Buffer.from(dto.secretKey).toString('base64')
        };
    }

    /**
     * Collections
     * 
     * Collections are where all of your Bills are belongs to. 
     * Collections can be useful to categorize your bill payment. 
     * As an example, you may use Collection to separate a Tuition
     * Fee Collection for September and November collection.
     * 
     */
    collection() {
        return new Collection_V3({
            baseUrl: this.baseUrl,
            headers: this.headers,
            prefix: '/v3/collections'
        });
    }

    /**
     * Billplz API now supports the creation of open collections 
     * (Payment Form) with a split rule feature. The response contains
     * the collection's attributes, including the payment form URL.
     */
    openCollection() {
        return new OpenCollection_V3({
            baseUrl: this.baseUrl,
            headers: this.headers,
            prefix: '/v3/open_collections'
        });
    }

    /**
     * Bills
     * 
     * Bills need to be created inside a collection. It must 
     * be either Collection or Open Collection. However, only 
     * Collection can be used to create a bill via API and Open 
     * Collection cannot be used to create a bill via API.
     */
    bill() {
        return new Bill_V3({
            baseUrl: this.baseUrl,
            headers: this.headers,
            prefix: '/v3/bills',
            callbackUrl: this.callbackUrl,
            redirectUrl: this.redirectUrl
        });
    }

    /**
     * Get FPX Banks
     * 
     * Use this API to get a list of bank codes that need for 
     * setting reference_1 in API#bypass-billplz-bill-page. This 
     * API only return list of bank codes for online banking, if 
     * you looking for a complete payment gateways' bank code, 
     * please use API#get-payment-gateways instead.
     */
    fpxBanks() {
        return new FpxBank_V3({
            baseUrl: this.baseUrl,
            headers: this.headers,
            prefix: '/v3/fpx_banks',
        });
    }

    /**
     * Payment Completion
     * 
     * Basic Callback Url
     * callback_url feature does not give your users the same instant 
     * bill update experience as of redirect_url feature, however it 
     * does guarantee you 100% execution backend to backend update.
     * callback_url feature integration is compulsory but redirect_url 
     * feature is optional.
     */
    callback() {
        return new Callbackable(this.signature)
    }
}

export default BillPlz;