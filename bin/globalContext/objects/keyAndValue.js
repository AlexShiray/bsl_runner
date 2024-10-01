const { setWriteOnly } = require("./__objectHelper");

exports.BSLKeyAndValue = class BSLKeyAndValue{
	Значение;
	Ключ;
	$type;	
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект, содержащий ключ и значение коллекций, которые это возвращают`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Ключ - Тип: Произвольный. Только чтение. Ключ элемента
		|	Значение - Тип: Произвольный. Только чтение. Значение элемента`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(key, value){
		this.Ключ = key;
		this.Значение = value;
		this.$type = require("./type").BSLAvailableTypes.КлючИЗначение;

		setWriteOnly(this, "Ключ");
		setWriteOnly(this, "Значение");
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}