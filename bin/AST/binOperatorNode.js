const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLBinOperatorNode = class BSLBinOperatorNode extends BSLExpressionNode{
	operator;
	leftNode;
	rightNode;
	isCondition;

	constructor(operator, leftNode, rightNode, isCondition = false){
		super(operator);
		
		this.operator = operator;
		this.leftNode = leftNode;
		this.rightNode = rightNode;
		this.isCondition = isCondition;
	}
}