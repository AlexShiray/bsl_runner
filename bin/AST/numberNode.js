const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLNumberNode = class BSLNumberNode extends BSLExpressionNode{
	number;

	constructor(number){
		super(number);
		this.number = number;
	}
}