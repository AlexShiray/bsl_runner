const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLConditionNode = class BSLConditionNode extends BSLExpressionNode{
	condition;
	trueNode;
	falseNode;

	constructor(tokenIf, condition, trueNode, falseNode = null){
		super(tokenIf);
		
		this.condition = condition;
		this.trueNode = trueNode;
		this.falseNode = falseNode;
	}
}

exports.BSLConditionExpressionNode = class BSLConditionExpressionNode extends BSLExpressionNode{
	expression;

	constructor(expression){
		super(expression);
		
		this.expression = expression;
	}
}

exports.BSLConditionGroupOperators = {
	AND: "AND",
	OR: "OR",
	NOT: "NOT"
};