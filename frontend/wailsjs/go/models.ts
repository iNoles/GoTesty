export namespace core {
	
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
	export class Auth {
	    type: string;
	    token?: string;
	    username?: string;
	    password?: string;
	    key?: string;
	    keyName?: string;
	    location?: string;
	
	    static createFrom(source: any = {}) {
	        return new Auth(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.token = source["token"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.key = source["key"];
	        this.keyName = source["keyName"];
	        this.location = source["location"];
	    }
	}

}

