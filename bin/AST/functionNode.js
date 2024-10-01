const { BSLExpressionNode } = require("./expressionNode");

exports.BSLFunctionNode = class BSLFunctionNode extends BSLExpressionNode{
	functionName;
	arguments;
	filename;
	code;
	isExport;
	isProcedure;
	isAsync;

	constructor(functionName, args, code, isExport, isProcedure, filename, isAsync = false){
		super(functionName);

		this.functionName = functionName;
		this.arguments = args;
		this.code = code;
		this.isExport = isExport == true;
		this.isProcedure = isProcedure;
		this.filename = filename;
		this.isAsync = isAsync;
	}
}

exports.BSLFunctionArgument = class BSLFunctionArgument extends BSLExpressionNode{
	argName;
	def;
	valueOnly;

	constructor(argName, def, valueOnly){
		super(argName);

		this.argName = argName;
		this.def = def;
		this.valueOnly = valueOnly;
	}
}

exports.BSLReturnNode = class BSLReturnNode extends BSLExpressionNode{
	operand;

	constructor(token, operand = undefined){
		super(token);

		this.operand = operand;
	}
}