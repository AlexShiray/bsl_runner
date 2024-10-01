
exports.BSLFile = class BSLFile{
	ИмяБезРасширения;
	Имя;
	Путь;
	Расширение;
	ПолноеИмя;
	$stats;
	$type;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с файлами
		|	Конструктор:
		|   Создание неинициализированного объекта.
		|	По имени файла:
		|		Параметры:
		|		ИмяФайла - Тип: Строка. 
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Имя - Тип: Строка. Только чтение. Имя файла
		|	ПолноеИмя - Тип: Строка. Только чтение. Полное имя файла с путем
		|	ИмяБезРасширения - Тип: Строка. Только чтение. Имя файла без расширения
		|	Расширение - Тип: Строка. Только чтение. Расширение имени файла
		|	Путь - Тип: Строка. Только чтение. Путь к файлу`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, filename = ""){
		const path = require('node:path');
		this.$type = require("./type").BSLAvailableTypes.Файл;

		let parsedPath = path.parse(filename.valueOf());
		this.Имя = parsedPath.base;
		this.Расширение = parsedPath.ext;
		this.Путь = parsedPath.dir;
		this.ИмяБезРасширения = parsedPath.name;

		this.ПолноеИмя = path.normalize(filename.valueOf());
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}

	async #getStats(context){
		if(this.$stats == undefined){
			try{
				this.$stats = await require("node:fs/promises").stat(this.ПолноеИмя);
			}catch(e){
				context.$BSLRunner.$throwError(context.$node, `Ошибка доступа к файлу: ${this.ПолноеИмя}`);
			}
		}
	}

	async ПолучитьВремяИзменения(context){
		if(context.$BSLRunner.$help){
			console.log(`Получает время изменения файла
			|		Результат:
			|		Дата`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLDate} = require('./date');
		await this.#getStats(context);
		return new BSLDate(context, this.$stats.mtime);
	}

	async ПолучитьТолькоЧтение(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает атрибут "Только чтение" для файла
			|		Результат:
			|		Булево`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBool } = require('./bool');
		await this.#getStats(context);
		return new BSLBool(!(this.$stats.mode & 200));
	}

	async ПолучитьУниверсальноеВремяИзменения(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает время изменения по UTC-0
			|		Результат:
			|		Дата`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLDate} = require('./date');
		await this.#getStats(context);
		let date = new BSLDate(context, this.$stats.mtime | "0001-01-01T00:00:00");

		return date.__add__(context, date.getTimezoneOffset() * 60);
	}

	async Размер(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает размер файла в байтах
			|		Результат:
			|		Число - Размер файла в байтах`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require('./number');
		await this.#getStats(context);
		return new BSLNumber(this.$stats.size | 0);
	}

	async Существует(context){
		if(context.$BSLRunner.$help){
			console.log(`Проверяет существование файла на диске
			|		Результат:
			|		Булево - Если Истина - то файл существует`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBool } = require('./bool');
		try{
			await require("node:fs/promises").access(this.ПолноеИмя, require("node:fs/promises").constants.F_OK)
			return new BSLBool(true);
		}catch(e){
			return new BSLBool(false);
		}
	}

	async ЭтоКаталог(context){
		if(context.$BSLRunner.$help){
			console.log(`Проверяет является ли файл каталогом
			|		Результат:
			|		Булево - Если Истина это каталог, иначе это файл`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBool } = require('./bool');
		await this.#getStats(context);
		return new BSLBool(this.$stats.mode & 0o0040000);
	}

	async ЭтоФайл(context){
		if(context.$BSLRunner.$help){
			console.log(`Проверяет является ли файл файлом
			|		Результат:
			|		Булево - Если Истина файл является файлом, иначе это каталог`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBool } = require('./bool');
		await this.#getStats(context);
		return new BSLBool(this.$stats.mode & 0o0100000);
	}
}