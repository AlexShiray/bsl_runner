
exports.BSLTelegramBot = class BSLTelegramBot{
	$type;
	$object;
	$token;
	$methods = [];
	$methodsCb = [];
	ПроцедураОбработкиОшибки;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с Telegram ботом
		|	Конструктор:
		|   По умолчанию.
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	ПроцедураОбработкиОшибки - Тип: ОписаниеОповещения. Обработчик ошибки.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context){
		process.env.NTBA_FIX_350 = true;
		this.$type = require("./type").BSLAvailableTypes.TelegramБот;
	}

	async $onPollError(error){
		const { BSLCallbackDescription } = require("./callbackDescription");

		if(this.ПроцедураОбработкиОшибки instanceof BSLCallbackDescription){
			const { BSLString } = require("./string");

			this.ПроцедураОбработкиОшибки.$operands.push(new BSLString(error.message));
			await context.$BSLRunner.run(this.ПроцедураОбработкиОшибки);
		}
	}

	async $onMessage(msg){
		const { BSLEvalFuncNode } = require("../../AST/rawNode"),
			{ BSLErrorInfo } = require("../../helper"),
			{ BSLMap, BSLFixedMap } = require("./map"),
			{ BSLRegexp } = require("./regexp"),
			{ BSLBotRequest } = require("./botRequestResponse"),
			{ parseFromJsObject } = require("./__objectHelper");

		if(!msg.text) msg.text = "";

		let context = this.$context;

		for(let method of this.$object.$methods){
			let matchTpl = false,
				tplParams = new BSLMap(context);

			if(method.tpl instanceof BSLRegexp){
				matchTpl = method.tpl.Найти(context, msg.text);
				if(matchTpl){
					for(let i = 1; i < matchTpl.$groups.length; i++){
						tplParams.Вставить(context, i - 1, matchTpl.$groups[i].Значение);
					}
				}
			}else{
				let methodTpl = method.tpl.valueOf();

				methodTpl = methodTpl.replace(/\//gm, "\\/").replace(/\{([\w]+)\}/gm, "(?<$1>[^\\\/]+)").replace(/\*/gm, ".*");

				matchTpl = (new RegExp(methodTpl)).exec(msg.text);

				if(matchTpl !== null){
					if(matchTpl.groups)
						for(let groupKey of Object.keys(matchTpl.groups)){
							tplParams.Вставить(context, groupKey, matchTpl.groups[groupKey]);
						}

					matchTpl = true;
				}else{  
					matchTpl = false;
				}
			}

			if(matchTpl){
				tplParams = new BSLFixedMap(context, tplParams);

				let request = new BSLBotRequest(context, this.$object, tplParams, msg.chat.id, new Date(msg.date * 1000), msg.from.id, msg.message_id);
				request.Тело = parseFromJsObject(msg, true);

				if(method.catchErrors.valueOf() === true){
					// Костыль для ловли ошибок внутри методов и вывода их в ответ вместо падения программы
					context.$BSLRunner.$tryNode = {
						exception: new BSLEvalFuncNode((context)=>{
							if(context.$exception instanceof BSLErrorInfo){
								this.sendMessage(msg.chat.id, `Возникла ошибка на сервере: ${context.$getErrorMessage(context.$exception)}`);
							}
						})
					}; 
				}

				method.callback.$operands = [];
				method.callback.$operands.push(request);

				await context.$BSLRunner.run(method.callback);
			}
		}
	}

	async $onCallbackQuery(cb){
		const { BSLEvalFuncNode } = require("../../AST/rawNode"),
			{ BSLErrorInfo } = require("../../helper"),
			{ BSLMap, BSLFixedMap } = require("./map"),
			{ BSLRegexp } = require("./regexp"),
			{ BSLBotRequest } = require("./botRequestResponse"),
			{ parseFromJsObject } = require("./__objectHelper");

		let context = this.$context;

		for(let method of this.$object.$methods){
			let matchTpl = false,
				tplParams = new BSLMap(context);

			if(method.tpl instanceof BSLRegexp){
				matchTpl = method.tpl.Найти(context, req.url);
			}else{
				let methodTpl = method.tpl.valueOf();

				methodTpl = methodTpl.replace(/\//gm, "\\/").replace(/\{([\w]+)\}/gm, "(?<$1>[^\\\/]+)").replace(/\*/gm, ".*");

				matchTpl = (new RegExp(methodTpl)).exec(cb.data);

				if(matchTpl !== null){
					if(matchTpl.groups)
						for(let groupKey of Object.keys(matchTpl.groups)){
							tplParams.Вставить(context, groupKey, matchTpl.groups[groupKey]);
						}

					matchTpl = true;
				}else{  
					matchTpl = false;
				}
			}

			if(matchTpl){
				tplParams = new BSLFixedMap(context, tplParams);

				let request = new BSLBotRequest(context, this.$object, tplParams, cb.message.chat.id, new Date(cb.message.date * 1000), cb.from.id, cb.id);
				request.Тело = parseFromJsObject(cb, true);

				if(method.catchErrors.valueOf() === true){
					// Костыль для ловли ошибок внутри методов и вывода их в ответ вместо падения программы
					context.$BSLRunner.$tryNode = {
						exception: new BSLEvalFuncNode((context)=>{
							if(context.$exception instanceof BSLErrorInfo){
								this.sendMessage(cb.message.chat.id, `Возникла ошибка на сервере: ${context.$getErrorMessage(context.$exception)}`);
							}
						})
					}; 
				}

				method.callback.$operands = [];
				method.callback.$operands.push(request);
				
				response = await context.$BSLRunner.run(method.callback);
			}
		}
	}

	async Подключить(context, token, isGetMessages = false){
		if(context.$BSLRunner.$help){
			console.log(`Инициализирует подключение бота
			|		Параметры:
			|		Токен - Тип: Строка. Полученный токен от бота.
			|		ПолучатьСообщения (не обязательный) - Тип: Булево. По умолчанию: Ложь. Если Истина - бот будет принимать сообщения.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const TelegramBot = require("node-telegram-bot-api");

		try{
			this.$object = new TelegramBot(token, {
				polling: isGetMessages.valueOf()
			});
			
			this.$token = token;

			this.$object.on('polling_error', this.$onPollError);
			this.$object.on('message', this.$onMessage);
			this.$object.on('callback_query', this.$onCallbackQuery);

			this.$object['$context'] = context;
			this.$object['$object'] = this;
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Не удалось инициализировать бота: ${e.message}`);
		}
	}

	async УстановитьКоманды(context, commands, type, chatId = undefined, memberId = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Устанавливает команды бота в списке команд рядом с текстом сообщения в телеграмме.
			|		Параметры:
			|		Команды - Тип: Структура, Соответствие. Выводимые команды. (см. setMyCommands в Bots API)
			|		Применяемость - Тип: TelegramТипКоманды. Описывает как и где и для кого будут выводится команды бота.
			|		ИдентификаторЧата (не обязательный) - Тип: Число, Строка. Идентификатор чата где будут выводится команды (если выбрана применяемость для определенного чата)
			|		ИдентификаторПользователя (не обязательный) - Тип: Число, Строка. Идентификатор пользователя, у которого будут выводится команды (если выбрана применяемость для определенного пользователя)
			|`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLGCTelegramBot } = require("../gcTelegramBot");
		const { BSLBool } = require("./bool");
		const { parseToJsObject } = require("./__objectHelper");

		if((type == BSLGCTelegramBot.TelegramТипыКоманд.ВыбранныйЧат || 
				type == BSLGCTelegramBot.TelegramТипыКоманд.АдминистраторыВыбранногоЧата || 
				type == BSLGCTelegramBot.TelegramТипыКоманд.ВыбранныйПользовательВыбранногоЧата
			) && chatId === undefined){
				await context.$BSLRunner.$throwError(context.$node, `Не заполнен идентификатор чата`);
				return new BSLBool(false);
		}

		if(type == BSLGCTelegramBot.TelegramТипыКоманд.ВыбранныйПользовательВыбранногоЧата && memberId === undefined){
			await context.$BSLRunner.$throwError(context.$node, `Не заполнен идентификатор пользователя`);
			return new BSLBool(false);
		}

		commands = parseToJsObject(commands, true);
		try{
			await this.$object.setMyCommands(commands, {
				scope: {
					type: type.$name
				}
			});
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	async ДобавитьОбработчик(context, tpl, callback, isCallbackQuery = false, catchErrors = true){
		if(context.$BSLRunner.$help){
			console.log(`Устанавливает обрабочик получаемых сообщений.
			|		Параметры:
			|		Шаблон - Тип: Строка, РегВыражение. Шаблон сообщения, или регулярное выражение
			|		Обработчик - Тип: ОписаниеОповещения. Выполняемая процедура для данного шаблона.
			|		ОтветныйЗапрос (не обязательный) - Тип: Булево. По умолчанию: Ложь. Признак, что обработчик предназначен для ответного запроса (например для кнопок)
			|		ОбрабатыватьОшибки (не обязательный) - Тип: Булево. По умолчанию: Истина. Признак указывающий надо ли отображать ошибки пользователю в чате.
			|`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(isCallbackQuery.valueOf() === true){
			this.$methodsCb.push({
				tpl,
				callback,
				catchErrors
			});
		}else{
			this.$methods.push({
				tpl,
				callback,
				catchErrors
			});
		}
	}

	async ОтправитьТекст(context, chatId, text, options = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет сообщение в чат.
			|		Параметры:
			|		ИдентификаторЧата - Тип: Строка, Число. Идентификатор чата, куда надо отправить сообщение.
			|		Сообщение - Тип: Строка. Текст сообщения
			|		Параметры (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры запроса (см sendMessage в Bots API)`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { parseToJsObject } = require("./__objectHelper");
		try{
			if(options !== undefined)
				options = parseToJsObject(options, true);
			
			await this.$object.sendMessage(chatId.valueOf(), text.valueOf(), options);
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	async ОтправитьФото(context, chatId, text, file, options = undefined, fileOptions = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет фотографию/картинку в чат.
			|		Параметры:
			|		ИдентификаторЧата - Тип: Строка, Число. Идентификатор чата, куда надо отправить сообщение.
			|		Сообщение - Тип: Строка. Текст сообщения
			|		Файл - Тип: ДвоичныеДанные, Строка. ДвоичныеДанные файла или путь к локальному файлу.
			|		Параметры (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры запроса (см sendPhoto в Bots API)
			|		ПараметрыФайла (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры файла (см sendPhoto в Bots API)`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { parseToJsObject } = require("./__objectHelper");
		const { BSLBinaryData } = require("./binaryData");

		try{
			if(options !== undefined)
				options = parseToJsObject(options, true);
			else
				options = {};

			options['caption'] = text.valueOf();

			if(fileOptions !== undefined)
				fileOptions = parseToJsObject(fileOptions, true);

			if(file instanceof BSLBinaryData){
				file = file.$object;
			}
			
			await this.$object.sendPhoto(chatId.valueOf(), file, options, fileOptions);
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	async ОтправитьАудио(context, chatId, text, file, options = undefined, fileOptions = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет аудиосообщение в чат.
			|		Параметры:
			|		ИдентификаторЧата - Тип: Строка, Число. Идентификатор чата, куда надо отправить сообщение.
			|		Сообщение - Тип: Строка. Текст сообщения
			|		Файл - Тип: ДвоичныеДанные, Строка. ДвоичныеДанные файла или путь к локальному файлу.
			|		Параметры (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры запроса (см sendAudio в Bots API)
			|		ПараметрыФайла (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры файла (см sendAudio в Bots API)`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { parseToJsObject } = require("./__objectHelper");
		const { BSLBinaryData } = require("./binaryData");

		try{
			if(options !== undefined)
				options = parseToJsObject(options, true);
			else
				options = {};

			options['caption'] = text.valueOf();

			if(fileOptions !== undefined)
				fileOptions = parseToJsObject(fileOptions, true);

			if(file instanceof BSLBinaryData){
				file = file.$object;
			}
			
			await this.$object.sendAudio(chatId.valueOf(), file, options, fileOptions);
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	async ОтправитьДокумент(context, chatId, text, file, options = undefined, fileOptions = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет документ в чат.
			|		Параметры:
			|		ИдентификаторЧата - Тип: Строка, Число. Идентификатор чата, куда надо отправить сообщение.
			|		Сообщение - Тип: Строка. Текст сообщения
			|		Файл - Тип: ДвоичныеДанные, Строка. ДвоичныеДанные файла или путь к локальному файлу.
			|		Параметры (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры запроса (см sendDocument в Bots API)
			|		ПараметрыФайла (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры файла (см sendDocument в Bots API)`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { parseToJsObject } = require("./__objectHelper");
		const { BSLBinaryData } = require("./binaryData");

		try{
			if(options !== undefined)
				options = parseToJsObject(options, true);
			else
				options = {};

			options['caption'] = text.valueOf();

			if(fileOptions !== undefined)
				fileOptions = parseToJsObject(fileOptions, true);

			if(file instanceof BSLBinaryData){
				file = file.$object;
			}
			
			await this.$object.sendDocument(chatId.valueOf(), file, options, fileOptions);
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	async ОтправитьВидео(context, chatId, text, file, options = undefined, fileOptions = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет видео в чат.
			|		Параметры:
			|		ИдентификаторЧата - Тип: Строка, Число. Идентификатор чата, куда надо отправить сообщение.
			|		Сообщение - Тип: Строка. Текст сообщения
			|		Файл - Тип: ДвоичныеДанные, Строка. ДвоичныеДанные файла или путь к локальному файлу.
			|		Параметры (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры запроса (см sendVideo в Bots API)
			|		ПараметрыФайла (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры файла (см sendVideo в Bots API)`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { parseToJsObject } = require("./__objectHelper");
		const { BSLBinaryData } = require("./binaryData");

		try{
			if(options !== undefined)
				options = parseToJsObject(options, true);
			else
				options = {};

			options['caption'] = text.valueOf();

			if(fileOptions !== undefined)
				fileOptions = parseToJsObject(fileOptions, true);

			if(file instanceof BSLBinaryData){
				file = file.$object;
			}
			
			await this.$object.sendVideo(chatId.valueOf(), file, options, fileOptions);
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	async ОтправитьГолосовое(context, chatId, text, file, options = undefined, fileOptions = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Отправляет аудио как голосовое сообщение в чат.
			|		Параметры:
			|		ИдентификаторЧата - Тип: Строка, Число. Идентификатор чата, куда надо отправить сообщение.
			|		Сообщение - Тип: Строка. Текст сообщения
			|		Файл - Тип: ДвоичныеДанные, Строка. ДвоичныеДанные файла или путь к локальному файлу.
			|		Параметры (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры запроса (см sendVoice в Bots API)
			|		ПараметрыФайла (не обязательный) - Тип: Соответствие, Структура, Массив. Параметры файла (см sendVoice в Bots API)`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { parseToJsObject } = require("./__objectHelper");
		const { BSLBinaryData } = require("./binaryData");

		try{
			if(options !== undefined)
				options = parseToJsObject(options, true);
			else
				options = {};

			options['caption'] = text.valueOf();

			if(fileOptions !== undefined)
				fileOptions = parseToJsObject(fileOptions, true);

			if(file instanceof BSLBinaryData){
				file = file.$object;
			}
			
			await this.$object.sendVoice(chatId.valueOf(), file, options, fileOptions);
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	async ПолучитьФайл(context, fileId){
		if(context.$BSLRunner.$help){
			console.log(`Получает файл с серверов телеграмма.
			|		Параметры:
			|		ИдентификаторФайла - Тип: Строка, Число. Идентификатор файла, который требуется получить.
			|		
			|		Результат:
			|		Файл - Тип: ДвоичныеДанные.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBinaryData } = require("./binaryData");

		try{
			let result = await this.$object.getFile(fileId.valueOf());

			result = await fetch(`https://api.telegram.org/file/bot${this.$token}/${result.file_path}`);

			return new BSLBinaryData(context, Buffer.from(await result.arrayBuffer()));
		}catch(e){
			await context.$BSLRunner.$throwError(context.$node, `Ошибка работы с TelegramБот: ${e.message}`);
		}
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

