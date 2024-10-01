const BSLTokenType = require("./tokenTypes");

exports.BSLToken = class BSLToken {
	type;
	text;
	pos;
	lineNo;

	constructor(type, text, lineNo, pos){
		this.type = type;
		this.text = text;
		this.lineNo = lineNo;
		this.pos = pos;
	}
}
