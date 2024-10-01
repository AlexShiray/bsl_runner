const { BSLString } = require("./string");

exports.BSLJSCode = class BSLJSCode{
	$type;
	Текст;
	$parameters = {};

	constructor(context, jsCode = undefined){
		this.$type = require("./type").BSLAvailableTypes.ВнутреннийОбъект;
		if(jsCode){
			this.Текст = jsCode;
		}
	}

	УстановитьПараметр(context, name, value){
		this.$parameters[name] = value;
	}

	Выполнить(context){
		let paramsCode = "";

		for(let itemName in this.$parameters){
			if(this.$parameters[itemName] instanceof BSLString){
				paramsCode += `var ${itemName} = \`${this.$parameters[itemName].valueOf()}\`;\n`;
			}else
				paramsCode += `var ${itemName} = ${this.$parameters[itemName].valueOf()};\n`;
		}

		return new exports.BSLJSCodeResult(eval(paramsCode + this.Текст));
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLJSCodeResult = class BSLJSCodeResult{
	result;
	$type

	constructor(result){
		this.$type = require("./type").BSLAvailableTypes.ВнутреннийОбъект;
		this.result = result;
	}

	toString(){
		return this.result;
	}
	
	valueOf(){
		return this.result;
	}

	typeOf(){
		return this.$type;
	}
}