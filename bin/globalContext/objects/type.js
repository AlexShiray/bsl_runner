exports.BSLType = class BSLType{
	$name;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Описывает тип объекта`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(name){
		this.$name = name;
	}

	valueOf(){
		return this.$name;
	}

	toString(){
		return this.$name; 
	}

	typeOf(){
		return exports.BSLAvailableTypes.Тип;
	}
}

exports.BSLAvailableTypes = {
	// Системные типы
	"ВнутреннийОбъект": new exports.BSLType("ВнутреннийОбъект"),
	"ИнформацияОбОшибке": new exports.BSLType("ИнформацияОбОшибке"),
	"ОписаниеОповещения": new exports.BSLType("ОписаниеОповещения"),
	"МодульВстроенногоЯзыка": new exports.BSLType("МодульВстроенногоЯзыка"),

	// Базовые типы
	"Тип": new exports.BSLType("Тип"),
	"Строка": new exports.BSLType("Строка"),
	"Булево": new exports.BSLType("Булево"),
	"Число": new exports.BSLType("Число"),
	"Дата": new exports.BSLType("Дата"),
	"Неопределено": new exports.BSLType("Неопределено"),
	"NULL": new exports.BSLType("NULL", "Null"),

	// Типы Соответствия и Структуры
	"Структура": new exports.BSLType("Структура"),
	"Соответствие": new exports.BSLType("Соответствие"),
	"Массив": new exports.BSLType("Массив"),
	"ФиксированнаяСтруктура": new exports.BSLType("ФиксированнаяСтруктура"),
	"ФиксированноеСоответствие": new exports.BSLType("ФиксированноеСоответствие"),
	"ФиксированныйМассив": new exports.BSLType("ФиксированныйМассив"),
	"КлючИЗначение": new exports.BSLType("КлючИЗначение"),

	// Типы Хеширования данных
	"ХешированиеДанных": new exports.BSLType("ХешированиеДанных"),
	"ХешФункция": new exports.BSLType("ХешФункция"),

	// Типы работы с файлами
	"ДвоичныеДанные": new exports.BSLType("ДвоичныеДанные"),
	"Файл": new exports.BSLType("Файл"),

	// Типы работы с регулярками
	"РегулярноеВыражение": new exports.BSLType("РегулярноеВыражение"),
	"РезультатПоискаПоРегулярномуВыражению": new exports.BSLType("РезультатПоискаПоРегулярномуВыражению"),
	"ГруппаРезультатаПоискаПоРегулярномуВыражению": new exports.BSLType("ГруппаРезультатаПоискаПоРегулярномуВыражению"),

	// Типы списка значения
	"СписокЗначений": new exports.BSLType("СписокЗначений"),
	"ЭлементСпискаЗначений": new exports.BSLType("ЭлементСпискаЗначений"),

	// Типы таблицы значений
	"ТаблицаЗначений": new exports.BSLType("ТаблицаЗначений"),
	"СтрокаТаблицыЗначений": new exports.BSLType("СтрокаТаблицыЗначений"),
	"КоллекцияКолонокТаблицыЗначений": new exports.BSLType("КоллекцияКолонокТаблицыЗначений"),
	"КолонкаТаблицыЗначений": new exports.BSLType("КолонкаТаблицыЗначений"),
	"ИндексыКоллекции": new exports.BSLType("ИндексыКоллекции"),
	"ИндексКоллекции": new exports.BSLType("ИндексКоллекции"),

	// Типы HTTP соединения
	"HTTPСоединение": new exports.BSLType("HTTPСоединение"),
	"HTTPЗапрос": new exports.BSLType("HTTPЗапрос"),
	"HTTPОтвет": new exports.BSLType("HTTPОтвет"),

	// Типы HTTP сервиса
	"HTTPСервис": new exports.BSLType("HTTPСервис"),
	"HTTPСервисЗапрос": new exports.BSLType("HTTPСервисЗапрос"),
	"HTTPСервисОтвет": new exports.BSLType("HTTPСервисОтвет"),

	// Типы для работы с БД
	"БазаДанных": new exports.BSLType("БазаДанных"),
	"ТипБазыДанных": new exports.BSLType("ТипБазыДанных"),
	"Запрос": new exports.BSLType("Запрос"),
	"РезультатЗапроса": new exports.BSLType("РезультатЗапроса"),

	// Типы Телеграм бота
	"TelegramБот": new exports.BSLType("TelegramБот"),
	"TelegramТипКоманды": new exports.BSLType("TelegramТипКоманды"),
	"БотЗапрос": new exports.BSLType("БотЗапрос"),
	"БотОтвет": new exports.BSLType("БотОтвет"),

	// Типы для ZIP архива
	"ЗаписьZipАрхива": new exports.BSLType("ЗаписьZipАрхива"),
	"ЧтениеZipАрхива": new exports.BSLType("ЧтениеZipАрхива"),
	"ЭлементыZipАрхива": new exports.BSLType("ЭлементыZipАрхива"),
	"ЭлементZipАрхива": new exports.BSLType("ЭлементZipАрхива"),

}
