const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLStringNode = class BSLStringNode extends BSLExpressionNode{
	strings;

	constructor(...strings){
		super(strings[0]);
		this.strings = strings;
	}
}