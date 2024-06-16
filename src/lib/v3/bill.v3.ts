import Requestable from '../requestable';
import { 
    BplzBillRes, 
    BplzJsonRes, 
    BplzTransactionRes
} from '../type';

export default class Bill_V3 extends Requestable {

    private prefix: string;
    private callbackUrl: string;
    private redirectUrl: string;

    constructor(dto: {
        baseUrl: string;
        headers: Record<string, string>;
        prefix: string;
        callbackUrl: string,
        redirectUrl: string

    }) {
        super(dto.headers, dto.baseUrl);
        this.prefix = dto.prefix
        this.callbackUrl = dto.callbackUrl
        this.redirectUrl = dto.redirectUrl
    }

    /**
     * Create a Bill
     *
     * To create a bill, you would need the collection's ID. Each bill
     * must be created within a collection. To get your collection ID,
     * visit the collection page on your Billplz account. The bill's
     * collection will be set to active automatically.
     */
    create(dto: {
        collection_id: string;
        email: string;
        mobile: string;
        name: string;
        amountCents: number;
        description: string;
        dueAt?: string;
        deliver?: boolean;
        refOneLabel?: string;
        refOne?: string;
        refTwoLabel?: string;
        refTwo?: string;
    }): Promise<BplzBillRes | null> {

        let payload: Record<string, any> = {
            collection_id: dto.collection_id,
            email: dto.email,
            mobile: dto.mobile,
            name: dto.name,
            amount: dto.amountCents,
            callback_url: this.callbackUrl,
            redirect_url: this.redirectUrl,
            description: dto.description,
        }

        if (typeof dto.dueAt != 'undefined')       payload["due_at"] = dto.dueAt;
        if (typeof dto.deliver != 'undefined')     payload["deliver"] = dto.deliver;
        if (typeof dto.refOneLabel != 'undefined') payload["reference_1_label"] = dto.refOneLabel;
        if (typeof dto.refOne != 'undefined')      payload["reference_1"] = dto.refOne;
        if (typeof dto.refTwoLabel != 'undefined') payload["reference_2_label"] = dto.refTwoLabel;
        if (typeof dto.refTwo != 'undefined')      payload["reference_2"] = dto.refTwo;

        return this._request('POST', `${this.prefix}`, payload);
    }

    /**
     * Get a Bill
     *
     * At any given time, you can request a bill to check
     * on the status. It will return the bill object.
     */
    getById(billId: string): Promise<BplzBillRes | null> {
        return this._request('GET', `${this.prefix}/${billId}`);
    }

    /**
     * Delete a Bill
     *
     * Only due bill can be deleted. Paid bill can't be deleted. Deleting
     * a bill is useful in a scenario where there's a time limitation to
     * payment. Example usage would be to show a timer for customer to
     * complete payment within 10 minutes with a grace period of 5 minutes.
     * After 15 minutes of bill creation, get bill status and delete if
     * bill is still due.
     */
    delete(billId: string): Promise<BplzJsonRes | null> {
        return this._request('DELETE', `${this.prefix}/${billId}`);
    }

    /**
     * Get Transaction Index
     *
     * Use this API to retrieve your bill's transactions. To utilise
     * paging, append a page parameter to the URL e.g. ?page=1. If there
     * are 15 records in the response you will need to check if there is
     * any more data by fetching the next page e.g. ?page=2 and
     * continuing this process until no more results are returned.
     */
    getTransactions(dto: {
        billId: string;
        page?: number;
        status?: 'pending' | 'completed' | 'failed';
    }): Promise<BplzTransactionRes | null> {

        let params: Record<string, any> = {}

        if (typeof dto?.page != 'undefined')    params["page"] = dto.page;
        if (typeof dto?.status != 'undefined')  params["status"] = dto.status;

        return this._request('GET', `${this.prefix}/${dto.billId}/transactions`, params);
    }
}
