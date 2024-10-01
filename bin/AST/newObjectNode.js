const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLNewObjectNode = class BSLNewObjectNode extends BSLExpressionNode{
	object;

	constructor(object){
		super(object);
		this.object = object;
	}
}