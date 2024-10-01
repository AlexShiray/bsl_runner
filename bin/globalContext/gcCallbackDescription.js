const { BSLUndefined } = require("./objects/undefinedNull");

exports.BSLGCCallbackDescription = {
	ОписаниеОповещения: function(context, funcName, module = undefined, additionalParameters = undefined, errFuncName = undefined, errModule = undefined){
		return new BSLCallbackDescription(context, funcName, module, additionalParameters, errFuncName, errModule);
	},
	
	ВыполнитьОбработкуОповещения: async function(context, callbackDescription, result = undefined){
		if(result === undefined) result = BSLUndefined;

		callbackDescription.$operands.push(result);
		await context.$BSLRunner.run(callbackDescription);
	},
}
