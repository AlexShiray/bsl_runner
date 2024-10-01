const { BSLBool } = require("./objects/bool");
const {BSLArray} = require("./objects/array")
	, {BSLRegexpResult, BSLRegexpGroupOfResult} = require("./objects/regexp")
	, BigNumber = require('bignumber.js')
;

exports.BSLGCStrings = {
	Символы: {
		ВК: "\r",
		Таб: "\t",
		НПП: "\xa0",
		ПС: "\n"
	},

	НаправлениеПоиска: {
		СНачала: 0,
		СКонца: 1
	},

	Сообщить: function (context, operand) {
		if(context.$BSLRunner.$help){
			console.log(`Выводит сообщение на экран
			|	Параметры:
			|	Строка - Строка для вывода`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLNumber } = require("./objects/number");

		if(operand === undefined){
			return;
		}else
		if(operand instanceof BigNumber){
			context.$BSLRunner.$BSLObject.userMessage = operand.toFormat();
		}else
		if(typeof(operand) === "number"){
			context.$BSLRunner.$BSLObject.userMessage = (new BSLNumber(operand)).toFormat();
		}else
		{
			context.$BSLRunner.$BSLObject.userMessage = operand.toString();
		}
	},

	debug: function (context, operand) {
		if(context.$BSLRunner.$help){
			console.log(`Внутренная функция для вывода в терминал внутреннего объекта
			|	Параметры:
			|	Объект - Тип: Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		console.log(operand);
	},

	ВРег: function (context, operand) {
		if(context.$BSLRunner.$help){
			console.log(`Преобразование букв в слове в верхний регистр
			|	Параметры:
			|	Строка - Исходная строка
			|	
			|	Результат:
			|	Строка - Преобразованная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");
		return BSLString(operand.valueOf().toUpperCase());
	},

	НРег: function (context, operand) {
		if(context.$BSLRunner.$help){
			console.log(`Преобразование букв в слове в нижний регистр
			|	Параметры:
			|	Строка - Исходная строка
			|	
			|	Результат:
			|	Строка - Преобразованная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");
		return new BSLString(operand.valueOf().toLowerCase());
	},

	СтрДлина: function (context, operand) {
		if(context.$BSLRunner.$help){
			console.log(`Преобразование букв в слове в верхний регистр
			|	Параметры:
			|	Строка - Исходная строка
			|	
			|	Результат:
			|	Число - Преобразованная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require("./objects/number");
		return new BSLNumber(operand.valueOf().length);
	},

	Сред: function (context, string, startPos, length = undefined) {
		if(context.$BSLRunner.$help){
			console.log(`Получение подстроки, начиная с <НачальнаяПозиция> размером с <Длина>
			|	Параметры:
			|	Строка - Исходная строка.
			|	НачальнаяПозиция - Тип: Число. Позиция с которой будет выбрана подстрока
			|	Длина - Тип: Число. Количество выбираемых символов
			|	
			|	Результат:
			|	Строка - Выбранная подстрока`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");

		startPos = startPos.valueOf();

		startPos--;
		startPos = startPos < 0 ? 0 : startPos;

		if(length === undefined) length = this.СтрДлина(context, string);
		
		return new BSLString(string.valueOf().substring(startPos, startPos + length.valueOf()));
	},

	СокрЛ: function (context, string) {
		if(context.$BSLRunner.$help){
			console.log(`Удаление незначительных символов с начала строки
			|	Параметры:
			|	Строка - Исходная строка.
			|	
			|	Результат:
			|	Строка - Преобразованная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");

		return new BSLString(string.valueOf().trimStart());
	},

	СокрП: function (context, string) {
		if(context.$BSLRunner.$help){
			console.log(`Удаление незначительных символов с конца строки
			|	Параметры:
			|	Строка - Исходная строка.
			|	
			|	Результат:
			|	Строка - Преобразованная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");

		return new BSLString(string.valueOf().trimEnd());
	},

	СокрЛП: function (context, string) {
		if(context.$BSLRunner.$help){
			console.log(`Удаление незначительных символов с начала и конца строки
			|	Параметры:
			|	Строка - Исходная строка.
			|	
			|	Результат:
			|	Строка - Преобразованная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");

		return new BSLString(string.valueOf().trim());
	},

	Лев: function (context, string, length) {
		if(context.$BSLRunner.$help){
			console.log(`Получение подстроки с начала строки размером с <Длина>
			|	Параметры:
			|	Строка - Исходная строка.
			|	Длина - Тип: Число. Количество символов которое надо отобрать
			|	
			|	Результат:
			|	Строка - Выбранная подстрока`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");

		return new BSLString(string.valueOf().substring(0, length.valueOf()));
	},

	Прав: function (context, string, length) {
		if(context.$BSLRunner.$help){
			console.log(`Получение подстроки с конца строки размером с <Длина>
			|	Параметры:
			|	Строка - Исходная строка.
			|	Длина - Тип: Число. Количество символов которое надо отобрать
			|	
			|	Результат:
			|	Строка - Выбранная подстрока`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");

		return new BSLString(string.valueOf().substring(string.valueOf().length - length.valueOf()));
	},

	ПустаяСтрока: function (context, string) {
		if(context.$BSLRunner.$help){
			console.log(`Проверка строки на значащие символы
			|	Параметры:
			|	Строка - Исходная строка.
			|	
			|	Результат:
			|	Булево - Если истина, то строка не содержит значащих символов`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLBool} = require("./objects/bool");
		return new BSLBool(string.valueOf().trim() == "");
	},

	СтрЗаменить: function (context, string, search, replace) {
		if(context.$BSLRunner.$help){
			console.log(`Замена в исходной строке по подстроке
			|	Параметры:
			|	Строка - Исходная строка.
			|	ПодстрокаПоиска - Тип: Строка. Строка которую надо найти в исходной строке
			|	ПодстрокаЗамены - Тип: Строка. Строка, на которую надо заменить найденную подстроку
			|	
			|	Результат:
			|	Строка - Итоговая строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLString} = require("./objects/string");

		return new BSLString(string.valueOf().replace(search.valueOf(), replace.valueOf()));
	},

	СтрНайти: async (context, string, search, searchDirection = 0, position = 0, entryNumber = 1) => {
		if(context.$BSLRunner.$help){
			console.log(`Поиск в исходной строке подстроки
			|	Параметры:
			|	Строка - Исходная строка.
			|	ПодстрокаПоиска - Тип: Строка. Строка которую надо найти в исходной строке
			|	НаправлениеПоиска (необязательно) - Тип: НаправлениеПоиска. 
			|	НачальнаяПозиция (необязательно) - Тип: Число
			|	НомерВхождения (необязательно) - Тип: Число
			|	
			|	Результат:
			|	Число - Индекс первого символа найденной подстроки`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require("./objects/number"),
			{BSLUndefined} = require("./objects/undefinedNull");

		let currentEntry = 0,
			result;

		position = position.valueOf();
		entryNumber = entryNumber.valueOf();

		position--;
		if(searchDirection.valueOf() == 0){
			position = position <= -1 ? 0 : position;

			while(currentEntry < entryNumber){
				result = string.valueOf().indexOf(search.valueOf(), position) + 1;
				currentEntry++;
			}

			if(result === undefined) return BSLUndefined;

			return new BSLNumber(result);
		}else
		if(searchDirection.valueOf() == 1){
			position = position <= -1 ? string.valueOf().length - 1 : position;

			while(currentEntry < entryNumber){
				result = string.valueOf().lastIndexOf(search.valueOf(), position) + 1;
				currentEntry++;
			}

			if(result === undefined) return BSLUndefined;
			
			return new BSLNumber(result);
		}else{
			await context.$BSLRunner.$throwError(context.$BSLRunner, context.$node, `Ошибка при вызове метода контекста (${context.$node.text}): Несоответствие типов (параметр номер '3')`);
		}
	},

	СтрЗаменитьПоРегулярномуВыражению: function (context, string, pattern, replace, caseI = false, multiLine = false) {
		if(context.$BSLRunner.$help){
			console.log(`Поиск и замена в исходной строке по регулярному выражению
			|	Параметры:
			|	Строка - Исходная строка.
			|	Шаблон - Тип: Строка. Шаблон регулярного выражения (без начальних и последних "/")
			|	ПодстрокаЗамены - Тип: Строка.  Можно указывать группы $n - где n - номер группы в шаблоне.
			|	НечувствительныйРегистр (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	Мультистрока (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	
			|	Результат:
			|	Строка - Строка после замены`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLString } = require("./objects/string");

		let flags = "";

		if(caseI.valueOf() == true){
			flags += "i";
		}

		if(multiLine.valueOf() == true){
			flags += "m";
		}

		let regexp = new RegExp(pattern.valueOf(), flags);

		return new BSLString(string.valueOf().replace(regexp, replace.valueOf()));
	},

	СтрНайтиПоРегулярномуВыражению: function (context, string, pattern, position = 0, entryNumber = 1, caseI = false, multiLine = false) {
		if(context.$BSLRunner.$help){
			console.log(`Поиск в исходной строке по регулярному выражению
			|	Параметры:
			|	Строка - Исходная строка.
			|	Шаблон - Тип: Строка. Шаблон регулярного выражения (без начальних и последних "/")
			|	НачальнаяПозиция - Тип: Число.
			|	НомерВхождения - Тип: Число.
			|	НечувствительныйРегистр (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	Мультистрока (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	
			|	Результат:
			|	РезультатПоискаПоРегулярномуВыражению - Объект содержащий результат поиска по регулярному выражению`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let flags = "",
			currentEntry = 0,
			groups;

		if(caseI.valueOf() == true){
			flags += "i";
		}

		if(multiLine.valueOf() == true){
			flags += "m";
		}

		position = position.valueOf();
		entryNumber = entryNumber.valueOf();

		position = position == 0 ? position : position - 1;

		string = string.valueOf().substring(position);

		let regexp = new RegExp(pattern.valueOf(), flags);

		while(currentEntry < entryNumber){
			groups = string.match(regexp);
			currentEntry++;
		}

		let result = new BSLRegexpResult();

		result.НачальнаяПозиция = groups.index + 1;
		result.Значение = groups[0];
		result.Длина = groups[0].length;

		for(let match of groups){
			let group = new BSLRegexpGroupOfResult(),
				index = string.indexOf(match) + 1;

			group.НачальнаяПозиция = index;
			group.Значение = match;
			group.Длина = match.length;

			result.__addGroup(group);
		}

		return result;
	},

	СтрРазделить: function (context, string, delimiter, includeEmpty = true) {
		if(context.$BSLRunner.$help){
			console.log(`Разделить строку по разделителю
			|	Параметры:
			|	Строка - Исходная строка.
			|	Разделитель - Тип: Строка. 
			|	ВключатьПустые (необязательно) - Тип: Булево. По умолчанию: Истина
			|	
			|	Результат:
			|	Массив - Массив строк после разделения`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLString } = require("./objects/string");

		let arr = string.valueOf().split(delimiter.valueOf());

		if(!includeEmpty.valueOf()){
			arr = arr.filter(elem => elem.length > 0);
		}

		for(let i in arr){
			arr[i] = new BSLString(arr[i]);
		}

		return new BSLArray(context, arr);
	},

	СтрСоединить: function (context, arr, delimiter = "") {
		if(context.$BSLRunner.$help){
			console.log(`Соединить строку по разделителю
			|	Параметры:
			|	Массив - Массив строк.
			|	Разделитель - Тип: Строка. 
			|	
			|	Результат:
			|	Строка - Соединенная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLString } = require("./objects/string");

		return new BSLString(arr.valueOf().join(delimiter.valueOf()));
	},

	СтрПодобнаПоРегулярномуВыражению: function (context, string, pattern, caseI = false, multiLine = false) {
		if(context.$BSLRunner.$help){
			console.log(`Проверка соответствия строки регулярному выражению
			|	Параметры:
			|	Строка - Исходная строка.
			|	Шаблон - Тип: Строка. Шаблон регулярного выражения (без начальних и последних "/")
			|	НечувствительныйРегистр (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	Мультистрока (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	
			|	Результат:
			|	Булево - Если истина - строка соответствует регулярному выражению`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let flags = "";

		if(caseI.valueOf() == true){
			flags += "i";
		}

		if(multiLine.valueOf() == true){
			flags += "m";
		}

		let regexp = new RegExp(pattern.valueOf(), flags);

		return new BSLBool(regexp.test(string.valueOf()));
	},

	СтрНайтиВсеПоРегулярномуВыражению : function (context, string, pattern, caseI = false, multiLine = false) {
		if(context.$BSLRunner.$help){
			console.log(`Поиск всех вхождений в исходной строке по регулярному выражению
			|	Параметры:
			|	Строка - Исходная строка.
			|	Шаблон - Тип: Строка. Шаблон регулярного выражения (без начальних и последних "/")
			|	НечувствительныйРегистр (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	Мультистрока (необязательно) - Тип: Булево. По умолчанию: Ложь
			|	
			|	Результат:
			|	РезультатПоискаПоРегулярномуВыражению - Объект содержащий результат поиска по регулярному выражению`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let flags = "g",
			groups;

		if(caseI.valueOf() == true){
			flags += "i";
		}

		if(multiLine.valueOf() == true){
			flags += "m";
		}

		let regexp = new RegExp(pattern.valueOf(), flags);
		groups = string.valueOf().matchAll(regexp);

		let result = new BSLRegexpResult();

		result.НачальнаяПозиция = groups.index + 1;
		result.Значение = groups[0];
		result.Длина = groups[0].length;

		for(let match of groups){
			let group = new BSLRegexpGroupOfResult(),
				index = string.indexOf(match) + 1;

			group.НачальнаяПозиция = index;
			group.Значение = match;
			group.Длина = match.length;

			result.__addGroup(group);
		}

		return result;
	},

	КодСимвола: function (context, string, position = 0) {
		if(context.$BSLRunner.$help){
			console.log(`Получает код символа из строки
			|	Параметры:
			|	Строка - Исходная строка.
			|	НомерСимвола (необязательный) - Тип: Число. Индекс символа в строке код которого надо получить (По умолчанию: 0)
			|	
			|	Результат:
			|	РезультатПоискаПоРегулярномуВыражению - Объект содержащий результат поиска по регулярному выражению`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		position = position.valueOf();
		position = position == 0 ? position : position - 1;

		return string.valueOf().charCodeAt(position);
	},
}
