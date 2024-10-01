
exports.setWriteOnly = function(object, propName){
	Object.defineProperty(object, propName, {
		writable: false
	});
}

exports.parseToJsObject = function(BSLObject, recursive = false){
	let result;
	if(typeof(BSLObject.valueOf) === 'function')
		result = BSLObject.valueOf();
	else if(BSLObject.$object !== undefined)
		result = BSLObject.$object;
	else
		result = BSLObject;

	if(recursive){
		if(result instanceof Array){
			for(let i = 0; i < result.length; i++){
				result[i] = exports.parseToJsObject(result[i], recursive);
			}
		}else if(result instanceof Map){
			result = Object.fromEntries(result.entries());

			for(let key of Object.keys(result)){
				result[key] = exports.parseToJsObject(result[key], recursive);
			}
		}
	}

	return result;
}

exports.parseFromJsObject = function(JSObject, recursive = false){
	const { BSLArray } = require("./array");
	const { BSLMap } = require("./map");
	const { BSLStruct } = require("./struct");
	const { BSLBool } = require("./bool");
	const { BSLDate } = require("./date");
	const { BSLNumber } = require("./number");
	const { BSLString } = require("./string");

	let result;
	if(JSObject instanceof Array){
		result = new BSLArray;
	}else if(JSObject instanceof Map){
		result = new BSLMap;
	}else if(JSObject instanceof Object){
		result = new BSLStruct;
	}else if(JSObject instanceof Date){
		result = new BSLDate(undefined, JSObject);
	}else{
		switch(typeof(JSObject)){
			case "number":
				result = new BSLNumber(JSObject);
				break;
			case "boolean":
				result = new BSLBool(JSObject);
				break;
			case "string":
				result = new BSLString(JSObject);
				break;
		}
	}

	if(recursive){
		if(JSObject instanceof Array){
			for(let i = 0; i < JSObject.length; i++){
				result.Добавить(undefined, exports.parseFromJsObject(JSObject[i], recursive));
			}
		}else if(JSObject instanceof Map){
			for(let key of JSObject.keys()){
				result.Вставить(undefined, key, exports.parseFromJsObject(JSObject.get(key), recursive));
			}
		}else if(JSObject instanceof Object){
			for(let key of Object.keys(JSObject)){
				result.Вставить(undefined, key, exports.parseFromJsObject(JSObject[key], recursive));
			}
		}
	}

	return result;
}

exports.showHelpsForMethods = async function(objClass, context){
	let obj;

	if(objClass.constructor.name === "Function"){
		obj = new objClass();
	}else{
		obj = objClass;
	}
	let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

	for(let method of methods){
		if(method == "constructor") continue;
		if(method[0] == "$") continue;
		if(method == "typeOf") continue;
		if(method == "toString") continue;
		if(method == "valueOf") continue;

		console.log(method);
		await obj[method](context);
	}
}