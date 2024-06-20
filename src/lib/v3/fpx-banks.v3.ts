import Requestable from '../requestable';
import { FpxBankRes } from '../type';

export default class FpxBank_V3 extends Requestable {

    protected prefix: string;

    constructor(dto: {
        baseUrl: string;
        headers: Record<string, string>;
        prefix: string;
    }) {
        super(dto.headers, dto.baseUrl);
        this.prefix = dto.prefix;
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
    getIndex(): Promise<FpxBankRes> {
        return this._request('GET', `${this.prefix}`);
    }
}
