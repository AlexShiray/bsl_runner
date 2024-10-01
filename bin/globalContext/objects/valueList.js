
exports.BSLValueList = class BSLValueList{
	$type;
	$object;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы со списком значений. Элементы коллекции можно обойти через Цикл, или получить конкретный элемент через [] в качестве значения передается его индекс.
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(context, valueList = []){
		this.$type = require("./type").BSLAvailableTypes.СписокЗначений;
		this.$object = new Array(...valueList);
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}

	$getIndex(index){
		return this.$object[index];
	}

	Вставить(context, index, value, presentation = "", check = false){
		if(context.$BSLRunner.$help){
			console.log(`Вставляет новый элемент по индексу
			|	Параметры:
			|	Индекс - Тип: Число. Индекс куда вставлять новый элемент.
			|	Значение - Тип: Произвольный. Значение для нового элемента.
			|	Представление (не обязательный) - Тип: Строка. По умолчанию: "". Представление элемента.
			|	Пометка (не обязательный) - Тип: Булево. По умолчанию: Ложь. Пометка элемента`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLBool } = require("./bool");
		this.$object.splice(index, 0, new BSLValueListElem(value, presentation, new BSLBool(check), this.$object.length));
	}

	Добавить(context, value, presentation = "", check = false){
		if(context.$BSLRunner.$help){
			console.log(`Добавляет новый элемент в список значений
			|	Параметры:
			|	Значение - Тип: Произвольный. Значение для нового элемента.
			|	Представление (не обязательный) - Тип: Строка. По умолчанию: "". Представление элемента.
			|	Пометка (не обязательный) - Тип: Булево. По умолчанию: Ложь. Пометка элемента`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLBool } = require("./bool");
		return this.$object.push(new BSLValueListElem(value, presentation, new BSLBool(check), this.$object.length));
	}

	Индекс(context, elem){
		if(context.$BSLRunner.$help){
			console.log(`Вставляет новый элемент по индексу. Если не найдено возвращается -1.
			|	Параметры:
			|	Элемент - Тип: ЭлементСпискаЗначений. Элемент, индекс которого необходимо получить.
			|	
			|	Результат:
			|	Индекс - Тип: Число.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require("./number");

		return new BSLNumber(this.indexOf(elem));
	}

	Количество(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает количество элементов в коллекции.
			|	Результат:
			|	Количество - Тип: Число.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLNumber} = require("./number");

		return new BSLNumber(this.$object.length);
	}

	НайтиПоЗначению(context, findValue){
		if(context.$BSLRunner.$help){
			console.log(`Ищет элемент в коллекции по значению.
			|	Параметры:
			|	Значение - Тип: Произвольный. Значение по которому требуется найти элемент.
			|	
			|	Результат:
			|	Элемент - Тип: ЭлементСпискаЗначений, Неопределено. Найденный элемент коллекции, если не найдено, возвращается Неопределено`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLUndefined } = require("./undefinedNull");
		let foundElem = this.$object.find(elem => elem.Значение === findValue);
		return (foundElem !== undefined ? foundElem : BSLUndefined);
	}

	НайтиПоИдентификатору(context, findId){
		if(context.$BSLRunner.$help){
			console.log(`Ищет элемент в коллекции по идентификатору.
			|	Параметры:
			|	Идентификатор - Тип: Число. Идентификатор по которому требуется найти элемент.
			|	
			|	Результат:
			|	Элемент - Тип: ЭлементСпискаЗначений, Неопределено. Найденный элемент коллекции, если не найдено, возвращается Неопределено`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLUndefined } = require("./undefinedNull");
		let foundElem = this.$object.find(elem => elem.ПолучитьИдентификатор() === findId);
		return (foundElem !== undefined ? foundElem : BSLUndefined);
	}

	Очистить(context){
		if(context.$BSLRunner.$help){
			console.log(`Очищает всю коллекцию.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.length = 0;
	}

	Получить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает элемент по индексу. Работает аналогично оператору []
			|	Параметры:
			|	Значение - Тип: Произвольный. Значение по которому требуется найти элемент.
			|	
			|	Результат:
			|	Элемент - Тип: ЭлементСпискаЗначений, Неопределено. Найденный элемент коллекции, если не найдено, возвращается Неопределено`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$getIndex(index);
	}

	Сдвинуть(context, elem, shift){
		if(context.$BSLRunner.$help){
			console.log(`Сдвигает элемент в коллекции.
			|	Параметры:
			|	Элемент - Тип: ЭлементСпискаЗначений, Число. Элемент или его индекс, который необходимо сдвинуть.
			|	Сдвиг - Тип: Число. Количество элементов на которое нужно сдвинуть элемент.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLNumber } = require("./number");
		let index;
		if(elem instanceof BSLNumber){
			index = elem.valueOf();
		}else
		if(elem instanceof BSLValueListElem){
			index = this.$object.indexOf(elem);
		}

		let deletedElem = this.$object.splice(index, 1);
		this.$object.splice(index + shift, 0, deletedElem[0]);
	}

	Скопировать(context){
		if(context.$BSLRunner.$help){
			console.log(`Копирует текущий список значений в новый.
			|	Результат:
			|	СписокЗначений - Тип: СписокЗначений.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLValueList(this.$object);
	}

	СортироватьПоЗначению(context, sortDirection = 1){
		if(context.$BSLRunner.$help){
			console.log(`Сортирует список значений по значениям элементов
			|	Параметры:
			|	НаправлениеСортировки (не обязательно) - Тип: НаправлениеСортировки. По умолчанию: Возр. Указывает как сортировать список.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.sort((a, b) => {
			if(a.Значение > b.Значение){
				return (sortDirection > 0 ? 1 : -1);
			}else
			if(a.Значение < b.Значение){
				return (sortDirection > 0 ? -1 : 1);
			}

			return 0;
		});
	}

	СортироватьПоПредставлению(context, sortDirection = 1){
		if(context.$BSLRunner.$help){
			console.log(`Сортирует список значений по представлениям элементов
			|	Параметры:
			|	НаправлениеСортировки (не обязательно) - Тип: НаправлениеСортировки. По умолчанию: Возр. Указывает как сортировать список.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.sort((a, b) => {
			if(a.Представление > b.Представление){
				return (sortDirection > 0 ? 1 : -1);
			}else
			if(a.Представление < b.Представление){
				return (sortDirection > 0 ? -1 : 1);
			}

			return 0;
		});
	}

	Удалить(context, elem){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет элемент из коллекции.
			|	Параметры:
			|	Элемент - Тип: ЭлементСпискаЗначений, Число. Элемент или Индекс.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLNumber } = require("./number");
		let index;
		if(elem instanceof BSLNumber){
			index = elem.valueOf();
		}else
		if(elem instanceof BSLValueListElem){
			index = this.$object.indexOf(elem);
		}

		this.$object.splice(index, 1);
	}

	ЗаполнитьПометки(context, value){
		if(context.$BSLRunner.$help){
			console.log(`Заполняет пометки в элементах коллекции.
			|	Параметры:
			|	Пометка - Тип: Булево. Заполняемая пометка.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLBool } = require("./bool");
		for(let elem of this.$object){
			elem.Пометка = new BSLBool(value);
		}
	}

	ЗагрузитьЗначения(context, arr){
		if(context.$BSLRunner.$help){
			console.log(`Загружает значения из массива в список значений.
			|	Параметры:
			|	Массив - Тип: Массив. Массив заполненный значениями.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		for(let elem of arr){
			this.Добавить(context, elem);
		}
	}

	ВыгрузитьЗначения(context){
		if(context.$BSLRunner.$help){
			console.log(`Выгружает значения из списка значений в Массив.
			|	Результат:
			|	Массив - Тип: Массив. Массив, заполненный значениями элементов списка значений.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLArray } = require("./array");
		let arr = new BSLArray(context);

		for(let elem of this.$object){
			arr.push(elem.Значение);
		}

		return arr;
	}

	*[Symbol.iterator]() {
		for(let elem of this.$object){
			yield elem;
		}
	}
}

exports.BSLValueListElem = class BSLValueListElem{
	$type;
	Значение;
	Пометка;
	Представление;
	$id;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект описывающий элемент списка значений.
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Значение - Тип: Произвольный. Значение элемента.
		|	Пометка - Тип: Булево. 
		|	Представление - Тип: Строка. Представление значения элемента.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(value, presentation, check, id){
		this.$type = require("./type").BSLAvailableTypes.ЭлементСпискаЗначений;

		this.Значение = value;
		this.Пометка = check;
		this.Представление = presentation;
		this.$id = id;
	}

	ПолучитьИдентификатор(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает идентификатор строки
			|		
			|		Результат:
			|		Идентификатор - Тип: Число.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLNumber } = require("./number");

		return new BSLNumber(this.$id);
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}
