const {BSLKeyAndValue} = require("./keyAndValue");
const { BSLString } = require("./string");

exports.BSLStruct = class BSLStruct{
    $type;
    $object;
    $help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с именованными списками, ключами которых могут быть только типизированные строки, начинающиеся с буквы и содержащие только символы букв, цифр и подчеркивания. 
		| возможен перебор элементов Циклом и получение значения элемента через []. При переборе коллекци возвращает КлючИЗначение.
		|	Конструктор:
		|	По умолчанию: Новый Структура();
        |	По ключам и значениям: Новый Структура(Ключи, Значение1, Значение2, ...ЗначениеN);
        |       Параметры:
        |       Ключи - Тип: Строка, Ключи, разделенные запятыми ","
        |       Значение1, Значение2, ...ЗначениеN - значения ключей через запятую в порядке, как указаны в параметре Ключи
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

    constructor(context, keys = "", ...values){
        this.$type = require("./type").BSLAvailableTypes.Структура;
        this.$object = new Map;

        if(String(keys) !== ""){
            let keysArr = String(keys).split(",");

            for(let i = 0; i < keysArr.length; i++){
                let key = keysArr[i].trim();

                if(key.search(/^[a-zA-Z_а-яА-Я][0-9a-zA-Z_а-яА-Я]*$/ui) == -1){
                    context.$BSLRunner.$throwError(context.$node, `Неверное имя структуры: ${key}`);
                }

                this.$object.set(key, values[i]);
            }
        }
	}

    toString(){
		return this.$type.toString();
	}

    valueOf(){
        return this.$object;
    }

    typeOf(){
        return this.$type;
    }

    $getIndex(index){
		return this.$object.get(index.valueOf());
	}

    Очистить(context){
        if(context.$BSLRunner.$help){
			console.log(`Очищает коллекцию полностью`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.clear();
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

    Вставить(context, index, value){
        if(context.$BSLRunner.$help){
			console.log(`Вставляет в коллекцию новый элемент с заданным ключем и значением
			|		Параметры:
			|		Ключ - Тип: Строка. Ключ элемента, начинающийся с буквы и содержащий только символы букв, цифр и подчеркивания
			|		Значение - Тип: Произвольный. Значение элемента`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

        if(index.search(/^[a-zA-Z_а-яА-Я][0-9a-zA-Z_а-яА-Я]*$/ui) == -1){
            context.$BSLRunner.$throwError(context.$node, `Неверное имя структуры: ${index}`);
        }
        
		this.$object.set(index.valueOf(), value);
	}

    Свойство(context, index, value){
        if(context.$BSLRunner.$help){
			console.log(`Проверяет наличие свойства у коллекции
			|		Параметры:
			|		Ключ - Тип: Строка. Ключ элемента
            |       Значение - Тип: Произвольный. Переменная в которую будет записано полученное значение
			|		
			|		Результат:
			|		Значение - Тип: Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		value = this.$object.get(index.valueOf());

        return value != undefined;
	}

    Удалить(context, index){
        if(context.$BSLRunner.$help){
			console.log(`Удаляет элемент по ключу
			|		Параметры:
			|		Ключ - Тип: Строка. Ключ элемента`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

        this.$object.delete(index);
	}

    *[Symbol.iterator]() {
        for(let keyVal of this.$object){
            yield new BSLKeyAndValue(new BSLString(keyVal[0]), keyVal[1]);
        }
    }
}

exports.BSLFixedStruct = class BSLFixedStruct{
    $type;
    $object;
    $help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с фиксированными именованными списками, ключами которых могут быть только типизированные строки, начинающиеся с буквы и содержащие только символы букв, цифр и подчеркивания. 
		| возможен перебор элементов Циклом и получение значения элемента через []. При переборе коллекци возвращает КлючИЗначение.
		|	Конструктор:
		|	На основании структуры: Новый ФиксированнаяСтруктура(Структура);
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

    constructor(context, struct){
        this.$type = require("./type").BSLAvailableTypes.ФиксированнаяСтруктура;
        this.$object = new Map(struct.$object.entries());
	}

    toString(){
		return this.$type.toString();
	}

    typeOf(){
        return this.$type;
    }

    $getIndex(index){
		return result = this.$object.get(index.valueOf());
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

    Свойство(context, index, value){
        if(context.$BSLRunner.$help){
			console.log(`Проверяет наличие свойства у коллекции
			|		Параметры:
			|		Ключ - Тип: Строка. Ключ элемента
            |       Значение - Тип: Произвольный. Переменная в которую будет записано полученное значение
			|		
			|		Результат:
			|		Значение - Тип: Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}
        
		value = this.$object.get(index.valueOf());

        return value != undefined;
	}

    *[Symbol.iterator]() {
        for(let keyVal of this.$object){
            yield new BSLKeyAndValue(new BSLString(keyVal[0]), keyVal[1]);
        }
    }
}