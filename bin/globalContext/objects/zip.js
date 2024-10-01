
exports.BSLZipWrite = class BSLZipWrite{
	$type;
	$object;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для записи данных в ZIP архив
		|	Конструктор:
		|   Неинициализированный
		|   
		|	По имени файла
		|		Параметры:
		|		ИмяФайла - Тип: Строка.
		|		Комментарий (необязательно) - Тип: Строка. Комментарий для архива
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));
		
		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(context, filename = undefined, comment = undefined){
		this.$type = require("./type").BSLAvailableTypes.ЗаписьZipАрхива;

		if(filename !== undefined){
			this.Открыть(context, filename, comment);
		}
	}

	async Добавить(context, filename){
		if(context.$BSLRunner.$help){
			console.log(`Добавить файл в архив
			|		Параметры:
			|		ИмяФайла - Тип: Строка.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLFile} = require("./file");

		let file = new BSLFile(context, filename);

		if(await file.ЭтоКаталог(context) == true){
			this.$object.addLocalFolder(filename);
		}else{
			this.$object.addLocalFile(filename);
		}
	}

	async ДобавитьИзДвоичныхДанных(context, binData, filename){
		if(context.$BSLRunner.$help){
			console.log(`Добавление файла из двоичных данных
			|		Параметры:
			|		ДвоичныеДанные - Данные файла
			|       ИмяФайла - Тип: Строка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}
		this.$object.addFile(filename.valueOf(), binData.$object);
	}

	Записать(context){
		if(context.$BSLRunner.$help){
			console.log(`Записать архив на диск`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.writeZip();
	}

	Открыть(context, filename, comment = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Открыть файл ZIP архива
			|		Параметры:
			|		ИмяФайла - Тип: Строка.
			|       Комментарий - Тип: Строка. Комментарий к архиву`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const zip = require('adm-zip');

		this.$object = new zip(filename.valueOf());

		if(comment !== undefined)
			this.$object.addZipComment(comment);
	}

	async ПолучитьДвоичныеДанные(context){
		if(context.$BSLRunner.$help){
			console.log(`Записать архив и получить двоичные данные
			|		
			|		Результат:
			|		ДвоичныеДанные`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLBinaryData} = require("./binaryData");
		return new BSLBinaryData(context, this.$object.toBuffer());
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLZipRead = class BSLZipRead{
	$type;
	Комментарий;
	Элементы;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для чтения данных из ZIP архива
		|	Конструктор:
		|   Неинициализированный
		|   
		|	По имени файла
		|		Параметры:
		|		ИмяФайла - Тип: Строка.
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));
		
		const {showHelpsForMethods} = require("./__objectHelper");

		await showHelpsForMethods(this, context);

		console.log(`Параметры:
			|	Комментарий - Тип: Строка. Только чтение. Комментарий архива
			|	Элементы - Тип: ЭлементыZipАрхива. Только чтение.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, filename = undefined){
		const {setWriteOnly} = require("./__objectHelper");
		this.$type = require("./type").BSLAvailableTypes.ЧтениеZipАрхива;

		if(filename !== undefined){
			this.Открыть(context, filename);
		}

		this.Элементы = new BSLZipElements(context);

		setWriteOnly(this, "Элементы");
	}

	Открыть(context, filename){
		if(context.$BSLRunner.$help){
			console.log(`Открыть ZIP архив для чтения
			|		Параметры:
			|		ИмяФайла - Тип: Строка.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const zip = require('adm-zip'),
			{BSLString} = require("./string"),
			{BSLNumber} = require("./number"),
			{BSLDate} = require("./date"),
			{BSLFile} = require("./file"),
			{setWriteOnly} = require("./__objectHelper"),
			{BSLBinaryData} = require("./binaryData");

		if(filename instanceof BSLBinaryData){
			this.$object = new zip(filename.$object);
		}else{
			this.$object = new zip(filename.valueOf());
		}

		this.Комментарий = this.$object.getZipComment();

		let entries = this.$object.getEntries();
		for(let entry of entries){
			let zipEntry = new BSLZipElement(entry);

			zipEntry.Имя = new BSLString(entry.name);
			zipEntry.ВремяИзменения = new BSLDate(context, entry.header.time);

			let file = new BSLFile(context, entry.name);

			zipEntry.ИмяБезРасширения = file.ИмяБезРасширения;
			zipEntry.Расширение = file.Расширение;
			zipEntry.РазмерНесжатого = new BSLNumber(entry.header.size);
			zipEntry.РазмерСжатого = new BSLNumber(entry.header.compressedSize);

			setWriteOnly(zipEntry, "Имя");
			setWriteOnly(zipEntry, "ВремяИзменения");
			setWriteOnly(zipEntry, "ИмяБезРасширения");
			setWriteOnly(zipEntry, "РазмерНесжатого");
			setWriteOnly(zipEntry, "РазмерСжатого");
			setWriteOnly(zipEntry, "Расширение");

			this.Элементы.$object.push(zipEntry);
		}
	}

	Извлечь(context, entry, pathname){
		if(context.$BSLRunner.$help){
			console.log(`Извлечь файл из архива на диск
			|		Параметры:
			|		Элемент - Тип: ЭлементZipАрхива.
			|       ПутьКФайлу - Тип: Строка.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.extractEntryTo(entry.$object, pathname, true, true);
	}

	ПолучитьДвоичныеДанные(context, entry){
		if(context.$BSLRunner.$help){
			console.log(`Получить двоичные данные файла
			|		Параметры:
			|		Элемент - Тип: ЭлементZipАрхива
			|		
			|		Результат:
			|		ДвоичныеДанные`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLBinaryData} = require("./binaryData");
		return new BSLBinaryData(context, entry.$object.compressedData);
	}

	ИзвлечьВсе(context, pathname){
		if(context.$BSLRunner.$help){
			console.log(`Извлечь все файлы в папку на диске
			|		Параметры:
			|		ИмяПапки - Тип: Строка.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.extractAllTo(pathname, true);
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLZipElements = class BSLZipElements{
	$type;
	$object = [];
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект содержащий элементы ZIP архива
		|   Можно получить элементы через Цикл или [], значением выступает индекс элемента 
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));
		
		const {showHelpsForMethods} = require("./__objectHelper");

		await showHelpsForMethods(this, context);

		return;
	}

	constructor(context){
		this.$type = require("./type").BSLAvailableTypes.ЭлементыZipАрхива;
	}

	$getIndex(index){
		return this.$object[index.valueOf()];
	}

	*[Symbol.iterator]() {
		for(let val of this.$object){
			yield new BSLZipElement(val);
		}
	}

	Количество(context){
		if(context.$BSLRunner.$help){
			console.log(`Получить количество файлов в ZIP архиве
			|		Результат:
			|		Число - Количество элементов`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require("./number");
		return new BSLNumber(this.$object.length);
	}

	Найти(context, name){
		if(context.$BSLRunner.$help){
			console.log(`Поиск в строке по регулярному выражению
			|		Параметры:
			|		Имя - Тип: Строка. Имя файла в архиве
			|		
			|		Результат:
			|		ЭлементZipАрхива, Неопределено - Возвращает элемент архива, либо неопределено, если не найдено`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLUndefined} = require("./undefinedNull");

		let result = this.$object.find(item => item.Имя == name.valueOf());

		if(result === undefined)
			return BSLUndefined;

		return result;
	}

	Получить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Получить элемент архива по индексу. Работает аналогично []
			|		Параметры:
			|		Индекс - Тип: Число. Индекс элемента в коллекции
			|		
			|		Результат:
			|		ЭлементZipАрхива`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$getIndex(index);
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLZipElement = class BSLZipElement{
	$type;
	$object;
	Имя;
	ВремяИзменения;
	ИмяБезРасширения;
	РазмерНесжатого;
	РазмерСжатого;
	Расширение;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект файла в ZIP архиве
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));
		
		const {showHelpsForMethods} = require("./__objectHelper");

		await showHelpsForMethods(this, context);

		console.log(`Параметры:
			|	Имя - Тип: Строка. Только чтение. Имя файла
			|	ВремяИзменения - Тип: Дата. Только чтение.
			|	ИмяБезРасширения - Тип: Строка. Только чтение.
			|	РазмерНесжатого - Тип: Число. Только чтение. 
			|	РазмерСжатого - Тип: Число. Только чтение.
			|	Расширение - Тип: Строка. Только чтение. `.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(entry){
		this.$type = require("./type").BSLAvailableTypes.ЭлементZipАрхива;

		this.$object = entry;
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}