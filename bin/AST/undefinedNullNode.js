const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLUndefinedNode = class BSLUndefinedNode extends BSLExpressionNode{

	constructor(undefinedToken){
		super(undefinedToken);
	}
}

exports.BSLNullNode = class BSLNullNode extends BSLExpressionNode{

	constructor(nullToken){
		super(nullToken);
	}
}