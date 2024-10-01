const { setWriteOnly } = require("./__objectHelper");
const { BSLBinaryData } = require("./binaryData");
const { BSLMap } = require("./map");
const { BSLNumber } = require("./number");
const { BSLString } = require("./string");

exports.BSLHTTPConnection = class BSLHTTPConnection{
	$type;
	ЗащищенноеСоединение;
	Пароль;
	Пользователь;
	Порт;
	Прокси;
	Сервер;
	Таймаут;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для отправки HTTP запросов
		|	Конструктор:
		|   По умолчанию.
		|		Параметры:
		|		Сервер - Тип: Строка. Адрес сервера, на который будет отправлен запрос.
		|		Порт (не обязательно) - Тип: Число. Порт сервера, на который будет отправлен запрос.
		|		Пользователь (не обязательно) - Тип: Строка. Пользователь для авторизации при запросе
		|		Пароль (не обязательно) - Тип: Строка. Пароль пользователя для авторизации при запросе
		|		Прокси (не обязательно) - Тип: ИнтернетПрокси. Пока не используется
		|		Таймаут (не обязательно) - Тип: Число. Таймаут после которого если не будет получен ответ - будет сгенерирована ошибка
		|		ЗащищенноеСоединение (не обязательно) - Тип: Булево. Использовать ли защищенное соединение при отправке запроса
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Сервер - Тип: Строка. Адрес сервера, на который будет отправлен запрос.
		|	Порт (не обязательно) - Тип: Число. Порт сервера, на который будет отправлен запрос.
		|	Пользователь (не обязательно) - Тип: Строка. Пользователь для авторизации при запросе
		|	Пароль (не обязательно) - Тип: Строка. Пароль пользователя для авторизации при запросе
		|	Прокси (не обязательно) - Тип: ИнтернетПрокси. Пока не используется
		|	Таймаут (не обязательно) - Тип: Число. Таймаут после которого если не будет получен ответ - будет сгенерирована ошибка
		|	ЗащищенноеСоединение (не обязательно) - Тип: Булево. Использовать ли защищенное соединение при отправке запроса`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, server, port = false, user = "", pass = "", proxy = undefined, timeout = 0, secure = false){
		this.$type = require("./type").BSLAvailableTypes.HTTPСоединение;

		this.Сервер = server;
		this.Порт = port;
		this.Пользователь = user;
		this.Пароль = pass;
		this.Прокси = proxy;
		this.Таймаут = timeout;
		this.ЗащищенноеСоединение = secure;

		setWriteOnly(this, "ЗащищенноеСоединение");
		setWriteOnly(this, "Пароль");
		setWriteOnly(this, "Пользователь");
		setWriteOnly(this, "Порт");
		setWriteOnly(this, "Прокси");
		setWriteOnly(this, "Сервер");
		setWriteOnly(this, "Таймаут");
	}

	async ВызватьHTTPМетод(context, method, query){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет HTTP запрос на сервер
			|		Параметры:
			|		Метод - Тип: Строка. Метод через который будет отправляться запрос. Например: POST.
			|		Запрос - Тип: HTTPЗапрос. Выполняемый запрос.
			|		
			|		Результат:
			|		HTTPОтвет`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let headers = new Headers,
			options = {};

		if(query.Заголовки)
			for(let header of query.Заголовки){
				headers.set(header.Ключ.valueOf(), header.Значение.valueOf());
			}

		options.method = method.valueOf();
		options.headers = headers;
		if(query.$body) options.body = query.$body.valueOf();

		let response,
			url = `http${(this.ЗащищенноеСоединение.valueOf() ? "s" : "")}://${this.Сервер.valueOf()}:${(this.Порт.valueOf() ? this.Порт.valueOf() : (this.ЗащищенноеСоединение.valueOf() ? "443" : "80"))}/${query.АдресРесурса.valueOf()}`;

		try{
			response = await fetch(url, options);
		}catch(e){
			context.$BSLRunner.$throwError(context.$node, `Ошибка работы с Интернет: ${e.message}`);
			return;
		}
		let httpResponse = new BSLHTTPResponse(response.headers, response.status);
		httpResponse.$response = response;

		return httpResponse;
	}

	async Записать(context, query){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет HTTP запрос на сервер методом PUT
			|		Параметры:
			|		Запрос - Тип: HTTPЗапрос. Выполняемый запрос.
			|		
			|		Результат:
			|		HTTPОтвет`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return await this.ВызватьHTTPМетод(context, "PUT", query); 
	}

	async Изменить(context, query){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет HTTP запрос на сервер методом PATCH
			|		Параметры:
			|		Запрос - Тип: HTTPЗапрос. Выполняемый запрос.
			|		
			|		Результат:
			|		HTTPОтвет`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return await this.ВызватьHTTPМетод(context, "PATCH", query); 
	}

	async ОтправитьДляОбработки(context, query){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет HTTP запрос на сервер методом POST
			|		Параметры:
			|		Запрос - Тип: HTTPЗапрос. Выполняемый запрос.
			|		
			|		Результат:
			|		HTTPОтвет`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return await this.ВызватьHTTPМетод(context, "POST", query); 
	}

	async Получить(context, query){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет HTTP запрос на сервер методом GET
			|		Параметры:
			|		Запрос - Тип: HTTPЗапрос. Выполняемый запрос.
			|		
			|		Результат:
			|		HTTPОтвет`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return await this.ВызватьHTTPМетод(context, "GET", query); 
	}

	async ПолучитьЗаголовки(context, query){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет HTTP запрос на сервер методом HEAD
			|		Параметры:
			|		Запрос - Тип: HTTPЗапрос. Выполняемый запрос.
			|		
			|		Результат:
			|		HTTPОтвет`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return await this.ВызватьHTTPМетод(context, "HEAD", query); 
	}

	async Удалить(context, query){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет HTTP запрос на сервер методом DELETE
			|		Параметры:
			|		Запрос - Тип: HTTPЗапрос. Выполняемый запрос.
			|		
			|		Результат:
			|		HTTPОтвет`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return await this.ВызватьHTTPМетод(context, "DELETE", query); 
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLHTTPQuery = class BSLHTTPQuery{
	$type;
	АдресРесурса;
	Заголовки;
	$body;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для описания HTTP запросов
		|	Конструктор:
		|   По умолчанию.
		|		Параметры:
		|		АдресРесурса - Тип: Строка. Адрес ресурса, к которому будет отправлен HTTP запрос.
		|		Заголовки (не обязательно) - Тип: Соответствие. Заголовки, которые будут отправлены на сервер.
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	АдресРесурса - Тип: Строка. Адрес ресурса, к которому будет отправлен HTTP запрос.
		|	Заголовки (не обязательно) - Тип: Соответствие. Заголовки, которые будут отправлены на сервер.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, addr, headers = undefined){
		this.$type = require("./type").BSLAvailableTypes.HTTPЗапрос;
		this.АдресРесурса = addr;
		this.Заголовки = headers;
	}

	ПолучитьТелоКакДвоичныеДанные(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает отправляемое тело в двоичных данных
			|		
			|		Результат:
			|		ДвоичныеДанные`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLBinaryData(context, this.$body);
	}

	ПолучитьТелоКакСтроку(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает отправляемое тело как строку
			|		
			|		Результат:
			|		Строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLString(this.$body.toString());
	}

	УстановитьТелоИзДвоичныхДанных(context, data){
		if(context.$BSLRunner.$help){
			console.log(`Устанавливает отправляемое тело запроса из двоичных данных
			|		Параметры:
			|		Данные - Тип: ДвоичныеДанные. Отправляемые данные`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(data instanceof BSLBinaryData)
			this.$body = data;
	}

	УстановитьТелоИзСтроки(context, body){
		if(context.$BSLRunner.$help){
			console.log(`Устанавливает отправляемое тело запроса из строки
			|		Параметры:
			|		Данные - Тип: Строка. Отправляемые данные`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$body = Buffer.from(body.valueOf());
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLHTTPResponse = class BSLHTTPResponse{
	$type;
	Заголовки;
	КодСостояния;
	$response;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект содержащий HTTP ответ после выполнения запроса
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	КодСостояния - Тип: Число. HTTP код ответа. 200 - означает успешный ответ
		|	Заголовки - Тип: Соответствие. Заголовки, которые были получены от сервера.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(headers, statusCode){
		this.$type = require("./type").BSLAvailableTypes.HTTPОтвет;

		this.Заголовки = new BSLMap();
		this.КодСостояния = new BSLNumber(statusCode);

		for(let keyVal of headers){
			this.Заголовки.Вставить(undefined, keyVal[0], keyVal[1]);
		}

		setWriteOnly(this, "Заголовки");
		setWriteOnly(this, "КодСостояния");
	}

	async ПолучитьТелоКакДвоичныеДанные(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает отправляемое тело в двоичных данных
			|		
			|		Результат:
			|		ДвоичныеДанные`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLBinaryData(undefined, Buffer.from(await this.$response.arrayBuffer()));
	}

	async ПолучитьТелоКакСтроку(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает отправляемое тело как строку
			|		
			|		Результат:
			|		Строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}
		
		return new BSLString(await this.$response.text());
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}