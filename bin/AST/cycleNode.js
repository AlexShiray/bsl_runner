const {BSLExpressionNode} = require("./expressionNode.js");

exports.BSLCycleNode = class BSLCycleNode extends BSLExpressionNode{
	cycle;
	expression;
	to;
	code;
	isDown;

	constructor(cycle, expression, to, code, isDown = false){
		super(cycle);
		this.cycle = cycle;
		this.expression = expression;
		this.to = to;
		this.code = code;
		this.isDown = isDown;
	}
}