exports.BSLCallbackDescription = class BSLCallbackDescription{
	$type;
	ДополнительныеПараметры;
	ИмяПроцедуры;
	ИмяПроцедурыОбработкиОшибки;
	Модуль;
	МодульОбработкиОшибки;
	$operands = [];

	constructor(context, funcName, module = undefined, additionalParameters = undefined, errFuncName = undefined, errModule = undefined){
		const { BSLUndefined } = require("./undefinedNull");
		this.$type = require("./type").BSLAvailableTypes.ОписаниеОповещения;

		this.ДополнительныеПараметры = additionalParameters;
		this.ИмяПроцедуры = funcName;
		this.ИмяПроцедурыОбработкиОшибки = errFuncName;
		this.Модуль = module;
		this.МодульОбработкиОшибки = errModule;

		if(this.ДополнительныеПараметры === undefined) this.ДополнительныеПараметры = BSLUndefined;
		if(this.Модуль === undefined) this.Модуль = context.$BSLRunner;
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}