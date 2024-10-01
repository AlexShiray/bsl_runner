
exports.BSLDataHashing = class BSLDataHashing{
	$hashObj;
	$hashFunc;
	$type;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с хешированием данных
		|	Конструктор:
		|   По хеш-функции.
		|		Параметры:
		|		ХешФункция - Тип: ХешФункция. Используемая хеш функция. 
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(context, hashFunc){
		const { createHash } = require('node:crypto');

		this.$type = require("./type").BSLAvailableTypes.ХешированиеДанных;
		
		this.$hashFunc = hashFunc;
		if(this.$hashFunc.name == "CRC32"){
			this.$hashObj = new BSLCRC32();
		}else{
			this.$hashObj = createHash(this.$hashFunc.name);
		}
	}

	Добавить(context, binary){
		if(context.$BSLRunner.$help){
			console.log(`Добавляет двоичные данные для хеширования
			|
			|	Параметры:
			|	Данные - Тип: ДвоичныеДанные. Данные добавляемые для хеширования`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBinaryData } = require('./binaryData');

		if(binary instanceof BSLBinaryData){
			this.$hashObj.update(binary.data);
		}
	}

	ДобавитьФайл(context, filename){
		if(context.$BSLRunner.$help){
			console.log(`Добавляет файл по его имени в данные для хеширования
			|		
			|	Параметры:
			|	ИмяФайла - Тип: Строка. Имя файла для добавления`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBinaryData } = require('./binaryData');

		let data = new BSLBinaryData(context, filename);
		this.Добавить(context, data);
	}

	ХешФункция(context){
		if(context.$BSLRunner.$help){
			console.log(`Получить используемую хеш-функцию
			|
			|	Результат:
			|	ХешФункция - Тип: ХешФункция. Выбранная хеш-функция`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$hashFunc;
	}

	ХешСумма(context){
		if(context.$BSLRunner.$help){
			console.log(`Генерирует итоговую хеш-сумму 
			|
			|	Результат:
			|	ХешСумма - Тип: ДвоичныеДанные, Число. Для CRC32 результатом будет число, для остального - ДвоичныеДанные`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const { BSLBinaryData } = require('./binaryData'),
			{BSLNumber} = require("./number");

		let result = this.$hashObj.digest();
		if(this.$hashFunc.name == "CRC32"){
			return new BSLNumber(result);
		}else{
			return new BSLBinaryData(context, Buffer.from(result));
		}
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

var BSLCRC32 = class{
	data;

	update(data){
		if(this.data instanceof Buffer){
			if(!(data instanceof Buffer)){
				data = Buffer.from(data);
			}

			this.data = Buffer.concat([this.data, data]);
		}else
		if(this.data == undefined){
			this.data = data;
		}else{
			this.data += data.toString();
		}
	}

	digest(){
		return crc32(this.data);
	}
}

function crc32(r){
	for(var a,o=[],c=0;c<256;c++){
		a=c;
		for(var f=0;f<8;f++) a=1&a?3988292384^a>>>1:a>>>1;
		o[c]=a
	}
	for(var n=-1,t=0;t<r.length;t++) n=n>>>8^o[255&(n^r[t])];
	return(-1^n)>>>0;
};