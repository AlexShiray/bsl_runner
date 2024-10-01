exports.BSLExpressionNode = class BSLExpressionNode {
	pos;
	lineNo;
	text;

	constructor(token = null){
		if(token){
			this.pos = token.pos;
			this.lineNo = token.lineNo;
			this.text = token.text;
		}
	}
}