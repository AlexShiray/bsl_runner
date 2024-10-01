const {BSLVariableNode} = require("./AST/variableNode")
	, {BSLUnarOperatorNode} = require("./AST/unarOperator")
	, {BSLObjectContextNode} = require("./AST/objectNode")
	, {BSLConditionNode, BSLConditionExpressionNode} = require("./AST/conditionNode")
;

exports.BSLParser = class extends require("./helper").BSLHelper{
	tokens;
	#pos = 0;
	#funcContext = false;
	#procContext = false;
	#tokenTypeList;

	constructor(tokens = []){
		super();
		this.tokens = tokens;
	}

	match(...expected){
		let currentToken;

		if(this.#pos < this.tokens.length){
			currentToken = this.tokens[this.#pos];
		}else{
			return null;
		}

		if(expected.find(type => type === currentToken.type)){
			this.#pos++;
			return currentToken;
		}

		return null;
	}

	matchFromPos(pos, ...expected){
		let currentToken;

		if(pos < this.tokens.length){
			currentToken = this.tokens[pos];
		}else{
			return null;
		}

		if(expected.find(type => type === currentToken.type)){
			return currentToken;
		}

		return null;
	}

	async require(...expected){
		let token = this.match(...expected);
		if(!token){
			await this.$throwError(this.tokens[this.#pos], `Неопознанный оператор ("${this.tokens[this.#pos].text}")`);
		}

		return token;
	}

	async requireFromPos(pos, ...expected){
		let token = this.matchFromPos(pos, ...expected);
		if(!token){
			await this.$throwError(this.tokens[this.#pos], `Неопознанный оператор ("${this.tokens[pos].text}")`);
		}

		return token;
	}

	// Ваще весь поиск надо переделывать чтоб он принимал 3 аргумента, тек позиция, что ожидается и какой токен начала блока для вложенных блоков криво работает
	search(curPos = -1, ...expected){
		if(curPos < 0){
			curPos = this.#pos;
		}

		for(let pos = curPos; pos < this.tokens.length; pos++){
			let token = this.matchFromPos(pos, ...expected);
			if(token){
				return pos;
			}
		}

		return null;
	}

	searchEndBlock(curPos = -1, expected, blockStarts){
		let startBlock = this.search(curPos, ...blockStarts);

		if(startBlock !== null){
			curPos = this.searchEndBlock(startBlock + 1, expected, blockStarts);
		}

		return this.search(curPos + 1, ...expected);
	}

	searchToken(curPos = -1, ...expected){
		if(curPos < 0){
			curPos = this.#pos;
		}

		for(let pos = curPos; pos < this.tokens.length; pos++){
			let token = this.matchFromPos(pos, ...expected);
			if(token){
				return token;
			}
		}

		return null;
	}

	async startParse(){
		this.#tokenTypeList = require("./tokenTypes").tokenTypeList;
		let result = await this.parseCode();
		this.#tokenTypeList = null;

		return result;
	}

	async parseCode(parseTo = -1){
		let {BSLStatementsNode} = require("./AST/statementsNode");
		let root = new BSLStatementsNode;

		if(parseTo < 0){
			parseTo = this.tokens.length;
		}

		while(this.#pos < parseTo){
			let codeStringNode = await this.parseExpression();
			if(this.#pos < parseTo)
				await this.require(this.#tokenTypeList.SEMICOLON);

			root.addNode(codeStringNode);
		}

		return root;
	}

	async parseExpression(isCond = false){
		let {BSLBinOperatorNode} = require("./AST/binOperatorNode"),
			{BSLReturnNode} = require("./AST/functionNode");
		let checkTypes = [this.#tokenTypeList.VARIABLE];

		if(isCond){
			checkTypes.push(this.#tokenTypeList.CALLFUNC);
		}

		let checkNode = this.match(...checkTypes),
			returnNode;

		if(checkNode !== null){
			if(checkNode !== null)
				this.#pos--;
			let varNode = await this.parseBaseType(),
				matchTokens = [this.#tokenTypeList.ASSIGN, this.#tokenTypeList.PLUSASSIGN, this.#tokenTypeList.MINUSASSIGN, this.#tokenTypeList.PLUSONE, this.#tokenTypeList.MINUSONE],
				assignOperator = this.match(...matchTokens);

			if(assignOperator == null){
				if(isCond){
					return varNode;
				}
				this.#pos--;
				return null;
			}

			if(assignOperator.type == this.#tokenTypeList.PLUSONE || assignOperator.type == this.#tokenTypeList.MINUSONE){
				return new BSLBinOperatorNode(assignOperator, varNode, null);
			}

			let rightFormulaNode = await this.parseFormula();

			return new BSLBinOperatorNode(assignOperator, varNode, rightFormulaNode);
		}else
		if(this.match(this.#tokenTypeList.CALLFUNC, this.#tokenTypeList.HELP) !== null){
			this.#pos--;
			return await this.parseCallFunc();
		}else
		if(!this.#funcContext && !this.#procContext && this.match(this.#tokenTypeList.FUNC, this.#tokenTypeList.PROC, this.#tokenTypeList.ASYNC) !== null){
			this.#pos--;
			return await this.parseFuncProc();
		}else
		if((this.#funcContext || this.#procContext) && (returnNode = this.match(this.#tokenTypeList.RETURN)) !== null){
			if(this.#funcContext){
				return new BSLReturnNode(returnNode, await this.parseExpressionOrFormula());
			}else
			if(this.#procContext){
				if(this.match(this.#tokenTypeList.SEMICOLON) === null){
					await this.$throwError(this.tokens[this.#pos], `Процедура не может возвращать значение`);
				}else
					this.#pos--;

				return new BSLReturnNode(returnNode);
			}
		}else
		if(this.match(
			this.#tokenTypeList.OBJECT, 
			this.#tokenTypeList.IF, 
			this.#tokenTypeList.FOR, 
			this.#tokenTypeList.FOREACH, 
			this.#tokenTypeList.WHILE, 
			this.#tokenTypeList.BREAK, 
			this.#tokenTypeList.CONTINUE,
			this.#tokenTypeList.TRUE, 
			this.#tokenTypeList.FALSE,
			this.#tokenTypeList.RAISE,
			this.#tokenTypeList.TRY
		) !== null){
			this.#pos--;
			return await this.parseBaseType();
		}
	}

	async parseBaseType(){
		const {BSLNumberNode} = require("./AST/numberNode"),
			{BSLStringNode} = require("./AST/stringNode"),
			{BSLBoolNode} = require("./AST/boolNode"),
			{BSLNewObjectNode} = require("./AST/newObjectNode"),
			{BSLObjectNode} = require("./AST/objectNode"),
			{BSLIndexNode} = require("./AST/indexNode"),
			{BSLCycleNode} = require("./AST/cycleNode");
		let number = this.match(this.#tokenTypeList.NUMBER);
		if(number !== null){
			return new BSLNumberNode(number);
		}

		let string = this.match(this.#tokenTypeList.STRING);
		if(string !== null){
			let nextString = this.match(this.#tokenTypeList.STRING),
				strings = [string];

			while(nextString !== null){
				strings.push(nextString);
				nextString = this.match(this.#tokenTypeList.STRING)
			}

			return new BSLStringNode(...strings);
		}

		let bool = this.match(this.#tokenTypeList.TRUE, this.#tokenTypeList.FALSE);
		if(bool !== null){
			return new BSLBoolNode(bool);
		}

		let newobject = this.match(this.#tokenTypeList.NEWOBJECT);
		if(newobject !== null){
			let object = await this.parseCallFunc();
			return new BSLNewObjectNode(object);
		}

		let object = this.match(this.#tokenTypeList.OBJECT);
		if(object !== null){
			let LBIDX = this.match(this.#tokenTypeList.LBIDX),
				objectNode = new BSLObjectNode(object);

			if(LBIDX !== null){
				objectNode = new BSLIndexNode(objectNode, await this.parseExpressionOrFormula(true));

				await this.require(this.#tokenTypeList.RBIDX);
			}

			return await this.parseObjectMethodProp(objectNode);
		}

		let tokenIf = this.match(this.#tokenTypeList.IF);

		if(tokenIf !== null){
			return await this.parseCondition(tokenIf);
		}

		let tokenCycle = this.match(this.#tokenTypeList.FOR, this.#tokenTypeList.WHILE, this.#tokenTypeList.FOREACH);
		
		if(tokenCycle !== null){
			if(tokenCycle.type === this.#tokenTypeList.WHILE){
				let expression = new BSLConditionExpressionNode(await this.parseFormula(true));

				await this.require(this.#tokenTypeList.CYCLESTART);

				let forEnd = this.searchEndBlock(-1, [this.#tokenTypeList.CYCLEEND], [this.#tokenTypeList.FOR, this.#tokenTypeList.WHILE, this.#tokenTypeList.FOREACH]);

				if(forEnd === null){
					await this.$throwError(this.tokens[this.#pos], `Ожидается ключевое слово 'КонецЦикла'`);
				}

				let code = await this.parseCode(forEnd);

				await this.require(this.#tokenTypeList.CYCLEEND);

				return new BSLCycleNode(tokenCycle, expression, null, code);
			}else
			if(tokenCycle.type === this.#tokenTypeList.FOR){
				let expression = await this.parseExpression();
					
				await this.require(this.#tokenTypeList.FORTO);

				let to = await this.parseExpressionOrFormula();

				let cyclestart = await this.require(this.#tokenTypeList.CYCLESTART, this.#tokenTypeList.CYCLESTARTDOWN);

				let forEnd = this.searchEndBlock(-1, [this.#tokenTypeList.CYCLEEND], [this.#tokenTypeList.FOR, this.#tokenTypeList.WHILE, this.#tokenTypeList.FOREACH]);

				if(forEnd === null){
					await this.$throwError(this.tokens[this.#pos], `Ожидается ключевое слово 'КонецЦикла'`);
				}

				let code = await this.parseCode(forEnd);

				await this.require(this.#tokenTypeList.CYCLEEND);

				return new BSLCycleNode(tokenCycle, expression, to, code, cyclestart.type == this.#tokenTypeList.CYCLESTARTDOWN);
			}else
			if(tokenCycle.type === this.#tokenTypeList.FOREACH){
				let expression = await this.parseExpressionOrFormula();
					
				await this.require(this.#tokenTypeList.FOROF);

				let to = await this.parseExpressionOrFormula();

				await this.require(this.#tokenTypeList.CYCLESTART);

				let forEnd = this.searchEndBlock(-1, [this.#tokenTypeList.CYCLEEND], [this.#tokenTypeList.FOR, this.#tokenTypeList.WHILE, this.#tokenTypeList.FOREACH]);

				if(forEnd === null){
					await this.$throwError(this.tokens[this.#pos], `Ожидается ключевое слово 'КонецЦикла'`);
				}

				let code = await this.parseCode(forEnd);

				await this.require(this.#tokenTypeList.CYCLEEND);

				return new BSLCycleNode(tokenCycle, expression, to, code);
			}
		}

		let breakToken = this.match(this.#tokenTypeList.BREAK);
		
		if(breakToken !== null){
			return new (require("./AST/breakContinueNode").BSLBreakNode)(breakToken);
		}

		let continueToken = this.match(this.#tokenTypeList.CONTINUE);
		
		if(continueToken !== null){
			return new (require("./AST/breakContinueNode").BSLContinueNode)(continueToken);
		}

		if(this.match(this.#tokenTypeList.CALLFUNC) != null){
			this.#pos--;
			return await this.parseCallFunc();
		}

		let undefinedNullToken = this.match(this.#tokenTypeList.UNDEFINED, this.#tokenTypeList.NULL);
		if(undefinedNullToken !== null){
			switch(undefinedNullToken.type){
				case this.#tokenTypeList.UNDEFINED:
					return new (require("./AST/undefinedNullNode").BSLUndefinedNode)(undefinedNullToken);

				case this.#tokenTypeList.NULL:
					return new (require("./AST/undefinedNullNode").BSLNullNode)(undefinedNullToken);
			}
		}

		let raise = this.match(this.#tokenTypeList.RAISE);
		if(raise !== null){
			if(this.match(this.#tokenTypeList.LPAR) !== null){
				this.#pos--;
				return this.parseCallFunc();
			}

			let string = this.match(this.#tokenTypeList.STRING),
				operands = [];
			if(string !== null){
				this.#pos--;
				operands.push(await this.parseBaseType());
			}

			return new BSLUnarOperatorNode(raise, ...operands);
		}

		let tryToken = this.match(this.#tokenTypeList.TRY);
		if(tryToken !== null){
			let endTry = this.searchEndBlock(-1, [this.#tokenTypeList.ENDTRY, this.#tokenTypeList.EXCEPT], [this.#tokenTypeList.TRY]);
			// let endTry = this.search(-1, this.#tokenTypeList.ENDTRY, this.#tokenTypeList.EXCEPT);

			if(endTry === null){
				await this.$throwError(this.tokens[this.#pos], `Ожидается ключевое слово 'КонецПопытки'`);
			}

			let code = await this.parseCode(endTry);

			let except = this.match(this.#tokenTypeList.EXCEPT);
			if(except !== null){
				let endExcept = this.searchEndBlock(-1, [this.#tokenTypeList.ENDTRY], [this.#tokenTypeList.TRY]);
				// let endExcept = this.search(-1, this.#tokenTypeList.ENDTRY);

				if(endExcept === null){
					await this.$throwError(this.tokens[this.#pos], `Ожидается ключевое слово 'КонецПопытки'`);
				}

				let codeExcept = await this.parseCode(endExcept);

				await this.require(this.#tokenTypeList.ENDTRY);
				return new (require("./AST/tryExcept").BSLTryNode)(tryToken, code, codeExcept);
			}

			await this.require(this.#tokenTypeList.ENDTRY);
			return new (require("./AST/tryExcept").BSLTryNode)(tryToken, code);
		}

		let variable = await this.require(this.#tokenTypeList.VARIABLE),
			LBIDX = this.match(this.#tokenTypeList.LBIDX);

		if(LBIDX !== null){
			let resultNode;

			resultNode = new BSLIndexNode(new BSLVariableNode(variable), await this.parseExpressionOrFormula(true));

			await this.require(this.#tokenTypeList.RBIDX);
			return resultNode;
		}else{
			return new BSLVariableNode(variable);
		}
	}

	async parseObjectMethodProp(objectNode){
		const {BSLIndexNode} = require("./AST/indexNode");

		let objectMethod = await this.parseCallFunc("OBJECTMETHOD");
		if(objectMethod){
			objectNode = new BSLObjectContextNode(objectNode, objectMethod);

			let LBIDX = this.match(this.#tokenTypeList.LBIDX);
			if(LBIDX !== null){
				objectNode = new BSLIndexNode(objectNode, await this.parseExpressionOrFormula(true));
	
				await this.require(this.#tokenTypeList.RBIDX);
			}
		}

		let objectProp = await this.match(this.#tokenTypeList.OBJECTPROP);
		if(objectProp !== null){
			if(await this.match(this.#tokenTypeList.ASSIGN) !== null){
				let binOperator = await this.parseFormula();
				objectNode = new (require("./AST/objectNode").BSLObjectAssignPropNode)(binOperator, objectNode, objectProp);
			}else{
				objectNode = new BSLObjectContextNode(objectNode, objectProp);

				let LBIDX = this.match(this.#tokenTypeList.LBIDX);
				if(LBIDX !== null){
					objectNode = new BSLIndexNode(objectNode, await this.parseExpressionOrFormula(true));
		
					await this.require(this.#tokenTypeList.RBIDX);
				}
			}
		}

		if(await this.match(this.#tokenTypeList.OBJECTMETHOD, this.#tokenTypeList.OBJECTPROP) !== null){
			this.#pos--;
			return await this.parseObjectMethodProp(objectNode);
		}

		return objectNode;
	}

	async parseFormula(isCond = false){
		let {BSLBinOperatorNode} = require("./AST/binOperatorNode");
		let matchConditionTokens = [this.#tokenTypeList.AND, this.#tokenTypeList.OR, this.#tokenTypeList.NOT, this.#tokenTypeList.NEQ, this.#tokenTypeList.LTEQ, this.#tokenTypeList.LT, this.#tokenTypeList.GTEQ, this.#tokenTypeList.GT, this.#tokenTypeList.ASSIGN],
			matchTokens = [this.#tokenTypeList.MINUS, this.#tokenTypeList.PLUS, this.#tokenTypeList.MULTIPLY, this.#tokenTypeList.DIV, this.#tokenTypeList.MOD, this.#tokenTypeList.PLUSASSIGN, this.#tokenTypeList.MINUSASSIGN],
			priority = [
				[this.#tokenTypeList.OR],
				[this.#tokenTypeList.AND],
				[this.#tokenTypeList.NOT],
				[this.#tokenTypeList.NEQ, this.#tokenTypeList.LTEQ, this.#tokenTypeList.LT, this.#tokenTypeList.GTEQ, this.#tokenTypeList.GT, this.#tokenTypeList.ASSIGN],
				[this.#tokenTypeList.MINUS, this.#tokenTypeList.PLUS],
				[this.#tokenTypeList.MULTIPLY, this.#tokenTypeList.DIV, this.#tokenTypeList.MOD],
				[this.#tokenTypeList.PLUSASSIGN, this.#tokenTypeList.MINUSASSIGN]
			],
			operator,
			leftNode;

		// if(isCond)
		// 	operator = this.match(...matchConditionTokens);
		// else	
			operator = this.match(...matchTokens, ...matchConditionTokens);

		if(!isCond && operator !== null && matchConditionTokens.indexOf(operator.type) >= 0){
			isCond = true;
		}

		if(operator === null || operator.type !== this.#tokenTypeList.NOT){
			leftNode = await this.parseParentheses();

			// if(isCond)
			// 	operator = this.match(...matchConditionTokens);
			// else	
				operator = this.match(...matchTokens, ...matchConditionTokens);
		}

		while(operator !== null){
			let nextOperator,
				rightNode;

			nextOperator = this.searchToken(-1, ...matchTokens, ...matchConditionTokens);

			if(nextOperator !== null){
				let nextOperatorPriority = priority.findIndex(item => item.indexOf(nextOperator.type) != -1),
					operatorPriority = priority.findIndex(item => item.indexOf(operator.type) != -1);

				if(nextOperatorPriority < operatorPriority){
					rightNode = await this.parseParentheses();
				}else{
					rightNode = await this.parseFormula(isCond);
				}
			}else{
				rightNode = await this.parseParentheses();
			}

			
			leftNode = new BSLBinOperatorNode(operator, leftNode, rightNode, isCond);

			// if(isCond)
			// 	operator = this.match(...matchConditionTokens);
			// else	
				operator = this.match(...matchTokens, ...matchConditionTokens);
		}

		return leftNode;
	}

	async parseParentheses(){
		if(this.match(this.#tokenTypeList.LPAR) !== null){
			let node = await this.parseFormula();
			await this.require(this.#tokenTypeList.RPAR);
			return node;
		}

		return await this.parseBaseType();
		
	}

	async parseExpressionOrFormula(isCond = false){
		let formulaNode = await this.parseFormula(isCond);
		if(formulaNode){
			return formulaNode;
		}

		let expressionNode = await this.parseExpression(isCond);
		if(expressionNode){
			return expressionNode;
		}
	}

	async parseCallFunc(tokenType = "CALLFUNC"){
		let operatorFunc = this.match(this.#tokenTypeList[tokenType], this.#tokenTypeList.HELP),
			operands = [];

		if(operatorFunc !== null){
			await this.match(this.#tokenTypeList.LPAR);

			let hasRPAR = this.match(this.#tokenTypeList.RPAR);

			if(hasRPAR === null){
				let hasArgsSeparator = this.match(this.#tokenTypeList.ARGSEPARATOR);
				if(hasArgsSeparator !== null){
					operands.push(new (require("./AST/rawNode").BSLRawNode)(undefined));
				}else{
					operands.push(await this.parseExpressionOrFormula(true));
					hasArgsSeparator = this.match(this.#tokenTypeList.ARGSEPARATOR);
				}

				while(hasArgsSeparator !== null){
					operands.push(await this.parseExpressionOrFormula(true));
					hasArgsSeparator = this.match(this.#tokenTypeList.ARGSEPARATOR)
				}

				await this.match(this.#tokenTypeList.RPAR);
			}

			let result = new BSLUnarOperatorNode(operatorFunc, ...operands);

			let objectContext = this.match(this.#tokenTypeList.OBJECTCONTEXT);
			if(objectContext !== null){
				let objectMethod = await this.parseCallFunc();
				if(objectMethod !== null){
					return new BSLObjectContextNode(result, objectMethod);
				}

				let objectProp = await this.require(this.#tokenTypeList.VARIABLE);
				if(objectProp !== null){
					return new BSLObjectContextNode(result, objectProp);
				}
			}

			return result;
		}

		let operatorProp = await this.match(this.#tokenTypeList.VARIABLE);
		if(operatorProp !== null)
			return new BSLUnarOperatorNode(operatorProp);
	}

	async parseCondition(tokenIf){
		let condition = new BSLConditionExpressionNode(await this.parseFormula(true));

		await this.require(this.#tokenTypeList.IFSTART);
		let elseEndTokenPos = this.searchEndBlock(-1, [this.#tokenTypeList.ELSE, this.#tokenTypeList.ELSEIF, this.#tokenTypeList.IFEND], [this.#tokenTypeList.IFSTART]);
		
		if(elseEndTokenPos === null){
			await this.$throwError(this.tokens[this.#pos], `Ожидается ключевое слово 'КонецЕсли'`);
		}

		let trueCondition = await this.parseCode(elseEndTokenPos);

		if(this.match(this.#tokenTypeList.ELSEIF)){
			let falseCondition = await this.parseCondition(tokenIf);

			this.match(this.#tokenTypeList.IFEND);

			return new BSLConditionNode(tokenIf, condition, trueCondition, falseCondition);
		}

		if(this.match(this.#tokenTypeList.ELSE)){
			let endTokenPos = await this.searchEndBlock(-1, [this.#tokenTypeList.IFEND], [this.#tokenTypeList.IFSTART]);
			// let endTokenPos = this.search(-1, this.#tokenTypeList.ELSE, this.#tokenTypeList.IFEND);
			if(endTokenPos === null){
				await this.$throwError(this.tokens[this.#pos], `Ожидается ключевое слово 'КонецЕсли'`);
			}
			let falseCondition = await this.parseCode(endTokenPos);

			await this.require(this.#tokenTypeList.IFEND);

			return new BSLConditionNode(tokenIf, condition, trueCondition, falseCondition);
		}

		await this.require(this.#tokenTypeList.IFEND);

		return new BSLConditionNode(tokenIf, condition, trueCondition);
	}

	async parseConditionParentheses(){
		if(this.match(this.#tokenTypeList.LPAR) !== null){
			let node = await this.parseFormula(isCond);
			await this.require(this.#tokenTypeList.RPAR);
			return node;
		}else{
			return await this.parseExpression(true);
		}
	}

	async parseFuncProc(){
		let isAsync = await this.match(this.#tokenTypeList.ASYNC),
			tokenProcFunc = await this.match(this.#tokenTypeList.FUNC, this.#tokenTypeList.PROC),
			funcName = await this.require(this.#tokenTypeList.CALLFUNC),
			operands = [],
			{BSLFunctionArgument, BSLFunctionNode} = require("./AST/functionNode");

		await this.require(this.#tokenTypeList.LPAR);

		let hasRPAR = await this.match(this.#tokenTypeList.RPAR);

		if(hasRPAR === null){
			operands.push(new BSLFunctionArgument(...await this.parseFuncArgs()));

			let hasArgsSeparator = await this.match(this.#tokenTypeList.ARGSEPARATOR);
			while(hasArgsSeparator !== null){
				operands.push(new BSLFunctionArgument(...await this.parseFuncArgs()));
				hasArgsSeparator = await this.match(this.#tokenTypeList.ARGSEPARATOR)
			}

			await this.require(this.#tokenTypeList.RPAR);
		}

		let isExport = await this.match(this.#tokenTypeList.EXPORT) !== null,
			endFuncProc = await this.search(-1, this.#tokenTypeList.ENDPROC, this.#tokenTypeList.ENDFUNC);
		
		if(tokenProcFunc.type === this.#tokenTypeList.FUNC)
			this.#funcContext = true;
		else if(tokenProcFunc.type === this.#tokenTypeList.PROC)
			this.#procContext = true;
		
		let code = await this.parseCode(endFuncProc);
		this.#funcContext = false;
		this.#procContext = false;

		await this.require(this.#tokenTypeList.ENDFUNC, this.#tokenTypeList.ENDPROC);

		return new BSLFunctionNode(funcName, operands, code, isExport, tokenProcFunc.type === this.#tokenTypeList.PROC, this.filename, isAsync !== null);
	}

	async parseFuncArgs(){
		let valarg = (await this.match(this.#tokenTypeList.VALARG) !== null),
			arg = await this.require(this.#tokenTypeList.VARIABLE),
			hasAssign = await this.match(this.#tokenTypeList.ASSIGN),
			def = undefined;

		if(hasAssign !== null){
			def = await this.parseBaseType();
		}

		return [arg, def, valarg];
	}
}