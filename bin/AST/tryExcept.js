const { BSLExpressionNode } = require("./expressionNode");

exports.BSLTryNode = class BSLTryNode extends BSLExpressionNode{
	exception;
	tryBlock;

	constructor(tryToken, code, exceptCode = undefined){
		super(tryToken);
		this.exception = exceptCode;
		this.tryBlock = code;
	}
}