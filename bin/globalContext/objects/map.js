const {BSLKeyAndValue} = require("./keyAndValue");

exports.BSLMap = class BSLMap{
	$type;
	$object;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с именованными списками, ключами которых могут быть нетипизированные строки или другие объекты. 
		| возможен перебор элементов Циклом и получение значения элемента через []. При переборе коллекци возвращает КлючИЗначение.
		|	Конструктор:
		|	По умолчанию: Новый Соответствие();
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(context){
		this.$type = require("./type").BSLAvailableTypes.Соответствие;
		this.$object = new Map;
	}

	*[Symbol.iterator]() {
		for(let keyval of this.$object){
			yield new BSLKeyAndValue(keyval[0], keyval[1]);
		}
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}

	$getIndex(index){
		let key = [...this.$object.keys()].find(key => key == index || key.valueOf() == index.valueOf());

		if(!key) return undefined;

		let result = this.$object.get(key);

		return result;
	}

	Очистить(){
		if(context.$BSLRunner.$help){
			console.log(`Очищает коллекцию полностью`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		for (let item in this) 
			this.$object.delete(item);
	}

	Количество(){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает количество элементов в коллекции
			|		Результат:
			|		Число`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require("./number");

		return new BSLNumber([...this.$object.keys()].length);
	}

	Вставить(context, index, value){
		if(context.$BSLRunner.$help){
			console.log(`Вставляет в коллекцию новый элемент с заданным ключем и значением
			|		Параметры:
			|		Ключ - Тип: Произвольный. Ключ элемента
			|		Значение - Тип: Произвольный. Значение элемента`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.set(index, value);
	}

	Получить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Получает значение по ключу. Работает аналогично []
			|		Параметры:
			|		Ключ - Тип: Произвольный. Ключ элемента
			|		
			|		Результат:
			|		Значение - Тип: Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$getIndex(index);
	}

	Удалить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет элемент по ключу
			|		Параметры:
			|		Ключ - Тип: Произвольный. Ключ элемента`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.delete(index);
	}
}

exports.BSLFixedMap = class BSLFixedMap{
	$type;
	$object;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с фиксированными именованными списками, ключами которых могут быть нетипизированные строки или другие объекты. 
		| возможен перебор элементов Циклом и получение значения элемента через []. При переборе коллекци возвращает КлючИЗначение.
		|	Конструктор:
		|	По соответствию: Новый ФиксированноеСоответствие(Соответствие);
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(context, map){
		this.$type = require("./type").BSLAvailableTypes.ФиксированноеСоответствие;
		this.$object = new Map(map.$object.entries());
	}

	*[Symbol.iterator]() {
		for(let keyval of this.$object){
			yield new BSLKeyAndValue(keyval[0], keyval[1]);
		}
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
	
	$getIndex(index){
		let key = [...this.$object.keys()].find(key => key == index || key.valueOf() == index.valueOf());

		if(key === undefined) return undefined;

		let result = this.$object.get(key);

		return result;
	}
	
	Количество(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает количество элементов в коллекции
			|		Результат:
			|		Число`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require("./number");

		return new BSLNumber([...this.$object.keys()].length);
	}

	Получить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Получает значение по ключу. Работает аналогично []
			|		Параметры:
			|		Ключ - Тип: Произвольный. Ключ элемента
			|		
			|		Результат:
			|		Значение - Тип: Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}
		
		return this.$getIndex(index);
	}
}
