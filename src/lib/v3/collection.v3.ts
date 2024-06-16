import Requestable from '../requestable';

import {
	BplzCreateCollectionRes,
	BplzGetCollectionIndexRes,
	BplzGetCollectionRes,
	BplzJsonRes,
	BplzPaymentMethodRes,
} from '../type';

class Collection_V3 extends Requestable {

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
	 * Get Collection Index
	 *
	 * Use this API to retrieve your collections list. To utilise paging,
	 * append a page parameter to the URL e.g. ?page=1. If there are 15
	 * records in the response, you will need to check if there is any
	 * more data by fetching the next page, e.g. ?page=2 and continuing
	 * this process until no more results are returned.
	 */
	getIndex(dto?: {
		page?: number;
		status?: 'active' | 'inactive';
	}): Promise<BplzGetCollectionIndexRes | null> {

		let params: Record <string, any> = {}

		if(typeof dto?.page != 'undefined') 	params["page"] =  dto.page;
		if(typeof dto?.status != 'undefined') 	params["status"] =  dto.status;

		return this._request('GET', `${this.prefix}`, params);
	}

	/**
	 * Get a Collection
	 *
	 * Use this API to query your collection record.
	 */
	getById(collectionId: string): Promise<BplzGetCollectionRes | null> {
		return this._request('GET', `${this.prefix}/${collectionId}`);
	}

	/**
	 * Create a Collection
	 *
	 * Billplz API now supports the creation of collection with a
	 * split rule feature. The response will contain the collection's
	 * ID that is needed in Bill API, split rule info and fields.
	 *
	 */
	create(dto: {
		title: string;
		logo?: {
			thumb_url: string;
			avatar_url: string;
		};
		splitPayment?: {
			email: null | string;
			fixed_cut: null | number;
			variable_cut: null | number;
			split_header: boolean;
		};
	}): Promise<BplzCreateCollectionRes | null> {
		
		let payload: Record <string, any> = {
			title: dto.title
		}

		if(typeof dto.logo != 'undefined') 			payload["logo"] = dto.logo;
		if(typeof dto.splitPayment != 'undefined') 	payload["split_payment"] = dto.splitPayment;

		return this._request('POST', `${this.prefix}`, payload);
	}

	/**
	 * Deactivate a Collection
	 *
	 * Both Collection and Open Collection can be deactivated via
	 * this API. The API will respond with error messages if the
	 * collection cannot be deactivated.
	 */
	deactivate(collectionId: string): Promise<BplzJsonRes | null> {
		return this._request('POST', `${this.prefix}/${collectionId}/deactivate`);
	}

	/**
	 * Activate a Collection
	 *
	 * Both Collection and Open Collection can be activated
	 * via this API. The API will respond with error messages
	 * if the collection cannot be activated.
	 */
	activate(collectionId: string): Promise<BplzJsonRes | null> {
		return this._request('POST', `${this.prefix}/${collectionId}/activate`);
	}

	/**
	 * Get Payment Method Index
	 *
	 * The get payment methods index API allows to retrieve all available
	 * payment methods that you can enable / disable to a collection.
	 */
	getPaymentMethods(
		collectionId: string
	): Promise<BplzPaymentMethodRes | null> {
		return this._request('GET', `${this.prefix}/${collectionId}/payment_methods`);
	}

	/**
	 * Update Payment Methods
	 *
	 * Pass the payment method's code to the API to update
	 * your collection's payment methods. Invalid payment method
	 * code will be ignored.
	 */
	updatePaymentMethod(dto: {
		collectionId: string;
		methodCodes: Array<
			| 'mexmbb'
			| 'bankislam'
			| 'billplz'
			| 'boost'
			| 'touchngo'
			| 'ebpgmbb'
			| 'fpx'
			| 'fpxb2b1'
			| 'isupaypal'
			| 'mpgs'
			| 'ocbc'
			| 'paydee'
			| 'razerpaywallet'
			| 'secureacceptance'
			| 'senangpay'
			| 'twoctwop'
			| 'twoctwopipp'
			| 'twoctwopwallet'
		>;
	}): Promise<BplzPaymentMethodRes | null> {

		let methods = dto.methodCodes.map((element) => {
			return { codes: element };
		});

		let payload = { payment_methods: methods };

		return this._request('PUT', `${this.prefix}/${dto.collectionId}/payment_methods`, payload);
	}
}

export default Collection_V3;
