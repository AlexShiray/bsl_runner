const { default: BigNumber } = require("bignumber.js");
const { BSLBool } = require("./objects/bool");
const { BSLUndefined, BSLNull } = require("./objects/undefinedNull");
const { BSLDate } = require("./objects/date");
const { BSLBreakNode } = require("../AST/breakContinueNode");
const { BSLNumber } = require("./objects/number");
const { BSLString } = require("./objects/string");
const { BSLCompiler } = require("../compile");
const { BSLBinaryData } = require("./objects/binaryData");

class BSLURLEncodingType{
	$type;
	$name;

	constructor(name){
		this.$type = require("./objects/type").BSLAvailableTypes.СпособКодированияСтроки;
		this.$name = name;
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLGCOthers = {
	СпособКодированияСтроки:{
		URLВКодировкеURL: new BSLURLEncodingType("URLВКодировкеURL"),
		КодировкаURL: new BSLURLEncodingType("КодировкаURL"),
		$help: function(context){
			console.log(`Описывает способ кодирования URL строк.
			|	Значения:
			|	URLВКодировкеURL - Кодировать (раскодировать) строку URL в URL кодировке. Спецсимволы URL ( !#$%'()*+,/:;=?@[] ) не кодируются.
			|	КодировкаURL - Кодировать (раскодировать) в URL кодировке.`.replace(/\n[\s]+\|/g, "\n"));
				return;
		}
	},

	ЗначениеЗаполнено: function (context, value) {
		if(context.$BSLRunner.$help){
			console.log(`Проверяет значение на заполненность. Для Булево - возвращает булево. Для Неопределено и NULL - всегда Ложь. Для Числа - если 0 - тогда ложь, иначе истина. Для коллекция проверяется количетсов > 0.
			|		Параметры:
			|		Значение - Тип: Произвольный. Значение, которое требуется проверить.
			|		
			|		Результат:
			|		Булево`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(value instanceof BSLString){
			return new BSLBool(value.trim() != "");
		}

		if(value instanceof BSLBool){
			return new BSLBool(true);
		}

		if(value instanceof BSLUndefined || value instanceof BSLNull){
			return new BSLBool(false); 
		}

		if(value instanceof BigNumber){
			return new BSLBool(!value.isZero());
		}
		

		let hasGetIndex = Object.getOwnPropertyNames(Object.getPrototypeOf(value)).find(elem => elem == "$getIndex")
		if(hasGetIndex){
			return new BSLBool(value.length > 0);
		}

		return true;
		
	},

	Макс: function (context, ...values) {
		if(context.$BSLRunner.$help){
			console.log(`Возвращает максимальное из переданных значений
			|		Параметры:
			|		Значение1, Значение2, ...ЗначениеN - Тип: Произвольный. 
			|		
			|		Результат:
			|		Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let newVal,
			type;

		if(values[0] instanceof BSLString){
			type = "string";
			newVal = "";
		}else
		if(values[0] instanceof BigNumber){
			type = "number";
			newVal = new BSLNumber(-99999999999999999999999999999999999999);
		}else
		if(values[0] instanceof BSLDate){
			type = "date";
			newVal = new BSLDate(context, "00010101T00:00:00");
		}else
		if(values[0] instanceof BSLBool){
			type = "bool";
			newVal = false;
		}

		for(let val of values){
			let val2;
			switch(type){
				case "string":
					if(String(val) > newVal){
						newVal = val;
					}
					break;
				
				case "number":
					val2 = new BSLNumber(val);
					if(newVal.isGreaterThan(val2)){
						newVal = val2;
					}
					break;

				case "date":
					if(val instanceof BSLDate)
						val2 = val;
					else
						val2 = new BSLDate(val);

					if(val2.getTime() > newVal.getTime()){
						newVal = val2;
					}
					break;

				case "bool":
					if(val instanceof BSLBool)
						val2 = val;
					else
						val2 = new BSLBool(val);

					if(val2.valueOf() > newVal.valueOf()){
						newVal = val2;
					}
					break;

			}
		}

		return newVal;
	},

	Мин: function (context, ...values) {
		if(context.$BSLRunner.$help){
			console.log(`Возвращает минимальное из переданных значений
			|		Параметры:
			|		Значение1, Значение2, ...ЗначениеN - Тип: Произвольный. 
			|		
			|		Результат:
			|		Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let newVal,
			type;

		if(values[0] instanceof BSLString){
			type = "string";
			newVal = "";
		}else
		if(values[0] instanceof BigNumber){
			type = "number";
			newVal = new BSLNumber(-99999999999999999999999999999999999999);
		}else
		if(values[0] instanceof BSLDate){
			type = "date";
			newVal = new BSLDate(context, "00010101T00:00:00");
		}else
		if(values[0] instanceof BSLBool){
			type = "bool";
			newVal = false;
		}

		for(let val of values){
			let val2;
			switch(type){
				case "string":
					if(String(val) < newVal){
						newVal = val;
					}
					break;
				
				case "number":
					val2 = new BSLNumber(val);
					if(newVal.isLessThan(val2)){
						newVal = val2;
					}
					break;

				case "date":
					if(val instanceof BSLDate)
						val2 = val;
					else
						val2 = new BSLDate(val);

					if(val2.getTime() < newVal.getTime()){
						newVal = val2;
					}
					break;

				case "bool":
					if(val instanceof BSLBool)
						val2 = val;
					else
						val2 = new BSLBool(val);

					if(val2.valueOf() < newVal.valueOf()){
						newVal = val2;
					}
					break;

			}
		}

		return newVal;
	},

	Вычислить: async (context, code) => {
		if(context.$BSLRunner.$help){
			console.log(`Вычисляет выражение на встроенном языке
			|		Параметры:
			|		Выражение - Тип: Строка. 
			|		
			|		Результат:
			|		Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return await context.$BSLRunner.$BSLObject.evalFormula(code);
	},

	Выполнить: async (context, code) => {
		if(context.$BSLRunner.$help){
			console.log(`Выполняет код на встроенном языке
			|		Параметры:
			|		Код - Тип: Строка. `.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		await context.$BSLRunner.$BSLObject.evalCode(code);
	},

	ВызватьИсключение: async (context, exception = undefined) => {
		if(context.$BSLRunner.$help){
			console.log(`Вызывает исключение.
			|		Параметры:
			|		ТекстИсключения - Тип: Строка. Обязателен, если не вызывается из исключения.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(exception === undefined){
			if(context.$BSLRunner.$tryNode === undefined && context.$BSLRunner.$exception === undefined)
				await context.$BSLRunner.$throwError(context.$node, `Оператор ВызватьИсключение (Raise) без аргументов может употребляться только при обработке исключения`);
			
			await context.$BSLRunner.$throwError(context.$node, context.$BSLRunner.$exception.__description, context.$BSLRunner.$exception.__pos, context.$BSLRunner.$exception.__lineNo);
		}
		await context.$BSLRunner.$throwError(context.$node, exception.toString());
	},

	ИнформацияОбОшибке: function (context) {
		if(context.$BSLRunner.$help){
			console.log(`Вычисляет выражение на встроенном языке
			|		
			|		Результат:
			|		ИнформацияОбОшибке, Неопределено - Возвращает информацию об ошибке если вызвано в исключении, иначе неопределено.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(context.$BSLRunner.$exception !== undefined){
			return context.$BSLRunner.$exception;
		}else{
			return BSLUndefined;
		}
	},

	ЗаполнитьЗначенияСвойств: function (context, acceptor, source, filled = "", ignore = "") {
		if(context.$BSLRunner.$help){
			console.log(`Заполняет одну коллекцию из другой
			|	Параметры:
			|	Приемник - Тип: Любая коллекция.
			|	Источник - Тип: Любая коллекция.
			|	ЗаполняемыеСвойства - Тип: Строка. Свойства, которые требуется заполнить через запятую.
			|	ИгнорируемыеСвойства - Тип: Строка. Свойства, которые будут игнорироваться через запятую. `.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let keysSource = Object.keys(source),
			keysAcceptor = Object.keys(acceptor),
			allKeys = [...keysSource, ...keysAcceptor],
			filledArr = filled.split(/, ?/),
			ignoreArr = ignore.split(/, ?/);

		allKeys = allKeys.filter((value, index, array)=> array.indexOf(value) === index);
		
		for(let key of allKeys){
			if(keysSource.indexOf(key) >= 0 && keysAcceptor.indexOf(key) >= 0){
				if(ignoreArr.indexOf(key) >= 0) break;

				if(filled.length == 0 || filledArr.indexOf(key) >= 0){
					acceptor[key] = source[key];
				}
			}
		}
	},

	ЗавершитьРаботу: async (context, exitCode) => {
		if(context.$BSLRunner.$help){
			console.log(`Завершает выполнение скрипта`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		await context.$BSLRunner.run(new BSLBreakNode);
	},

	Подключить: async (context, filename) => {
		if(context.$BSLRunner.$help){
			console.log(`Подключает и выполняет код в файле
			|	Параметры:
			|	ИмяФайла - Тип: Строка. Файл, который надо подключить.
			|
			|	Результат:
			|	МодульВстроенногоЯзыка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let source = await require('node:fs/promises').readFile(filename.valueOf(), {encoding: "utf-8"});

		return await context.$BSLRunner.$BSLObject.evalCode(source, filename);
	},

	ЗначениеВСтрокуВнутр: function(context, value){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует объект BSL во внутренний объект JavaScript
			|	Параметры:
			|	Объект - Тип: Произвольный.
			|
			|	Результат:
			|	ВнутреннийОбъект - Тип: Строка. Преобразованный объект.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let compiler = new BSLCompiler(value);

		compiler.compile();
		let result = JSON.stringify(compiler.get()["AST"]);
		return result;
	},

	ЗначениеИзСтрокиВнутр: function(context, value){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует внутренний объект JavaScript в объект BSL
			|	Параметры:
			|	ВнутреннийОбъект - Тип: Строка.
			|
			|	Результат:
			|	Объект - Тип: Произвольный. Преобразованный объект.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		value = JSON.parse(value);
		value = {AST: value, source: ""};
		let compiler = new BSLCompiler(value);

		let result = compiler.decompile();
		return result[1];
	},

	Число: function(context, value){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует значение в строке в Число если это возможно.
			|	Параметры:
			|	Значение - Тип: Строка.
			|
			|	Результат:
			|	Число`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLNumber(value.valueOf());
	},

	Base64Значение: function(context, str){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует строку в base64 данные.
			|	Параметры:
			|	Значение - Тип: Строка.
			|
			|	Результат:
			|	Данные - Тип: ДвоичныеДанные. Данные кодированные в base64`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLBinaryData(context, Buffer.from(str, "base64"));
	},

	Base64Строка: function(context, binData){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует base64 данные в строку.
			|	Параметры:
			|	Данные - Тип: ДвоичныеДанные.
			|
			|	Результат:
			|	Значение - Тип: Строка. Данные декодированные из base64`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLString(binData.$object.toString("base64"));
	},

	КодироватьСтроку: function(context, string, encoding){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует строку в URL формат.
			|	Параметры:
			|	Строка - Тип: Строка.
			|	ТипКодировки - Тип: СпособКодированияСтроки.
			|
			|	Результат:
			|	СтрокаURL - Тип: Строка. Данные кодированные в URL формат`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		switch(encoding.$name){
			case "URLВКодировкеURL":
				return new BSLString(encodeURI(string.valueOf()));
			
			case "КодировкаURL":
				return new BSLString(encodeURIComponent(string.valueOf()));
		}
	},

	РаскодироватьСтроку: function(context, string, encoding){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует строку из URL формата.
			|	Параметры:
			|	СтрокаURL - Тип: Строка. Строка в URL формате.
			|	ТипКодировки - Тип: СпособКодированияСтроки.
			|
			|	Результат:
			|	Строка - Тип: Строка. Данные декодированные из URL формата`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		switch(encoding.$name){
			case "URLВКодировкеURL":
				return new BSLString(decodeURI(string.valueOf()));
			
			case "КодировкаURL":
				return new BSLString(decodeURIComponent(string.valueOf()));
		}
	},

	Пауза: async function(context, delay){
		if(context.$BSLRunner.$help){
			console.log(`Останавливает выполнение кода на определенное время.
			|	Параметры:
			|	Задержка - Тип: Число. Задержка в секундах.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(context.$BSLRunner.$help){
			console.log(`Делает задержку выполнения потока
			|	Параметры:
			|	`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const delayFn = ms => new Promise(resolve => setTimeout(resolve, ms))
		await delayFn(delay * 1000);
	} 
}
