const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLVariableNode = class BSLVariableNode extends BSLExpressionNode{
	variable;

	constructor(variable){
		super(variable);
		this.variable = variable;
	}
}