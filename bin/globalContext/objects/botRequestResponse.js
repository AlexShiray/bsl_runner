
exports.BSLBotRequest = class BSLBotRequest{
	$type;
	$owner;
	Тело;
	ЧатИдентификатор;
	Дата;
	ОтправительИдентификатор;
	Параметры;
	СообщениеИдентификатор;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект описывающий полученное сообщение из бота
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Тело - Тип: Структура, Массив. Только чтение. Тело полученное с сервера.
		|	ЧатИдентификатор - Тип: Число, Строка. Только чтение. Идентификатор чата для отправки ответного сообщения.
		|	ОтправительИдентификатор - Тип: Число, Строка. Только чтение. Идентификатор пользователя, отправившего сообщение.
		|	СообщениеИдентификатор - Тип: Число, Строка. Только чтение. Идентификатор полученного сообщения.
		|	Дата - Тип: Дата. Только чтение. Дата полученного сообщения.
		|	Параметры - Тип: Соответствие. Только чтение. Параметры обработчика метода, которые были определены при установке метода`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, bot, parameters, chatId, date, fromId, msgId){
		const { setWriteOnly } = require("./__objectHelper");
		const { BSLDate } = require("./date");

		this.$type = require("./type").BSLAvailableTypes.БотЗапрос;
		this.Параметры = parameters;
		this.ЧатИдентификатор = chatId;

		if(date instanceof Date) 
			date = new BSLDate(context, date);

		this.Дата = date;
		this.ОтправительИдентификатор = fromId;
		this.СообщениеИдентификатор = msgId;
		this.$owner = bot;

		setWriteOnly(this, "Параметры");
		setWriteOnly(this, "ЧатИдентификатор");
		setWriteOnly(this, "Дата");
		setWriteOnly(this, "ОтправительИдентификатор");
		setWriteOnly(this, "СообщениеИдентификатор");
	}

	Владелец(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает бота-владельца.
			|		
			|		Результат:
			|		ОбъектБота - Тип: TelegramБот. Возвращает объект бота. Например для отправки ответного сообщения или выполнения других операций`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$owner;
	} 

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

// exports.BSLBotResponse = class BSLBotResponse{
//     $type;
//     $body;
//     $bot;

//     constructor(context, bot){
//         this.$type = require("./type").BSLAvailableTypes.БотОтвет;
//         this.$bot = bot;
//     }

//     ПолучитьТелоКакДвоичныеДанные(context){
//         const { BSLBinaryData } = require("./binaryData");
//         return new BSLBinaryData(context, this.$body);
//     }

//     ПолучитьТелоКакСтроку(context){
//         const { BSLString } = require("./string");
//         return new BSLString(this.$body.toString());
//     }

//     УстановитьТелоИзДвоичныхДанных(context, data){
//         const { BSLBinaryData } = require("./binaryData");
//         if(data instanceof BSLBinaryData)
//             this.$body = data;
//     }

//     УстановитьТелоИзСтроки(context, body){
//         this.$body = Buffer.from(body.valueOf());
//     }

//     toString(){
//         return this.$type.toString();
//     }

//     typeOf(){
//         return this.$type;
//     }
// }