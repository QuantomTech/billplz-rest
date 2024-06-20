import Requestable from '../requestable';
import {
	BplzCreateOpenCollectionRes,
	BplzGetOpenCollectionIndexRes,
	BplzGetOpenCollectionRes
} from '../type';

export default class OpenCollection_V3 extends Requestable {

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
	 * Get an Open Collection Index
	 *
	 * Use this API to retrieve your open collections list. To
	 * utilise paging, append a page parameter to the URL e.g. ?page=1.
	 * If there are 15 records in the response you will need to check if
	 * there is any more data by fetching the next page e.g. ?page=2 and
	 * continuing this process until no more results are returned.
	 */
	getIndex(dto?: {
		page?: number;
		status?: 'active' | 'inactive';
	}): Promise<BplzGetOpenCollectionIndexRes> {
		let params: Record<string, any> = {}

		if (typeof dto?.page != 'undefined') 	params["page"] = dto.page;
		if (typeof dto?.status != 'undefined') 	params["status"] = dto.status;

		return this._request('GET', `${this.prefix}`, params);
	}

	/**
	 * Get a Collection
	 *
	 * Use this API to query your open collection record.
	 */
	getById(collectionId: string): Promise<BplzGetOpenCollectionRes> {
		return this._request('GET', `${this.prefix}/${collectionId}`);
	}

	/**
	 * Create an Open Collection
	 *
	 * Billplz API now supports the creation of open collections
	 * (Payment Form) with a split rule feature. The response contains
	 * the collection's attributes, including the payment form URL.
	 *
	 */
	create(dto: {
		title: string,					// The collection title. It's showing up on the payment form. String format. (Max of 50 characters)
		description: string,			// The collection description. Will be displayed on payment form. String format. (Max of 200 characters)
		amount: number,					// A positive integer in the smallest currency unit (e.g 100 cents to charge RM 1.00) Required if fixed_amount is true; Ignored if fixed_amount is false
		fixedAmount?: boolean,			// Boolean value. Set this to false for Open Amount. Default value is true
		fixedQuantity?: boolean,		// Boolean value. Set this to false for Open Quantity. Default value is true
		paymentButton?: string,			// Payment button's text. Available options are buy and pay. Default value is pay
		refOneLabel?: string,			// Label #1 to reconcile payments (Max of 20 characters). Default value is Reference 1.
		refTwoLabel?: string,			// Label #2 to reconcile payments. (Max of 20 characters). Default value is Reference 2.
		emailLink?: string,				// A URL that email to customer after payment is successful.
		tax?: number,					// Tax rate in positive integer format.
		photo?: string,					// This image will be resized to retina (Yx960) and avatar (180x180) dimensions. Whitelisted formats are jpg, jpeg, gif and png.
		splitPayment?: {				// 
			email: string;				// The email address of the split rule's recipient. (The account must be a verified account.)
			fixed_cut: null | number;	// A positive integer in the smallest currency unit that is going in your account (e.g 100 cents to charge RM 1.00). This field is required if split_payment[variable_cut] is not present
			variable_cut: null | number;// Percentage in positive integer format that is going in your account. This field is required if split_payment[fixed_cut] is not present
			split_header: boolean;		// Boolean value. All bill and receipt templates will show split rule recipient's infographic if this was set to true.
		}
	}): Promise<BplzCreateOpenCollectionRes> {

		let payload: Record<string, any> = {
			title: dto.title,
			description: dto.description,
			amount: dto.amount,
		}

		if (typeof dto.fixedAmount != 'undefined') 		payload["fixed_amount"] = dto.fixedAmount;
		if (typeof dto.fixedQuantity != 'undefined') 	payload["fixed_quantity"] = dto.fixedQuantity;
		if (typeof dto.paymentButton != 'undefined') 	payload["payment_button"] = dto.paymentButton;
		if (typeof dto.refOneLabel != 'undefined') 		payload["reference_1_label"] = dto.refOneLabel;
		if (typeof dto.refTwoLabel != 'undefined') 		payload["reference_2_label"] = dto.refTwoLabel;
		if (typeof dto.emailLink != 'undefined') 		payload["email_link"] = dto.emailLink;
		if (typeof dto.tax != 'undefined') 				payload["tax"] = dto.tax;
		if (typeof dto.photo != 'undefined') 			payload["photo"] = dto.photo;
		if (typeof dto.splitPayment != 'undefined') 	payload["split_payment"] = dto.splitPayment;

		return this._request('POST', `${this.prefix}`, payload);
	}
}