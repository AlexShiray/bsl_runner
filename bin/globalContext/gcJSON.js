
exports.BSLGCJSON = {
	ЗначениеВJSONСтроку: function(context, value, spaces = 0){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует значение в JSON объект
			|	Параметры:
			|	Значение - Тип: Произвольный. Значение, которое требуется преобразовать.
			|	РазмерОтступа - Тип: Число. Размер отступа.
			|		
			|	Результат:
			|	JSON - Тип: Строка.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {parseToJsObject} = require("./objects/__objectHelper");

		return JSON.stringify(parseToJsObject(value, true), null, spaces.valueOf());
	},
	ЗначениеИзJSONСтроки: function(context, string){
		if(context.$BSLRunner.$help){
			console.log(`Преобразует JSON объект в объект BSL
			|		Параметры:
			|		JSON - Тип: Строка. Строка, из которой требуется получить объект.
			|		
			|		Результат:
			|		Значение - Тип: Произвольный. Преобразованный объект`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {parseFromJsObject} = require("./objects/__objectHelper");

		return parseFromJsObject(JSON.parse(string), true);
	},
}