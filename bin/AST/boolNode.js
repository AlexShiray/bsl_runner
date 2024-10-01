const {BSLExpressionNode} = require("./expressionNode");

exports.BSLBoolNode = class BSLBoolNode extends BSLExpressionNode{
	token;
	value;

	constructor(token){
		let { BSLBool } = require("../globalContext/objects/bool");

		super(token);
		
		this.token = token;
		this.value = new BSLBool(token.text.toLowerCase() == "истина" || token.text.toLowerCase() == "true")
	}
}

