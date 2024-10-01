
exports.BSLHTTPService = class BSLHTTPService{
	$type;
	$baseURL;
	Порт;
	$methods = [];

	constructor(context, port = 80){
		this.$type = require("./type").BSLAvailableTypes.HTTPСервис;
		this.Порт = port;
	}

	$parseQueryValue(context, value){
		const { BSLBool } = require("./bool"),
			{ BSLNumber } = require("./number"),
			{ BSLString } = require("./string"),
			{ BSLArray, BSLFixedArray } = require("./array"),
			{ BSLDate } = require("./date");

		if(typeof(value) === "string") return new BSLString(value);
		if(typeof(value) === "number") return new BSLNumber(value);
		if(typeof(value) === "boolean") return new BSLBool(value);
		if(value instanceof Date) return new BSLDate(context, value);

		if(value instanceof Array){
			let newResult = new BSLArray(context);
			for(let item of value){
				newResult.Добавить(context, this.$parseQueryValue(context, item));
			}

			return new BSLFixedArray(context, newResult);
		}

		return value;
	}

	async $callHTTP(req, res){
		const { BSLString } = require("./string"),
			{ BSLEvalFuncNode } = require("../../AST/rawNode"),
			{ BSLErrorInfo } = require("../../helper"),
			{ BSLMap, BSLFixedMap } = require("./map"),
			{ BSLRegexp } = require("./regexp");

		let context = req.app.get("$context"),
			service = req.app.get("$service"),
			response,
			headers = new BSLMap(context),
			queryParams = new BSLMap(context);

		for(let headerKey of Object.keys(req.headers)){
			headers.Вставить(context, new BSLString(headerKey), new BSLString(req.headers[headerKey]));
		}

		for(let queryKey of Object.keys(req.query)){
			let result = req.query[queryKey];

			queryParams.Вставить(context, queryKey, service.$parseQueryValue(context, result));
		}

		headers = new BSLFixedMap(context, headers);
		queryParams = new BSLFixedMap(context, queryParams);
		
		for(let method of service.$methods){
			if(method.method.toUpperCase() == "ANY" || method.method.toUpperCase() == req.method.toUpperCase()){
				let matchURL = false,
					urlParams = new BSLMap(context);

				if(method.URL instanceof BSLRegexp){
					matchURL = method.URL.Подобно(req.url);
				}else{
					let url = req.url.replace(/\?.*/, ""),
						methodURL = method.URL.valueOf();

					methodURL = methodURL.replace(/\//gm, "\\/").replace(/\{([\w]+)\}/gm, "(?<$1>[^\\\/]+)").replace(/\*/gm, ".*");

					matchURL = (new RegExp(methodURL)).exec(url);

					if(matchURL !== null){
						if(matchURL.groups)
							for(let groupKey of Object.keys(matchURL.groups)){
								urlParams.Вставить(context, groupKey, matchURL.groups[groupKey]);
							}

						matchURL = true;
					}else  
						matchURL = false;
				}


				if(matchURL){
					urlParams = new BSLFixedMap(context, urlParams);

					let request = new BSLHTTPServiceRequest(context, new BSLString(req.method), new BSLString(req.originalUrl), headers, new BSLString(req.url), urlParams, queryParams);
					request.$body = req.body;
					method.callback.$operands = [request];
					// Костыль для ловли ошибок внутри методов и вывода их в ответ вместо падения программы
					context.$BSLRunner.$tryNode = {
						exception: new BSLEvalFuncNode((context)=>{
							if(context.$exception instanceof BSLErrorInfo){
								res.status(500).send(context.$getErrorMessage(context.$exception));
								return;
							}
						})
					}; 
					response = await context.$BSLRunner.run(method.callback);
				}
			}
		}

		if(!res.finished){
			if(response instanceof exports.BSLHTTPServiceResponse){
				for(let headerKeyVal of response.Заголовки){
					res.set(headerKeyVal.Ключ.valueOf(), headerKeyVal.Значение.valueOf());
				}

				res.status(response.КодСостояния.valueOf());

				if(response.$body !== undefined){
					res.send(response.$body);
				}else
				if(response.Причина){
					res.send(response.Причина);
				}
				
			}else
				res.status(500).send("Method not allowed");
		}
	}

	ДобавитьМетод(context, method, URL, callback){
		this.$methods.push({
			method,
			URL,
			callback
		});
	}

	Запустить(context){
		const express = require('express');
		
		let app = express();

		app.use(require('express').raw({ type: '*/*', limit: '10mb' }));
		app.use(this.$callHTTP);
		app.set("$context", context);
		app.set("$service", this);
		app.listen(this.Порт.valueOf());
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLHTTPServiceRequest = class BSLHTTPServiceRequest{
	$type;
	$body;
	HTTPМетод;
	БазовыйURL;
	Заголовки;
	ОтносительныйURL;
	ПараметрыURL;
	ПараметрыЗапроса;

	constructor(context, method, baseURL, headers, url, urlParameters, queryParameters){
		const { setWriteOnly } = require("./__objectHelper");

		this.$type = require("./type").BSLAvailableTypes.HTTPСервисЗапрос;

		this.HTTPМетод = method;
		this.БазовыйURL = baseURL;
		this.Заголовки = headers;
		this.ОтносительныйURL = url;
		this.ПараметрыURL = urlParameters;
		this.ПараметрыЗапроса = queryParameters;

		setWriteOnly(this, "HTTPМетод");
		setWriteOnly(this, "БазовыйURL");
		setWriteOnly(this, "Заголовки");
		setWriteOnly(this, "ОтносительныйURL");
		setWriteOnly(this, "ПараметрыURL");
		setWriteOnly(this, "ПараметрыЗапроса");
	}

	ПолучитьТелоКакДвоичныеДанные(context){
		const { BSLBinaryData } = require("./binaryData");
		return new BSLBinaryData(context, this.$body);
	}

	ПолучитьТелоКакСтроку(context){
		const { BSLString } = require("./string");
		return new BSLString(this.$body.toString());
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLHTTPServiceResponse = class BSLHTTPServiceResponse{
	$type;
	Заголовки;
	КодСостояния;
	Причина;
	$body;

	constructor(context, statusCode, reason = "", headers = undefined){
		const { BSLMap } = require("./map");
		this.$type = require("./type").BSLAvailableTypes.HTTPСервисОтвет;

		if(headers)
			this.Заголовки = headers;
		else
			this.Заголовки = new BSLMap(context);

		this.КодСостояния = statusCode;
		this.Причина = reason;
	}

	ПолучитьТелоКакДвоичныеДанные(context){
		const { BSLBinaryData } = require("./binaryData");
		return new BSLBinaryData(context, this.$body);
	}

	ПолучитьТелоКакСтроку(context){
		const { BSLString } = require("./string");
		return new BSLString(this.$body.toString());
	}

	УстановитьТелоИзДвоичныхДанных(context, data){
		const { BSLBinaryData } = require("./binaryData");
		if(data instanceof BSLBinaryData)
			this.$body = data;
	}

	УстановитьТелоИзСтроки(context, body){
		this.$body = Buffer.from(body.valueOf());
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}