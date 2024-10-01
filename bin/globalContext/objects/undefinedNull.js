
exports.BSLUndefined = class BSLUndefined{
	static toString(){
		return "";
	}

	static valueOf(){
		return undefined;
	}

	static typeOf(context){
		return require("./type").BSLAvailableTypes.Неопределено;
	}
}

exports.BSLNull = class BSLNull{
	static toString(){
		return "";
	}

	static valueOf(){
		return null;
	}

	static typeOf(context){
		return require("./type").BSLAvailableTypes.NULL;
	}
}