
exports.BSLDatabase = class BSLDatabase{
	$type;
	$object;
	ТипБазыДанных;

	constructor(context, type){
		this.$type = require("./type").BSLAvailableTypes.БазаДанных;
		this.ТипБазыДанных = type;
	}

	async Соединиться(context, host, port, user, pass, db, timeout = 0){
		if(this.ТипБазыДанных.$fnConnect){
			await this.ТипБазыДанных.$fnConnect(context, host, port, user, pass, db, timeout * 1000);
		}else{
			await context.$BSLRunner.$throwError(context.$node, `Нет функции соединения с БД`);
		}
	}

	async ВыполнитьЗапрос(context, query){
		if(this.ТипБазыДанных.$fnQuery){
			return await this.ТипБазыДанных.$fnQuery(context, query);
		}else{
			await context.$BSLRunner.$throwError(context.$node, `Нет функции запроса к БД`);
		}
	}

	async Закрыть(context){
		if(this.ТипБазыДанных.$fnClose){
			return await this.ТипБазыДанных.$fnClose(context);
		}else{
			await context.$BSLRunner.$throwError(context.$node, `Нет функции закрытия БД`);
		}
	}

	async Закрыта(context){
		if(this.ТипБазыДанных.$fnCheck){
			return await this.ТипБазыДанных.$fnCheck(context);
		}else{
			await context.$BSLRunner.$throwError(context.$node, `Нет функции проверки закрытия БД`);
		}
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}