
exports.BSLRegexpResult = class BSLRegexpResult{
	$type;
	Длина;
	Значение;
	НачальнаяПозиция;
	$groups = [];
	$help = Object.getPrototypeOf(this).constructor.$help;

	static $help(){

	}

	constructor(context){
		this.$type = require("./type").BSLAvailableTypes.РезультатПоискаПоРегулярномуВыражению;
	}

	ПолучитьГруппы(context){
		return this.$groups;
	}

	__addGroup(group){
		this.$groups.push(group);
	}

	toString(){
        return this.$type.toString();
    }

    typeOf(){
        return this.$type;
    }
}

exports.BSLRegexpGroupOfResult = class BSLRegexpGroupOfResult{
	$type;
	Длина;
	Значение;
	НачальнаяПозиция;

	constructor(context){
		this.$type = require("./type").BSLAvailableTypes.ГруппаРезультатаПоискаПоРегулярномуВыражению;
	}

	toString(){
        return this.$type.toString();
    }

    typeOf(){
        return this.$type;
    }
}

exports.BSLRegexp = class BSLRegexp{
	$type;
	Шаблон;
	ИгнорироватьРегистр;
	МногострочныйПоиск;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с регулярными выражениями
		|	Конструктор:
		|	По шаблону
		|		Параметры:
		|		Шаблон - Тип: Строка. Шаблон регулярного выражения (без начальных и конечных "/")
		|		НечувствительныйРегистр (необязательно) - Тип: Булево. По умолчанию: Ложь
		|		Мультистрока (необязательно) - Тип: Булево. По умолчанию: Ложь
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Шаблон - Тип: Строка. Только чтение. Шаблон регулярного выражения
		|	ИгнорироватьРегистр - Тип: Булево. Только чтение.
		|	МногострочныйПоиск - Тип: Булево. Только чтение.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, pattern, caseI = false, multiLine = true){
		this.$type = require("./type").BSLAvailableTypes.РегулярноеВыражение;

		this.Шаблон = pattern;
		this.ИгнорироватьРегистр = caseI;
		this.МногострочныйПоиск = multiLine;
	}

	$getFlags(){
		let flags = "";

		if(this.ИгнорироватьРегистр.valueOf() == true){
			flags += "i";
		}

		if(this.МногострочныйПоиск.valueOf() == true){
			flags += "m";
		}

		return flags;
	}

	Найти(context, str){
		if(context.$BSLRunner.$help){
			console.log(`Поиск в строке по регулярному выражению
			|		Параметры:
			|		Строка - Исходная строка
			|		
			|		Результат:
			|		РезультатПоискаПоРегулярномуВыражению`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLUndefined } = require("./undefinedNull"),
			{BSLNumber} = require("./number"),
			{BSLString} = require("./string");

		let regexp = new RegExp(this.Шаблон, this.$getFlags());

		let groups = str.valueOf().match(regexp);

		if(!groups) return BSLUndefined;

		let result = new exports.BSLRegexpResult();

		result.НачальнаяПозиция = new BSLNumber(groups.index + 1);
		result.Значение = new BSLString(groups[0]);
		result.Длина = new BSLNumber(groups[0].length);

		for(let match of groups){
			let group = new exports.BSLRegexpGroupOfResult(),
				index = str.indexOf(match) + 1;

			group.НачальнаяПозиция = new BSLNumber(index);
			group.Значение = new BSLString(match);
			group.Длина = new BSLNumber(match.length);

			result.__addGroup(group);
		}

		return result;
	}

	Подобно(context, str){
		if(context.$BSLRunner.$help){
			console.log(`Проверить строку на соответствие регулярному выражению
			|		Параметры:
			|		Строка - Исходная строка
			|	
			|		Результат:
			|		Булево - Если истина - строка соответствует`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLBool } = require("./bool");
		let regexp = new RegExp(this.Шаблон, this.$getFlags());

		return new BSLBool(regexp.test(str.valueOf()));
	}

	Заменить(context, str, replace){
		if(context.$BSLRunner.$help){
			console.log(`Заменить в строке по регулярному выражению
			|		Параметры:
			|		Строка - Исходная строка
			|		
			|		Результат:
			|		Строка - Измененная строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLString } = require("./string");
		let regexp = new RegExp(this.Шаблон, this.$getFlags());

		return new BSLString(str.valueOf().replace(regexp, replace.valueOf()));
	}

	НайтиВсе(context, str){
		if(context.$BSLRunner.$help){
			console.log(`Поиск в строке по регулярному выражению
			|		Параметры:
			|		Строка - Исходная строка
			|		
			|		Результат:
			|		РезультатПоискаПоРегулярномуВыражению`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}
		
		const { BSLUndefined } = require("./undefinedNull"),
			{BSLNumber} = require("./number"),
			{BSLString} = require("./string");

		let regexp = new RegExp(this.Шаблон, this.$getFlags());
		let groups = str.matchAll(regexp);

		if(!groups) return BSLUndefined;

		let result = new exports.BSLRegexpResult();

		result.НачальнаяПозиция = new BSLNumber(groups.index + 1);
		result.Значение = new BSLString(groups[0]);
		result.Длина = new BSLNumber(groups[0].length);

		for(let match of groups){
			let group = new exports.BSLRegexpGroupOfResult(),
				index = str.indexOf(match) + 1;

			group.НачальнаяПозиция = new BSLNumber(index);
			group.Значение = new BSLString(match);
			group.Длина = new BSLNumber(match.length);

			result.__addGroup(group);
		}

		return result;
	}

	toString(){
        return this.$type.toString();
    }

    typeOf(){
        return this.$type;
    }
}