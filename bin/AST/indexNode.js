const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLIndexNode = class BSLIndexNode extends BSLExpressionNode{
	operator;
	index;

	constructor(operator, index){
		super(operator);
		
		this.operator = operator;
		this.index = index;
	}
}