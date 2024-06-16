export type BplzJsonRes = {
    fetchSucess: boolean,
    fetchMessage: string,
}

//------------------------------ Webhook ----------------------------------

export type BplzCallback = {
    id: string,                 // ID that represents bill.
    collection_id: string,      // ID that represents the collection where the bill belongs to.
    paid: string,               // Boolean value to tell if a bill has paid. It will return false for due and deleted bills; true for paid bills.
    state: string,              // State that representing the bill's status, possible states are due, deleted, and paid.
    amount: string,             // Bill's amount in positive integer, smallest currency unit (e.g 100 cents to charge RM 1.00).
    paid_amount: string,        // Bill's paid amount in positive integer, smallest currency unit (e.g 100 cents to charge RM 1.00).
    due_at: string,             // Due date for the bill, in format YYYY-MM-DD. Example, 2020-12-31.
    email: string,              // The email address of the bill's recipient.
    mobile: string,             // Recipient's mobile number, in format +601XXXXXXXX
    name: string,               // Recipient's name.
    url: string,                // URL to the bill page.
    paid_at: string,            // Date time when the bill was paid
    
    // Basic
    metadata?: string,          // Deprecated hash value data.
    
    // Xsignature
    transaction_id?: string,     // ID that represent the transaction. (Enable Extra Payment Completion Information option to receive this parameter)
    transaction_status?: string, // Status that representing the transaction's status, possible statuses are pending, completed and failed. (Enable Extra Payment Completion Information option to receive this parameter)
    x_signature?: string,        // Digital signature computed with posted data and shared XSignature Key.
}


//------------------------------ Response JSON ----------------------------------

//------- Collection

export type BplzCreateCollectionRes = BplzJsonRes & {
    id: string                    // ID that represents a collection.
    title: string                 // The collection's title in string format.
    logo: {
        thumb_url: string         // The thumb dimension's (180x180) URL.
        avatar_url: string        // The avatar dimension's (40x40) URL.
    },
    split_payment: {
        email: string,            // The 1st recipient's email. It only returns the 1st recipient eventhough there is multiple recipients being set. If you wish to have 2 recipients, please refer to V4 Create a Collection.
        fixed_cut: number,        // The 1st recipient's fixed cut in smallest and positive currency unit.
        variable_cut: null,       // The 1st recipient's percentage cut in positive integer format.
        split_header: true        // Boolean value. All bill and receipt templates will show split rule recipient's infographic if this was set to true.
    }
}

export type BplzGetCollectionRes = BplzJsonRes & {
    id: string,                         // 	ID that represents a collection.
    title: string,                      // 	The collection's title in string format.
    logo: {
        thumb_url: string | null,       // 	The thumb dimension's (180x180) URL.
        avatar_url: string | null,      // 	The avatar dimension's (40x40) URL.
    },
    split_payment: {
        email: string | null,           // The 1st recipient's email. It only returns the 1st recipient eventhough there is multiple recipients being set. If you wish to have 2 recipients, please refer to V4 Create a Collection.
        fixed_cut: number | null,       // The 1st recipient's fixed cut in smallest and positive currency unit.
        variable_cut: number | null,    // The 1st recipient's percentage cut in positive integer format.
        split_header: boolean,          // Boolean value. All bill and receipt templates will show split rule recipient's infographic if this was set to true.
    },
    status: 'active' | 'inactive',      // Collection's status, it is either active and inactive.
}

export type BplzGetCollectionIndexRes = BplzJsonRes & {
    collections: Array<BplzGetCollectionRes>,
    page: number
}

type BplzPaymentMethod = {
    code: string, 	                    // Unique payment method's specific code, in string value.
    name: string, 	                    // Payment method's general name, in string value.
    active: boolean, 	                // The API will return payment method's status for a collection, in boolean value. It returns true if this payment method has enabled for the collection.
}

export type BplzPaymentMethodRes = BplzJsonRes & {
    payment_methods: Array<BplzPaymentMethod>
}


//------- Open Collection

export type BplzCreateOpenCollectionRes = BplzJsonRes & {
    id: string,                       // The collection ID.
    title: string,                    // The collection's title.    
    description: string,              // The collection description.            
    reference_1_label: string | null, // Label #1 to reconcile payments.                
    reference_2_label: string | null, // Label #2 to reconcile payments.                
    email_link: string | null,        // A URL that email to customer after payment is successful.        
    amount: number | null,            // The collection's fixed amount to create bill in the smallest currency unit (cents).            
    fixed_amount: boolean,            // Boolean value. It returns to false if Open Amount.            
    tax: number | null,               // Tax rate in positive integer format.    
    fixed_quantity: boolean,          // Boolean value. It returns false if Open Quantity.                
    payment_button: string,           // Payment button's text.            
    photo: {                          //
        retina_url: string | null,    // The retina dimension's (960x960) URL.                
        avatar_url: string | null,    // The avatar dimension's (180x180) URL.                
    },                                //
    split_payment: {                  //        
        email: string | null,         // The 1st recipient's email. It only returns the 1st recipient eventhough there is multiple recipients being set. If you wish to have 2 recipients, please refer to API#v4-create-an-open-collection.        
        fixed_cut: number | null,     // The 1st recipient's fixed cut in smallest and positive currency unit (cents).                
        variable_cut: number | null,  // The 1st recipient's percentage cut in positive integer format.            
        split_header: boolean         // Boolean value. All bill and receipt templates will show split rule recipient's infographic if this was set to true.            
    },                                //
    url: string                       // URL to the collection.
}

export type BplzGetOpenCollectionRes = BplzJsonRes & BplzCreateOpenCollectionRes & {
    status: string
}

export type BplzGetOpenCollectionIndexRes = BplzJsonRes & {
    open_collections: Array<BplzGetOpenCollectionRes>,
    page: number
}


//------- Bill

export type BplzBillRes = BplzJsonRes & {
    url: string,                        // URL to the bill.
    state: 'due' | 'paid' | 'deleted',  // 
    redirect_url: string                // URL to redirect the customer after payment completed. It will do a GET to redirect_url together with bill's status and ID.
    reference_1_label: string           // Label #1 to reconcile payments (Max of 20 characters). Default value is Reference 1.
    reference_1: string                 // Value for reference_1_label (Max of 120 characters).
    reference_2_label: string           // Label #2 to reconcile payments (Max of 20 characters). Default value is Reference 2.
    reference_2: string                 // Value for reference_2_label (Max of 120 characters).
    paid: false,                        // Boolean value to tell if a bill has paid. It will return false for due bills; true for paid bills.
    paid_amount: number,                // In cents
    name: string,                       // Payer name
    mobile: string,                     // Payer mobile no
    id: string,                         // Bill ID that represents a bill.
    email: string,                      // Payer email
    due_at: string,                     // Due date for the bill. The format YYYY-MM-DD, default value is today. Year range is 19xx to 2xxx. Please note that due_at value does not affect the bill's payability and is only for informational reference.
    description: string,                // 
    collection_id: string,              // ID that represents the collection where the bill belongs to.
    callback_url: string,               // 
    amount: number,                     // In cents
}

type BplzTransaction = {
    id: string,                                  // "60793D4707CD",
    status: 'pending' | 'completed' | 'failed',  // "completed",
    completed_at: string | null,                 // "2017-02-23T12:49:23.612+08:00",
    payment_channel:
    'AMEXMBB'
    | 'BANKISLAM'
    | 'BILLPLZ'
    | 'BOOST'
    | 'TOUCHNGO'
    | 'EBPGMBB'
    | 'FPX'
    | 'FPXB2B1'
    | 'ISUPAYPAL'
    | 'MPGS'
    | 'OCBC'
    | 'PAYDEE'
    | 'RAZERPAYWALLET'
    | 'SECUREACCEPTANCE'
    | 'SENANGPAY'
    | 'TWOCTWOP'
    | 'TWOCTWOPIPP'
    | 'TWOCTWOPWALLET'
    | string
}

export type BplzTransactionRes = BplzJsonRes & {
    bill_id: string,
    transactions: Array<BplzTransaction>,
    page: number
}

//------- Fpx Bank

export type FpxBankRes = BplzJsonRes & {
    banks: Array<{
        name: string,       // This is the bank code that need to set to reference_1. Case sensitive.
        active: boolean,    // true or false boolean that represents bank's availability. If an inactive bank was set to reference_1, the payment process will show Billplz page for payer to choose another bank from the list.
    }>
}
