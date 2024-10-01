const { BSLNumber } = require("./number");
const { BSLString } = require("./string");
const { BSLUndefined } = require("./undefinedNull");

exports.BSLValueTable = class BSLValueTable{
	$type;
	$object;
	$indexesData = new Map;
	Колонки;
	Индексы;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с коллекцией значений. Строки таблицы можно обойти через Цикл или получить конкретную строку через [] в качестве значения передается индекс строки.
		|	Конструктор:
		|	По умолчанию: Новый ТаблицаЗначений()
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		console.log(`Свойства:
		|	Колонки - Тип: КолонкиТаблицыЗначений. Только чтение. Коллекция колонок таблицы значений
		|	ИгнорироватьРегистр - Тип: Булево. Только чтение.
		|	МногострочныйПоиск - Тип: Булево. Только чтение.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(){
		this.$type = require("./type").BSLAvailableTypes.ТаблицаЗначений;
		this.$object = [];
		this.Колонки = new exports.BSLValueTableColumnCollection();
		this.Индексы = new exports.BSLCollectionIndexes(this);
	}

	$getIndex(index){
		return this.$object[index.valueOf()];
	}

	Добавить(context){
		if(context.$BSLRunner.$help){
			console.log(`Добавляет новую строку в таблицу значений
			|		
			|		Результат:
			|		СтрокаТаблицыЗначений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let inserted = new exports.BSLValueTableRow(this);
		this.$object.push(inserted);
		return inserted;
	}

	Вставить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Вставляет строку в таблицу значений по индексу
			|		Параметры:
			|		Индекс - Тип: Число. Индекс, куда вставляется новая строка
			|		
			|		Результат:
			|		СтрокаТаблицыЗначений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let inserted = new exports.BSLValueTableRow(this);
		this.$object.splice(index.valueOf(), 0, inserted);

		return inserted;
	}

	async ВыгрузитьКолонку(context, column){
		if(context.$BSLRunner.$help){
			console.log(`Выгружает значения колонки в массив
			|		Параметры:
			|		Колонка - Тип: Число, Строка, КолонкаТаблицыЗначений. Индекс колонки, ее имя или сама колонка таблицы значений.
			|		
			|		Результат:
			|		Массив`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(column instanceof BSLString)
			column = this.Колонки.Найти(context, column);

		if(column instanceof BSLValueTableColumn)
			column = this.Колонки.Индекс(context, column).valueOf();

		let result = new (require("./array").BSLArray)(context);
		for(let row of this.$object){
			await result.Добавить(context, row.$getIndex(column));
		}

		return result;
	}

	async ЗагрузитьКолонку(context, arr, column){
		if(context.$BSLRunner.$help){
			console.log(`Загружает значения из Массива в колонку таблицы значений по индексам.
			|		Параметры:
			|		Массив - Тип: Массив. Загружаемый массив с данными.
			|		Колонка - Тип: Число, Строка, КолонкаТаблицыЗначений. Индекс колонки, ее имя или сама колонка таблицы значений.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(column instanceof BSLString)
			column = this.Колонки.Найти(context, column);

		if(column instanceof BSLValueTableColumn)
			column = this.Колонки.Индекс(context, column).valueOf();

		let maxIdx = arr.ВГраница().valueOf();
		for(let i in this.$object){
			if(i > maxIdx) break;

			await this.$object[i].Установить(context, column, arr.$getIndex(i));
		}
	}

	async ЗаполнитьЗначения(context, value, columns = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Заполняет значением колонки таблицы значений
			|		Параметры:
			|		Значение - Тип: Произвольный. Заполняемое значение.
			|		Колонки - Тип: Строка. Имена колонок через запятую`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let columnsIdx = [];
		if(columns === undefined){
			columnsIdx = this.Колонки.$object.keys();
		}else{
			columns = columns.valueOf().split(/, ?/);
			for(let i in [...this.Колонки]){
				let column = this.Колонки.$getIndex(i);
				if(columns.indexOf(column.Имя.valueOf()) != -1) 
					columnsIdx.push(i);
			}
		}

		for(let row of this.$object){
			for(let i of columnsIdx){
				await row.Установить(context, i, value);
			}
		}
	}

	Индекс(context, row){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает индекс строки таблицы значений
			|		Параметры:
			|		Строка - Тип: СтрокаТаблицыЗначений. Строка для которой надо получить ее индекс.
			|		
			|		Результат:
			|		Индекс - Тип: Число. Индекс строки таблицы значений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLNumber(this.$object.findIndex(elem => elem === row));
	}

	Количество(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает количество строк в таблице значений.
			|		
			|		Результат:
			|		Количество - Тип: Число. Количество строк в таблице значений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLNumber(this.$object.length);
	}

	Очистить(context){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет все строки в таблице значений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.length = 0;
	}

	Получить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Получение строки по ее индексу. Работает аналогично оператору []
			|		Параметры:
			|		Индекс - Тип: Число. Индекс строки таблицы значений
			|		
			|		Результат:
			|		СтрокаТаблицыЗначений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$getIndex(index);
	}

	Удалить(context, row){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет строку из таблицы значений.
			|		Параметры:
			|		Строка - Тип: Число, СтрокаТаблицыЗначений. Можно передать как индекс строки, так и саму строку таблицы значений.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(row instanceof BSLValueTableRow)
			row = this.$object.findIndex(elem => elem === row);

		this.$object.splice(row, 1);
	}

	Итог(context, columnName){ // TODO когда сделаю ОписаниеТипов
		if(context.$BSLRunner.$help){
			console.log(`Получение общего итога по колонке в таблице значений
			|		Параметры:
			|		Колонка - Тип: Число, Строка, КолонкаТаблицыЗначений. Индекс колонки, ее имя или сама колонка таблицы значений.
			|		
			|		Результат:
			|		Итог - Тип: Число. Общий итог по колонке.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

	}

	Найти(context, value, columns){
		if(context.$BSLRunner.$help){
			console.log(`Поиск строки по соответствию значения
			|		Параметры:
			|		Значение - Тип: Произвольный. Значение по которому требуется произвести поиск.
			|		Колонки - Тип: Строка. Имена колонок через запятую по которым требуется искать значение.
			|		
			|		Результат:
			|		СтрокаТаблицыЗначений, Неопределено - Если найдено вернется строка, если нет то Неопределено.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let columnsIdx = [];

		columns = columns.valueOf().split(/, ?/);
		for(let i in [...this.Колонки]){
			let column = this.Колонки.$getIndex(i);
			if(columns.indexOf(column.Имя.valueOf()) != -1) 
				columnsIdx.push(i);
		}

		for(let row of this.$object){
			for(let index of columnsIdx){
				if(row.$getIndex(index) == value.valueOf())
					return row;
			}
		}

		return new (require("./undefinedNull").BSLUndefined);
	}

	async НайтиСтроки(context, selParams){
		if(context.$BSLRunner.$help){
			console.log(`Поиск строк по определенному отбору
			|		Параметры:
			|		Отбор - Тип: Структура. Ключи структуры - Имена колонок, а значения - значения по которым отбирается
			|		
			|		Результат:
			|		Массив`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		const {BSLArray} = require("./array");

		let result = new BSLArray(context);

		if(this.$indexesData.size > 0){
			indexesFor: for(let indexData of this.$indexesData){
				let columns = indexData[0].$getColumns(),
					rawData = "";
				for(let column of columns){
					let selParValue = selParams.$object.get(column.Имя.valueOf());
					if(selParValue === undefined){
						continue indexesFor;
					}
					rawData += `$${selParValue.valueOf()}`;
				}

				let digest = Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(rawData))).toString('hex');

				if(indexData[1].has(digest)){
					let indexElem = indexData[1].get(digest);
					result.$object.push(...indexElem);
				}
			}
		}else{
			for(let row of this.$object){
				let matched = true;
				for(let selCol of selParams.$object.keys()){
					let val = row.$getProperty(selCol);
					if(val === undefined){
						matched = false;
					}

					if(val.valueOf() != selParams.$object.get(selCol)){
						matched = false;
					}
				}

				if(matched){
					result.$object.push(row);
				}
			}
		}

		return result;
	}

	Свернуть(context, colsGroup, colsSum){ // TODO когда сделаю ОписаниеТипов
		if(context.$BSLRunner.$help){
			console.log(`Группирует и суммирует строки таблицы значений
			|		Параметры:
			|		КолонкиГруппировки - Тип: Строка. Имена колонок через запятую, по которым надо группировать
			|		КолонкиСуммирования - Тип: Строка. Имена колонок через запятую, которые надо суммировать`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}
	}

	Сдвинуть(context, row, shift){
		if(context.$BSLRunner.$help){
			console.log(`Сдвигает строку таблицы значений на определенное количество
			|		Параметры:
			|		Строка - Тип: Число, СтрокаТаблицыЗначений - Индекс строки или сама строка которую надо сдвинуть
			|		Сдвиг - Тип: Число. Число, на которое надо сдвинуть строку (отрицательное число сдвигает строку назад)`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let index;
		if(row instanceof BSLValueTableRow){
			index = this.$object.indexOf(row);
		}

		let deletedElem = this.$object.splice(index, 1);
		this.$object.splice(index + shift, 0, deletedElem[0]);
	}

	async Скопировать(context, rowsOrSelParams = undefined, columns = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Копирует таблицу значений в новую 
			|	Использование:
			|		По отбору. Копируются все колонки и только те строки, которые попали в отбор.
			|			Параметры:
			|			Отбор - Тип: Структура. Отбор строк, как в методе "НайтиСтроки"
			|		
			|		Конкретные строки и колонки. Копируются только выбранные строки и колонки.
			|			Параметры:
			|			Строки - Тип: Массив. Массив строк, которые надо копировать
			|			Колонки - Тип: Строка. Имена колонок через запятую
			|       
			|		Результат:
			|		ТаблицаЗначений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let result = await this.СкопироватьКолонки(context, columns),
			rows;

		const {BSLStruct} = require("./struct"),
			{BSLArray} = require("./array");

		if(rowsOrSelParams instanceof BSLStruct){
			rows = await this.НайтиСтроки(context, rowsOrSelParams);
		}else if(rowsOrSelParams instanceof BSLArray){
			rows = rowsOrSelParams;
		}

		for(let row of this.$object){
			if(rows === undefined || rows.$object.indexOf(row) != -1){
				let newRow = result.Добавить(context);
				for(let column of result.Колонки){
					newRow.$setProperty(context, column.Имя.valueOf(), row.$getProperty(column.Имя.valueOf()));
				}
			}
		}

		return result;
	}

	async СкопироватьКолонки(context, columns = undefined){
		if(context.$BSLRunner.$help){
			console.log(`Копирует колонки таблицы значений в новую таблицу значений. При этом значения колонок не копируются.
			|		Параметры:
			|		Колонки - Тип: Строка. Имена колонок через запятую
			|		
			|		Результат:
			|		ТаблицаЗначений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let columnsIdx = [];
		
		if(columns !== undefined) 
			columns = columns.valueOf().split(/, ?/);

		for(let i in [...this.Колонки]){
			let column = this.Колонки.$getIndex(i);
			if(columns === undefined || columns.indexOf(column.Имя.valueOf()) != -1) 
				columnsIdx.push(column);
		}

		let result = new exports.BSLValueTable;
		for(let column of columnsIdx){
			await result.Колонки.Добавить(context, column.Имя, column.ТипЗначения, column.Заголовок);
		}

		return result;
	}

	Сортировать(context, columns){
		if(context.$BSLRunner.$help){
			console.log(`Сортирует строки по заданным значениям колонок
			|		Параметры:
			|		Колонки - Тип: Строка. Имена колонок через запятую. Для определения направления сортировки можно использовать ключевые слова ВОЗР и УБЫВ.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let columnsSortData = [];
		
		columns = columns.valueOf().split(/, ?/);
		for(let column of columns){
			let [columnName, columnDirection] = column.split(" ");

			if(columnDirection === undefined) columnDirection = "";
			columnDirection = ((columnDirection.toLowerCase() == "убыв" || columnDirection.toLowerCase() == "desc") ? -1 : 1);

			columnsSortData.push({
				index: this.Колонки.Индекс(context, columnName),
				direction: columnDirection
			});
		}

		this.$object.sort((row1, row2) => {
			let result = 0;
			for(let columnSort of columnsSortData){
				result = (row1.$getIndex(columnSort.index) > row2.$getIndex(columnSort.index) ? 1 : 0) * columnSort.direction;

				if(result == 0)
					result = (row1.$getIndex(columnSort.index) < row2.$getIndex(columnSort.index) ? -1 : 0) * columnSort.direction;

				if(result != 0) break;
			}

			return result;
		});
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

	*[Symbol.iterator]() {
		for(let elem of this.$object){
			yield elem;
		}
	}
}

exports.BSLValueTableRow = class BSLValueTableRow{
	$type;
	$object;
	$owner;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Строка таблицы значений. Можно перебрать значения по колонкам через Цикл или получить значение колонки через [] в качестве значения передается индекс колонки.
		| Также можно получить доступ к значениям колонок через .ИмяКолонки
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(owner){
		this.$type = require("./type").BSLAvailableTypes.СтрокаТаблицыЗначений;
		this.$owner = owner;
		this.$object = [];

		for(let column of owner.Колонки){
			this.$object.push({
				column,
				value: BSLUndefined
			});
		}
	}

	$getIndex(index){
		let result = this.$object[index.valueOf()];
		if(result === undefined) return undefined;
		return result.value;
	}

	$getProperty(propertyName){
		let find = this.$object.find(elem => elem.column.Имя.valueOf() === propertyName);

		if(find !== undefined)
			return find.value;
	}

	async $setProperty(context, propertyName, value){
		let find = this.$object.find(elem => elem.column.Имя.valueOf() === propertyName.valueOf());

		if(find !== undefined){
			find.value = value;
			await this.$updateIndexes(context);
		}
	}

	async $updateIndexes(context){
		for(let indexData of this.$owner.$indexesData){
			for(let indexElems of indexData[1].values()){
				let index = indexElems.findIndex(elem => elem === this);

				if(index >= 0){ 
					indexElems.splice(index, 1);
					break;
				}
			}

			let columns = indexData[0].$getColumns(),
				rawData = "";
			for(let column of columns){
				let columnIdx = this.$owner.Колонки.Индекс(context, column);

				rawData += `$${this.$object[columnIdx.valueOf()].value}`;
			}

			let digest = Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(rawData))).toString('hex');

			if(indexData[1].has(digest)){
				let indexElem = indexData[1].get(digest);
				indexElem.push(this);
			}else{
				indexData[1].set(digest, [this]);
			}
		}
	}

	Владелец(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает владельца строки таблицы значений
			|		
			|		Результат:
			|		ТаблицаЗначений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$owner;
	}

	Получить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Получает значение колонки по ее индексу. Работает аналогично оператору []
			|		Параметры:
			|       Индекс - Тип: Число. Индекс колонки
			|       
			|		Результат:
			|		Значение - Тип: Произвольный`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$getIndex(index);
	}

	async Установить(context, index, value){
		if(context.$BSLRunner.$help){
			console.log(`Устанавливает значение в колонку по ее индексу
			|		
			|		Параметры:
			|		Индекс - Тип: Число. Индекс колонки
			|       Значение - Тип: Произвольный. Устанавливаемое значение`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(this.$object[index.valueOf()] === undefined) 
			this.$object[index.valueOf()] = {};
		this.$object[index.valueOf()].value = value;
		await this.$updateIndexes(context);
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}

	valueOf(){
		return this.$object;
	}

	*[Symbol.iterator]() {
		for(let elem of this.$object){
			yield elem.value;
		}
	}
}

exports.BSLValueTableColumnCollection = class BSLValueTableColumnCollection{
	$type;
	$object;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект хранящий коллекцию колонок таблицы значений. Можно перебрать коллекцию через Цикл либо получить колонку через оператор [] по индексу колонки
		|  Доступ к колонке можно получить также с помощью .ИмяКолонки
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(){
		this.$type = require("./type").BSLAvailableTypes.КоллекцияКолонокТаблицыЗначений;
		this.$object = [];
	}

	$getIndex(index){
		return this.$object[index.valueOf()];
	}

	$getProperty(propertyName){
		let find = this.Найти(undefined, propertyName);

		if(find !== BSLUndefined)
			return find;
		
	}

	Вставить(context, index, name = "", type = undefined, caption = ""){
		if(context.$BSLRunner.$help){
			console.log(`Вставляет новую колонку по индексу
			|       Параметры:
			|       Индекс - Тип: Число. Индекс по которому будет вставлена колонка.
			|       ИмяКолонки - Тип: Строка. Имя новой колонки
			|       Тип - Тип: Неопределено. Пока не реализовано
			|       Заголовок - Тип: Строка. Заголовок колонки.
			|		
			|		Результат:
			|		КолонкаТаблицыЗначений - вставленная колонка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let inserted = new exports.BSLValueTableColumn(name, type, caption);
		this.$object.splice(index.valueOf(), 0, inserted);

		return inserted;
	}

	Добавить(context, name = "", type = undefined, caption = ""){
		if(context.$BSLRunner.$help){
			console.log(`Добавляет новую колонку в конец коллекции
			|       Параметры:
			|       ИмяКолонки - Тип: Строка. Имя новой колонки
			|       Тип - Тип: Неопределено. Пока не реализовано
			|       Заголовок - Тип: Строка. Заголовок колонки.
			|		
			|		Результат:
			|		КолонкаТаблицыЗначений - добавленная колонка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let inserted = new exports.BSLValueTableColumn(name, type, caption);
		this.$object.push(inserted);

		return inserted;
	}

	Индекс(context, column){
		if(context.$BSLRunner.$help){
			console.log(`Получает индекс колонки 
			|       Параметры:
			|       Колонка - Тип: Строка, КолонкаТаблицыЗначений. Имя колонки или сама колонка таблицы значений
			|		
			|		Результат:
			|		Индекс - Тип: Число. Индекс колонки`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(column instanceof exports.BSLValueTableColumn)
			return new BSLNumber(this.$object.findIndex(elem => elem === column));
		else
			return new BSLNumber(this.$object.findIndex(elem => elem.Имя.valueOf() === column));
	}

	Количество(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает количество колонок в коллекции
			|		
			|		Результат:
			|		КоличествоКолонок - Тип: Число.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLNumber(this.$object.length);
	}

	Найти(context, columnName){
		if(context.$BSLRunner.$help){
			console.log(`Ищет колонку по имени в коллекции
			|       Параметры:
			|       ИмяКолонки - Тип: Строка. Имя искомой колонки
			|		
			|		Результат:
			|		Колонка - Тип: КолонкаТаблицыЗначений, Неопределено. Если найдено, возвращается колнка, в противном случае Неопределено`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let find = this.$object.find(elem => elem.Имя.valueOf() === columnName.valueOf());

		if(find !== undefined){
			return find;
		}else
			return BSLUndefined;
	}

	Очистить(context){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет все колонки таблицы значений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.length = 0;
	}

	Получить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает колонку таблицы значений по ее индексу. Работает аналогично оператору []
			|       Параметры:
			|       Индекс - Тип: Число. Индекс искомой колонки.
			|		
			|		Результат:
			|		КолонкаТаблицыЗначений - найденная колонка`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return this.$getIndex(index);
	}

	Сдвинуть(context, column, shift){
		if(context.$BSLRunner.$help){
			console.log(`Сдвигает колонку в коллекции
			|       Параметры:
			|       Колонка - Тип: Число, КолонкаТаблицыЗначений. Индекс колонки или сама колонка таблицы значений.
			|       Сдвиг - Тип: Число. Значение на которое будет сдвинута колонка. Отрицательное значение сдвигает колонку влево`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(column instanceof exports.BSLValueTableColumn) 
			column = this.Индекс(context, column).valueOf();

		shift = shift.valueOf();

		let deletedElem = this.$object.splice(column, 1);
		this.$object.splice(column + shift, 0, deletedElem[0]);
	}

	Удалить(context, column){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет колонку из таблицы значений
			|       Параметры:
			|       Колонка - Тип: Число, Строка, КолонкаТаблицыЗначений. Имя колонки, ее индекс или сама колонка.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(column instanceof BSLString)
			column = this.Найти(context, column);

		if(column instanceof exports.BSLValueTableColumn)
			column = this.Индекс(context, column).valueOf();

		this.$object.splice(column, 1);
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

	*[Symbol.iterator]() {
		for(let elem of this.$object){
			yield elem;
		}
	}
}

exports.BSLValueTableColumn = class BSLValueTableColumn{
	$type;
	Заголовок;
	Имя;
	ТипЗначения;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект описывающий колонку таблицы значений`.replace(/\n[\s]+\|/g, "\n"));

		console.log(`Свойства:
		|	Имя - Тип: Строка. Имя колонки 
		|	Заголовок - Тип: Строка. Заголовок колонки
		|	ТипЗначения - Тип: Неопределено. Только чтение. Пока не реализовано`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}
	
	constructor(name = "", type = undefined, caption = ""){
		this.$type = require("./type").BSLAvailableTypes.КолонкаТаблицыЗначений;
		this.Заголовок = caption;
		this.Имя = name;
		this.ТипЗначения = type;

		require("./__objectHelper").setWriteOnly(this, "ТипЗначения");
	}

	toString(){
		return this.$type.toString();
	}

	valueOf(){
		return this.Имя;
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLCollectionIndexes = class BSLCollectionIndexes{
	$type;
	$object;
	$owner;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект для работы с индексами таблицы значений. Индексы можно обойти через Цикл.
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(owner){
		this.$type = require("./type").BSLAvailableTypes.ИндексыКоллекции;
		this.$object = [];
		this.$owner = owner;
	}

	$findIndexByColumns(columns){
		for(let index of this.$object){
			if(index.$hasColumns(columns))
				return index;
		}
	}

	async Добавить(context, columnsNames){
		if(context.$BSLRunner.$help){
			console.log(`Добавляет новый индекс для колонок таблицы значений
			|		Параметры:
			|		ИмяКолонок - Тип: Строка. Имена колонок через запятую
			|		
			|		Результат:
			|		ЭлементКоллекцииИндексов`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		let columns = columnsNames.split(/, ?/);

		let columnsResult = [];
		for(let columnName of columns){
			let column = this.$owner.Колонки.Найти(context, columnName.trim());

			if(column === BSLUndefined)
				await context.$BSLRunner.$throwError(context.$node, `Неверное имя колонки`);

			columnsResult.push(column);
		}

		let inserted = new exports.BSLCollectionIndex(columnsResult);
		this.$object.push(inserted);

		this.$owner.$indexesData.set(inserted, new Map);

		return inserted;
	}

	Количество(context){
		if(context.$BSLRunner.$help){
			console.log(`Возвращает количество элементов индексов
			|		
			|		Результат:
			|		Количество - Тип: Число.`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		return new BSLNumber(this.$object.length);
	}

	Очистить(context){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет все индексы из таблицы значений`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		this.$object.length = 0;
	}

	Удалить(context, index){
		if(context.$BSLRunner.$help){
			console.log(`Удаляет индекс из таблицы значений
			|		Параметры:
			|		Индекс - Тип: Число, ЭлементКоллекцииИндексов. Индекс элемента или сам элемент индекса`.replace(/\n[\s]+\|/g, "\n"));
			return;
		}

		if(index instanceof exports.BSLCollectionIndex)
			index = this.$object.indexOf(index);

		this.$object.splice(index, 1);
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

	*[Symbol.iterator]() {
		for(let elem of this.$object){
			yield elem;
		}
	}
}

exports.BSLCollectionIndex = class BSLCollectionIndex{
	$type;
	$object;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Объект описывающий индекс. Значения можно обойти через Цикл или получить конкретное значение через []. Возвращает строки с именами колонок
		|	
		|Методы:`.replace(/\n[\s]+\|/g, "\n"));

		await require("./__objectHelper").showHelpsForMethods(this, context);

		return;
	}

	constructor(columns){
		this.$type = require("./type").BSLAvailableTypes.ИндексКоллекции;
		this.$object = columns;
	}

	$hasColumns(columns){
		let result = true;
		for(column of columns){
			result = Math.min(result, this.$object.indexOf(column) != -1);
		}

		return result;
	}

	$getColumns(){
		return this.$object;
	}

	$getIndex(index){
		return this.$object[index.valueOf()].Имя;
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

	*[Symbol.iterator]() {
		for(let elem of this.$object){
			yield elem.Имя;
		}
	}
}