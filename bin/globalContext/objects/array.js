const { BSLNumber } = require("./number");

exports.BSLArray = class BSLArray{
	$type;
	$object;

	constructor(context, ...items){
		this.$type = require("./type").BSLAvailableTypes.Массив;

		this.$object = [];

		if(items[0] instanceof Array){
			this.$object.splice(0, 0, ...items[0]);

			return;
		}

		// let newCountsDim = [];

		// for(let i = 0; i < items[0]; i++){
		// 	if(items.length > 1){
		// 		newCountsDim = items.slice(1);
		// 	}
		// 	this.$object.push(new exports.BSLArray(context, ...newCountsDim));
		// }

		this.$object.push(...items);
	}

	$getIndex(index){
		return this.$object[index.valueOf()];
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

	Добавить(context, elem = null){
		this.$object.push(elem);
	}

	ВГраница(context){
		return new BSLNumber(this.$object.length - 1);
	}

	Количество(context){
		return new BSLNumber(this.$object.length);
	}

	Очистить(context){
		this.$object.length = 0;
	}

	Получить(context, index){
		return new BSLNumber(this.$getIndex(index));
	}

	Удалить(context, index){
		this.$object.splice(index.valueOf(), 1);
	}

	Установить(context, index, value){
		this.$object[index.valueOf()] = value;
	}

	Найти(context, value){
		return new BSLNumber(this.indexOf(value));
	}

	Вставить(context, index, value){
		this.$object.splice(index.valueOf(), 0, value);
	}

	*[Symbol.iterator]() {
        for(let elem of this.$object){
            yield elem;
        }
    }
}

exports.BSLFixedArray = class BSLFixedArray{
	$type;
	$object;

	constructor(context, array){
		this.$type = require("./type").BSLAvailableTypes.ФиксированныйМассив;

		this.$object = Array.from(array);
	}

	$getIndex(index){
		return this.$object[index.valueOf()];
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

	ВГраница(context){
		return new BSLNumber(this.$object.length - 1);
	}

	Количество(context){
		return new BSLNumber(this.$object.length);
	}

	Получить(context, index){
		return new BSLNumber(this.$getIndex(index));
	}

	Найти(context, value){
		return new BSLNumber(this.indexOf(value));
	}

	*[Symbol.iterator]() {
        for(let elem of this.$object){
            yield elem;
        }
    }
}
