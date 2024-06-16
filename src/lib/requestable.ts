class Requestable {
	constructor(
		private headers: Record<string, string>,
		private baseUrl: string
	) {}

	async _request(
		method: 'POST' | 'GET' | 'DELETE' | 'PUT',
		prefix: string,
		payload?: any
	): Promise<any> {
		let options: RequestInit = {
			headers: this.headers,
			method: method,
		};

		if (method == 'GET' && payload) {
			prefix += '?' + new URLSearchParams(payload).toString();
		}

		if (method == 'POST' && payload) {
			options.body = JSON.stringify(payload);
		}

		console.info({ url: this.baseUrl + prefix, method, options });

		try {
			const res = await fetch(this.baseUrl + prefix, options);
			const data = await res.json();

			return {
				fetchSucess: res.ok,
				fetchMessage: res.statusText,
				...data,
			};
		} catch (err) {
			const errObj = err as TypeError;
			console.error(errObj);

			return {
				fetchSucess: false,
				fetchMessage: errObj?.message,
			};
		}
	}
}

export default Requestable;