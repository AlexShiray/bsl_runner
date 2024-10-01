
exports.BSLDatabaseType = class BSLDatabaseType{
	$name;
	$type;
	$fnConnect;
	$fnQuery;
	$fnClose;
	$fnCheck;

	constructor(context, name){
		this.$type = require("./objects/type").BSLAvailableTypes.ТипБазыДанных;
		this.$name = name;
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLGCDatabaseType = {
	БазыДанных:{
		mysql: new exports.BSLDatabaseType(this, "mysql"),
		sqlite: new exports.BSLDatabaseType(this, "sqlite")
	
	}
};

// #region MYSQL Functions

exports.BSLGCDatabaseType.БазыДанных.mysql.$fnConnect = async (context, host, port, user, pass, db, timeout = 0) => {
	const mariadb = require("mariadb");

	try{
		this.$object = await mariadb.createConnection({
			host: host.valueOf(),
			port: port.valueOf(),
			user: user.valueOf(),
			password: pass.valueOf(),
			database: db.valueOf(),
			socketTimeout: timeout,
			multipleStatements: true
		});
	}catch(e){
		context.$BSLRunner.$throwError(context.$node, `Ошибка работы с базой данных: ${e.message}`);
	}
}

exports.BSLGCDatabaseType.БазыДанных.mysql.$fnQuery = async (context, query) => {
	const { BSLQueryResult } = require("./objects/query");

	let parameters = {};

	for(let keyVal of query.Параметры.$object.entries()){
		parameters[keyVal[0]] = keyVal[1];
	}
	try{
		let result = await this.$object.query({
			sql: query.Текст.replace(/:/g, "\\:").replace(/&/g, ":"),
			namedPlaceholders: true
		}, parameters);

		return new BSLQueryResult(result);
	}catch(e){
		context.$BSLRunner.$throwError(context.$node, `Ошибка работы с базой данных: ${e.message}`);
	}
}

exports.BSLGCDatabaseType.БазыДанных.mysql.$fnClose = async (context) => {
	try{
		await this.$object.end();
	}catch(e){
		context.$BSLRunner.$throwError(context.$node, `Ошибка закрытия базы данных: ${e.message}`);
	}
}

exports.BSLGCDatabaseType.БазыДанных.mysql.$fnCheck = async (context) => {
	const { BSLBool } = require("./objects/bool");
	try{
		await this.$object.ping();
	}catch(e){
		return new BSLBool(true);
	}

	return new BSLBool(false);
}

// #endregion mysql

// #region SQLITE Functions

exports.BSLGCDatabaseType.БазыДанных.sqlite.$fnConnect = async (context, file) => {
	const {AsyncDatabase} = require('promised-sqlite3');

	try{
		this.$object = await AsyncDatabase.open(file);
	}catch(e){
		context.$BSLRunner.$throwError(context.$node, `Ошибка работы с базой данных: ${e.message}`);
	}
}

exports.BSLGCDatabaseType.БазыДанных.sqlite.$fnQuery = async (context, query) => {
	const { BSLQueryResult } = require("./objects/query");

	let parameters = {};

	for(let keyVal of query.Параметры.$object.entries()){
		parameters[`$${keyVal[0]}`] = keyVal[1];
	}
	try{
		let result = await this.$object.all(query.Текст.replace(/&/g, "$"), parameters);

		return new BSLQueryResult(result);
	}catch(e){
		context.$BSLRunner.$throwError(context.$node, `Ошибка работы с базой данных: ${e.message}`);
	}
}

exports.BSLGCDatabaseType.БазыДанных.sqlite.$fnClose = async (context) => {
	try{
		await this.$object.close();
	}catch(e){
		context.$BSLRunner.$throwError(context.$node, `Ошибка закрытия базы данных: ${e.message}`);
	}
}

// #endregion sqlite

