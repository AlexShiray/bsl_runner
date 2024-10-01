
exports.BSLLexer = class extends require("./helper").BSLHelper{
	code;
	#lineNo = 0;
	#pos = 0;
	tokenList = [];
	filename;
	#posNL = [];
	#tokenTypeList;

	constructor(code = ""){
		super();
		this.code = code;
	}

	async lexAnalysis(){
		this.#tokenTypeList = require("./tokenTypes").tokenTypeList;
		let matches = this.code.matchAll(/\n/g);

		for(let match of matches){
			this.#posNL.push(match.index);
		}

		while(await this.nextToken()){}

		let funcprocArr = [],
			findedIdxStart;
		while((findedIdxStart = this.tokenList.findIndex(token => token.type === this.#tokenTypeList.FUNC || token.type === this.#tokenTypeList.PROC)) >= 0){
			let findedIdxEnd;
			if(this.tokenList[findedIdxStart].type === this.#tokenTypeList.FUNC){
				findedIdxEnd = this.tokenList.findIndex((token, index) => token.type === this.#tokenTypeList.ENDFUNC && index > findedIdxStart);
			}else if(this.tokenList[findedIdxStart].type === this.#tokenTypeList.PROC){
				findedIdxEnd = this.tokenList.findIndex((token, index) => token.type === this.#tokenTypeList.ENDPROC && index > findedIdxStart);
			}

			if(findedIdxEnd < 0){
				await this.$throwError(this.tokenList[findedIdxStart], `Незакрытый оператор (${this.tokenList[findedIdxStart].text})`);
			}

			if(this.tokenList[findedIdxEnd + 1] !== undefined && this.tokenList[findedIdxEnd + 1].type === this.#tokenTypeList.SEMICOLON){
				findedIdxEnd++;
			}

			funcprocArr.push(...this.tokenList.splice(findedIdxStart, findedIdxEnd - findedIdxStart + 1));

			if(funcprocArr[funcprocArr.length - 1].type !== this.#tokenTypeList.SEMICOLON){
				funcprocArr.push(new (require("./token").BSLToken)(this.#tokenTypeList.SEMICOLON, ";", 0, 0));
			}
		}

		this.tokenList.splice(0, 0, ...funcprocArr);

		this.#tokenTypeList = null;
		return this.tokenList;
	}

	async nextToken(){
		if(this.#pos >= this.code.length){
			return false;
		}

		this.#lineNo = this.#posNL.findIndex(item => item > this.#pos);
		if(this.#lineNo < 0){
			this.#lineNo = this.#posNL.length;
		}
		let pos = this.#pos - (this.#lineNo > 0 ? this.#posNL[this.#lineNo - 1] : 0);

		const tokenTypesValues = Object.values(this.#tokenTypeList);
		for (let i = 0; i < tokenTypesValues.length; i++) {
			var resultStr = this.code.substring(this.#pos);

			let tokenType = tokenTypesValues[i],
				regexp = tokenType.regexp,
				result = resultStr.match(regexp);

			if(result && result[0]){
				let textResult;
				if(result[1])
					textResult = result[1];
				else
					textResult = result[0];

				if(tokenType !== this.#tokenTypeList.SPACE && 
					tokenType !== this.#tokenTypeList.COMMENT &&
					tokenType !== this.#tokenTypeList.REGION &&
					tokenType !== this.#tokenTypeList.ENDREGION)
				{
					let token = new (require("./token").BSLToken)(tokenType, textResult, this.#lineNo, pos);
					this.tokenList.push(token);
				}
					
				this.#pos += result[0].length;

				return true;
			}
		}

		await this.$throwError(undefined, `Неизвестный оператор (${resultStr.replace(/\.?([^\s\(;]+).*/ius, "$1")})`, pos + 1, this.#lineNo + 1);
	}
}