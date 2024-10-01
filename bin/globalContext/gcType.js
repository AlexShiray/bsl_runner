
exports.BSLGCType = {
	Тип: function(context, name){
		if(context.$BSLRunner.$help){
			console.log(`Получить тип объекта по имени типа
			|   Параметры:
			|   ИмяТипа: Тип: Строка.
			|
			|   Результат:
			|   Тип - Тип: Тип. Найденный тип объекта`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let { BSLAvailableTypes } = require("./objects/type");
		let findName = Object.keys(BSLAvailableTypes).find(elem => elem.toLowerCase() == name.toLowerCase());
		if(findName !== undefined){
			return BSLAvailableTypes[findName];
		}else
			context.$BSLRunner.$throwError(context.$node, `Неизвестный тип: ${name}`);
	},

	ТипЗнч: function(context, value){
		if(context.$BSLRunner.$help){
			console.log(`Получить тип объекта из объекта
			|   Параметры:
			|   Объект: Тип: Произвольный.
			|
			|   Результат:
			|   Тип - Тип: Тип. Тип объекта`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(value.typeOf === undefined){
			return require("./objects/type").BSLAvailableTypes.ВнутреннийОбъект;
		}

		return value.typeOf(context);
	}
}