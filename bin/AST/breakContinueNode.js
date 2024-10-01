const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLBreakNode = class BSLBreakNode extends BSLExpressionNode{
	breakToken;

	constructor(breakToken){
		super(breakToken);
		this.breakToken = breakToken;
	}
}

exports.BSLContinueNode = class BSLContinueNode extends BSLExpressionNode{
	continueToken;

	constructor(continueToken){
		super(continueToken);
		this.continueToken = continueToken;
	}
}

exports.BSLExceptNode = class BSLExceptNode{

}