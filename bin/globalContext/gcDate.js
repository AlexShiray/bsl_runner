const { BSLDate } = require("./objects/date");
const { BSLString } = require("./objects/string");

exports.BSLGCDate = {
	Дата: function (context, yearOrValue, month = undefined, day = undefined, hour = undefined, min = undefined, sec = undefined) {
		let datevalue;

		if(yearOrValue instanceof BSLString){
			datevalue = yearOrValue.replace(/([\d]{4})([\d]{2})([\d]{2})(?:([\d]{2})([\d]{2})([\d]{2}))?/i, (str, ...matches) => {
				let value = `${matches[0]}-${matches[1]}-${matches[2]}`;
				if(matches[3] != undefined){
					value += `T${matches[3]}:${matches[4]}:${matches[5]}`;
				}else{
					value += `T00:00:00`;
				}

				return value;
			});
		}else{
			datevalue = `${yearOrValue}-${(month < 10 ? `0${month}` : month)}-${(day < 10 ? `0${day}` : day)}`;
			if(hour != undefined){
				datevalue += `T${(hour < 10 ? `0${hour}` : hour)}:${(min < 10 ? `0${min}` : min)}:${(sec < 10 ? `0${sec}` : sec)}`;
			}else{
				datevalue += `T00:00:00`;
			}
		}

		let date = new BSLDate(context, datevalue);
		if(isNaN(date)){
			context.$BSLRunner.$throwError(context.$node, `Преобразование значения к типу Дата не может быть выполнено`);
		}

		return date;
	},

	Год: function (context, date) {
		return date.getFullYear();
	},

	День: function (context, date) {
		return date.getDate();
	},

	ДеньГода: function (context, date) {
		let dateStartYear = this.BSLGCDate.НачалоГода(context, date),
			diffMs = date - dateStartYear;
		
		return parseInt((diffMs / 1000 / 60 / 60 / 24).toFixed(0));
	},

	ДеньНедели: function (context, date) {
		return date.getDay();
	},

	ДобавитьМесяц: function (context, date, monthCount) {
		let curMonth = 0,
			curDate = new BSLDate(context, date);

		while(curMonth != monthCount){
			let needMonth = curDate.getMonth() + 1;
			curDate.setMonth(needMonth);

			if(curDate.getMonth() > needMonth){
				curDate = new BSLDate(context, curDate - 24 * 60 * 60 * 1000);
			}

			if(monthCount > 0){
				curMonth++;
			}else{
				curMonth--;
			}
		}

		return curDate;
	},

	КонецГода: function (context, date) {
		let dateEnd = new BSLDate(context, date);
		dateEnd.setDate(31);
		dateEnd.setMonth(11);
		dateEnd.setHours(23);
		dateEnd.setMinutes(59);
		dateEnd.setSeconds(59);
		dateEnd.setMilliseconds(999);

		return dateEnd;
	},

	КонецДня: function (context, date) {
		let dateEnd = new BSLDate(context, date);
		dateEnd.setHours(23);
		dateEnd.setMinutes(59);
		dateEnd.setSeconds(59);
		dateEnd.setMilliseconds(999);

		return dateEnd;
	},

	КонецКвартала: function (context, date) {
		let curMonth = this.BSLGCDate.Месяц(context, date),
			curQuart = curMonth % 3;

		return this.BSLGCDate.КонецМесяца(context, this.BSLGCDate.ДобавитьМесяц(context, date, curMonth - curQuart * 3));
	},

	КонецМесяца: function (context, date) {
		let startOfDay = this.BSLGCDate.НачалоДня(context, date);
		return new BSLDate(context, this.BSLGCDate.НачалоМесяца(context, this.BSLGCDate.ДобавитьМесяц(context, startOfDay, 1)) - 1000);
	},

	КонецМинуты: function (context, date) {
		let dateEnd = new BSLDate(context, date);
		dateEnd.setSeconds(59);
		dateEnd.setMilliseconds(999);

		return dateEnd;
	},

	КонецНедели: function (context, date) {
		let startOfWeek = this.BSLGCDate.НачалоНедели(context, date);

		return this.BSLGCDate.КонецДня(context, startOfWeek.__add__(6 * 24 * 60 * 60 * 1000));
	},

	КонецЧаса: function (context, date) {
		let dateEnd = new BSLDate(context, date);
		dateEnd.setMinutes(59);
		dateEnd.setSeconds(59);
		dateEnd.setMilliseconds(999);

		return dateEnd;
	},

	Месяц: function (context, date) {
		return date.getMonth() + 1;
	},

	Минута: function (context, date) {
		return date.getMinutes();
	},

	НачалоГода: function (context, date) {
		let dateStart = new BSLDate(context, date);
		dateStart.setDate(1);
		dateStart.setMonth(0);
		dateStart.setHours(0);
		dateStart.setMinutes(0);
		dateStart.setSeconds(0);
		dateStart.setMilliseconds(0);

		return dateStart;
	},

	НачалоДня: function (context, date) {
		let dateStart = new BSLDate(context, date);
		dateStart.setHours(0);
		dateStart.setMinutes(0);
		dateStart.setSeconds(0);
		dateStart.setMilliseconds(0);

		return dateStart; 
	},

	НачалоКвартала: function (context, date) {
		let curMonth = this.BSLGCDate.Месяц(context, date),
			curQuart = curMonth % 3;

		return this.BSLGCDate.НачалоМесяца(context, this.BSLGCDate.ДобавитьМесяц(context, date, curMonth - (curQuart - 1) * 3));
	},

	НачалоМесяца: function (context, date) {
		let dateStart = new BSLDate(context, date);
		dateStart.setDate(1);
		dateStart.setHours(0);
		dateStart.setMinutes(0);
		dateStart.setSeconds(0);
		dateStart.setMilliseconds(0);

		return dateStart;
	},

	НачалоМинуты: function (context, date) {
		let dateStart = new BSLDate(context, date);
		dateStart.setSeconds(0);
		dateStart.setMilliseconds(0);

		return dateStart;
	},

	НачалоНедели: function (context, date) {
		return this.BSLGCDate.НачалоДня(context, date.__sub__((date.getDay() - 1) * 24 * 60 * 60 * 1000));
	},

	НачалоЧаса: function (context, date) {
		let dateStart = new BSLDate(context, date);
		dateStart.setMinutes(0);
		dateStart.setSeconds(0);
		dateStart.setMilliseconds(0);

		return dateStart;
	},

	НеделяГода: function (context, date) {
		return parseInt((this.BSLGCDate.ДеньГода(context, date) / 7 + 0.5).toFixed(0))
	},

	Секунда: function (context, date) {
		return date.getSeconds();
	},
	
	ТекущаяДата: function (context) {
		return new BSLDate(context);
	},
	
	Час: function (context, date) {
		return date.getHours();
	},
	
}