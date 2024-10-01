const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLStatementsNode = class BSLStatementsNode extends BSLExpressionNode{
	codeStrings = [];

	addNode(node){
		this.codeStrings.push(node);
	}
}