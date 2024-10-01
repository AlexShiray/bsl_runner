const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLObjectNode = class BSLObjectNode extends BSLExpressionNode{
	object;

	constructor(object){
		super(object);
		this.object = object;
	}
}

exports.BSLObjectContextNode = class BSLObjectContextNode extends BSLExpressionNode{
	objectNode;
	operator;

	constructor(objectNode, operator){
		super(operator);
		this.objectNode = objectNode;
		this.operator = operator;
	}
}

exports.BSLObjectAssignPropNode = class BSLObjectAssignPropNode extends BSLExpressionNode{
	objectNode;
	operator;
	objectProp;

	constructor(operator, objectNode, objectProp){
		super(operator);
		this.objectNode = objectNode;
		this.operator = operator;
		this.objectProp = objectProp;
	}
}