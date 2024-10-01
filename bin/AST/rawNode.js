
exports.BSLRawNode = class BSLRawNode{
	rawValue;

	constructor(rawValue){
		this.rawValue = rawValue;
	}
}

exports.BSLEvalFuncNode = class BSLEvalFuncNode{
	evalFunc;

	constructor(evalFunc){
		this.evalFunc = evalFunc;
	}
}