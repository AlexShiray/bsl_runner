
exports.BSLQuery = class BSLQuery{
	$type;
	Текст;
	Параметры;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с текстами запросов к базам данных
		|	Конструктор:
		|   По умолчанию: Новый Запрос();
		|	По тексту запроса
		|		Параметры:
		|		ТекстЗапроса - Тип: Строка. Текст запроса.
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Текст - Тип: Строка. Текст вызываемого запроса
		|	Параметры - Тип: Структура. Параметры вызываемого запроса. Параметры в тексте указываются как &Параметр`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, queryText = ""){
		const { BSLStruct } = require("./struct");

		this.$type = require("./type").BSLAvailableTypes.Запрос;
		this.Текст = queryText.valueOf();
		this.Параметры = new BSLStruct(context);
	}

	УстановитьПараметр(context, paramName, paramVal){
		if(context.$BSLRunner.$help){
			console.log(`Присваивание значение параметру для запроса
			|		Параметры:
			|		ИмяПараметра - Тип: Строка. Имя параметра, который указан как &Параметр в тексте запроса
			|       ЗначениеПараметра - Тип: Произвольный. Значение параметра`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.Параметры.Вставить(context, paramName.valueOf(), paramVal.valueOf());
	}

	async Выполнить(context, database){
		if(context.$BSLRunner.$help){
			console.log(`Выполнить запрос к базе данных
			|		Параметры:
			|		БазаДанных - Тип: БазаДанных. Подключенная база данных к которой надо выполнить запрос.
			|		
			|		Результат:
			|		РезультатЗапроса`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLDatabase } = require("./database");
		if(!database instanceof BSLDatabase){
			context.$BSLRunner.$throwError(context.$node, `Не заполнена база данных`);
		}

		return await database.ВыполнитьЗапрос(context, this);
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLQueryResult = class BSLQueryResult{
	$type;
	$object;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Результат запроса к базе данных 
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(resultSet){
		this.$type = require("./type").BSLAvailableTypes.РезультатЗапроса;
		this.$object = resultSet;
	}

	Пустой(context){
		if(context.$BSLRunner.$help){
			console.log(`Проверяет результат запроса на пустые данные
			|		
			|		Результат:
			|		Булево - Если истина результат пустой`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLBool} = require("./bool");
		return new BSLBool(this.$object.length <= 0);
	}

	Выгрузить(context){
		if(context.$BSLRunner.$help){
			console.log(`Выгружает результат запроса в ТаблицуЗначений
			|		
			|		Результат:
			|		ТаблицаЗначений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLValueTable } = require("./valueTable");
		const { BSLJSCodeResult } = require("./jsCode");

		let result = new BSLValueTable;

		for(let column of this.$object.meta){
			result.Колонки.Добавить(context, column.name());
		}

		for(let row of this.$object){
			let newRow = result.Добавить(context);
			for(let column of this.$object.meta){
				let columnName = column.name();
				newRow.Установить(context, columnName, new BSLJSCodeResult(row[columnName]));
			}
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