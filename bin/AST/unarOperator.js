const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLUnarOperatorNode = class BSLUnarOperatorNode extends BSLExpressionNode{
	operator;
	operands;

	constructor(operator, ...operands){
		super(operator);
		
		this.operator = operator;
		this.operands = operands;
	}
}