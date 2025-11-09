export namespace main {
	
	export class APIResponse {
	    Status: number;
	    Duration: string;
	    Headers: Record<string, Array<string>>;
	    Body: string;
	
	    static createFrom(source: any = {}) {
	        return new APIResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Status = source["Status"];
	        this.Duration = source["Duration"];
	        this.Headers = source["Headers"];
	        this.Body = source["Body"];
	    }
	}

}

