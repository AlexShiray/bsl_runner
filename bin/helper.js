const { BSLExceptNode } = require("./AST/breakContinueNode");

exports.BSLHelper = class{
	filename;
	code;
	
	$getErrorHead(pos, lineNo){
		return `{${(this.filename ? this.filename : "<Неизвестный модуль>")}` + (lineNo != NaN && pos != undefined ? `(${lineNo + 1}:${pos})` : "") + `}:`;
	}

	$getCodeByLineNo(lineNo, pos = -1){
		if(lineNo === undefined || isNaN(lineNo)) return "";

		if(this.code === undefined){
			return "<Исходный код недоступен>";
		}

		let line = this.code.split("\n")[lineNo];
			//lineOrigLength = line.length;

		line = line.trim();

		// let lineNewLength = line.length,
		// 	lengthDiff = lineOrigLength - lineNewLength;

		if(pos >= 0){
			line = line;//.substring(0, pos - lengthDiff) + line.substring(pos - lengthDiff);
		}

		return line;
	}

	$getErrorMessage(errorInfo){
		let pos = errorInfo.pos,
			lineNo = errorInfo.lineNo,
			text = errorInfo.description;
		return `${this.$getErrorHead(pos, lineNo)} ${text}\n\t${this.$getCodeByLineNo(lineNo, pos)}`;
	}

	async $throwError(node, text, pos = undefined, lineNo = NaN, error = undefined){
		if(pos === undefined)
			pos = node.pos;

		if(isNaN(lineNo))
			lineNo = node.lineNo;

		this.$exception = new exports.BSLErrorInfo(text, pos, lineNo, this.$getCodeByLineNo(lineNo, pos), this.$stack);
		if(this.$tryNode !== undefined){
			if(this.$tryNode.exception !== undefined)
				await this.run(this.$tryNode.exception);

			this.$tryNode = undefined;
			this.$exception = undefined;
			await this.run(new BSLExceptNode);
			return;
		}

		console.error(this.$getErrorMessage(this.$exception));
		if(process.env.stacktrace === "1"){
			if(error === undefined){
				 console.trace("Error during eval bsl code");
			}else{
				throw error;
			}
		}
		process.exit();
	}
}

exports.BSLErrorInfo = class{
	description;
	pos;
	lineNo;
	sourceCode;
	stacktrace;
	$type;

	constructor(description, pos, lineNo, sourceCode, stacktrace){
		this.$type = require("./globalContext/objects/type").BSLAvailableTypes.ИнформацияОбОшибке;

		this.description = description;
		this.pos = pos;
		this.lineNo = lineNo;
		this.sourceCode = sourceCode;
		if(typeof(stacktrace) === 'object')
			this.stacktrace = Object.assign(stacktrace);
	}

	get __description(){
		return this.description;
	}

	get __pos(){
		return this.pos;
	}

	get __lineNo(){
		return this.lineNo;
	}

	Описание(){
		return this.description;
	}

	НомерСтроки(){
		return this.lineNo + 1;
	}

	ИсходнаяСтрока(){
		return this.sourceCode;
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}


