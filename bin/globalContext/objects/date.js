
exports.BSLDate = class BSLDate extends Date{
	$type;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с датой и временем. К Дате можно прибавить или отнять число которое является количеством секунд.
		|	Конструктор:
		|   Создание даты с текущей датой: Новый Дата();
		|	По текстовому представлению
		|		Параметры:
		|		Строка - Тип: Строка. Текстовое представление даты в формате "YYYY-MM-DD HH:mm:ss" или "YYYY-MM-DDTHH:mm:ss"
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(context, date = undefined){
		if(date == undefined){
			super();
		}else{
			super(date);
		}

		this.$type = require("./type").BSLAvailableTypes.Дата;

		if(this.toLocaleString() === "Invalid Date"){
			context.$BSLRunner.$throwError(context.$node, `Преобразование значения к типу Дата не может быть выполнено`);
		}
	}

	toString(){
		return this.toLocaleString().replace(",", "");
	}

	typeOf(){
		return this.$type;
	}

	__add__(context, value){
		return new exports.BSLDate(context, this.getTime() + value * 1000);
	}

	__sub__(context, value){
		return new exports.BSLDate(context, this.getTime() - value * 1000);
	}
}