const { default: BigNumber } = require("bignumber.js");
const {BSLGlobalContext, BSLGlobalContextObjects, BSLGlobalContextObjectsInternal} = require("./globalContext");

exports.BSLRunner = class extends require("./helper").BSLHelper{
	$type;

	$stack = [];
	$functions = {};
	$BSLObject;

	$isBreak = false;
	$isContinue = false;
	$isExcept = false;

	$tryNode = undefined;
	$exception = undefined;

	$helpFn = async() => {
		console.log(`Описывает модуль подключенного файла`.replace(/\n[\s]+\|/g, "\n"));

		return;
	};

	constructor(BSLObject){
		super();
		this.$type = require("./globalContext/objects/type").BSLAvailableTypes.МодульВстроенногоЯзыка;
		this.$BSLObject = BSLObject;
	}

	addStackInfo(funcName, code, variables = undefined){
		if(variables === undefined) variables = {};
		this.$stack.push({
			variables: variables,
			name: funcName,
			code: code,
			filename: this.filename
		});
	}

	setVariable(variable, value, stackOffset = 0){
		let currentStack = this.$stack[this.$stack.length - (stackOffset + 1)],
			varName;

		if(variable instanceof require("./AST/variableNode").BSLVariableNode){
			varName = variable.variable.text;
		}else{
			varName = variable;
		}

		varName = varName.toLowerCase();

		currentStack.variables[varName] = value;
	}

	getVariable(variable, stackOffset = 0){
		let currentStack = this.$stack[this.$stack.length - (stackOffset + 1)],
			varName;

		if(variable instanceof require("./AST/variableNode").BSLVariableNode){
			varName = variable.variable.text;
		}else{
			varName = variable;
		}

		varName = varName.toLowerCase();

		return currentStack.variables[varName];
	}

	async runFunction(functionNode, node, asFunc = false){
		let operands = [];

		for(let operandNode of node.operands){
			operands.push(await this.run(operandNode, true));
		}

		if(this.$isExcept) return;

		if(asFunc === true && functionNode.isProcedure === true){
			await this.$throwError(node, `Обращение к процедуре как к функции (${node.operator.text})`);
		}

		let variables = {};

		if(operands.length > functionNode.arguments.length){
			await this.$throwError(node, `Слишком много фактических параметров`);
		}

		for(let i=0; i < functionNode.arguments.length; i++){
			let varNode = functionNode.arguments[i];
			if(operands.length > i){
				variables[varNode.argName.text.toLowerCase()] = operands[i];
			}else
			if(varNode.def != undefined){
				variables[varNode.argName.text.toLowerCase()] = await this.run(varNode.def);
			}else{
				await this.$throwError(node, `Недостаточно фактических параметров (${node.operator.text})`);
			}
		}

		if(this.$stack.length > 1000){
			await this.$throwError(node, `Переполнение стека встроенного языка`);	
		}

		this.addStackInfo(functionNode.functionName.text, this.$getCodeByLineNo(node.lineNo), variables);

		let result;
		// if(functionNode.isAsync){
		// 	result = this.run(functionNode.code);
		// }else{
			result = await this.run(functionNode.code);
		// }

		this.$isBreak = false;

		for(let i=0; i < functionNode.arguments.length; i++){
			let varNode = functionNode.arguments[i];
			if(varNode.valueOnly === false && node.operands.length > i && node.operands[i] instanceof require("./AST/variableNode").BSLVariableNode){
				this.setVariable(node.operands[i], this.getVariable(varNode.argName.text.toLowerCase()), 1);
			}
		}

		this.$stack.pop();

		return result;
	}

	async run(node, asFunc = false){
		let { BSLNumber } = require("./globalContext/objects/number"),
			{BSLString} = require("./globalContext/objects/string");
		BSLNumber.config({
			EXPONENTIAL_AT: 1000000000,
			DECIMAL_PLACES: 50,
			FORMAT: {
				decimalSeparator: '.',
				groupSeparator: `\xa0`,
				groupSize: 3,
			}
		});

		if(this.$stack.length == 0){
			this.addStackInfo("Неизвестный модуль", "", {
				"этотобъект": this
			});
		}

		// ОБРАБОТЧИКИ НОД

		if(node instanceof require("./AST/numberNode").BSLNumberNode){
			return new BSLNumber(node.number.text);
		}else

		if(node instanceof require("./AST/stringNode").BSLStringNode){
			let resultString = "";
			for(let string of node.strings){
				resultString += (resultString === "" ? "" : `"`) + string.text.replace(/^"([^"]*)"$/, "$1").replace(/(\n[\s]*\|)+/, "\n");
			}
			return new BSLString(resultString);
		}else

		if(node instanceof require("./AST/boolNode").BSLBoolNode){
			return node.value;
		}else

		if(node instanceof require("./AST/unarOperator").BSLUnarOperatorNode){
			if(node.operator.type === require("./tokenTypes").tokenTypeList.HELP){
				if(node.operands[0] instanceof require("./AST/stringNode").BSLStringNode){
					let result = await this.run(node.operands[0]);

					let findedArr = [],
						globalContexts = [BSLGlobalContext, BSLGlobalContextObjects, BSLGlobalContextObjectsInternal];

					Object.keys(Object.assign({}, ...globalContexts)).forEach((val) => {
						if(val.match(new RegExp(`${result}`, "iu")) !== null){
							findedArr.push(val);
						}
					});

					if(findedArr.length > 0){
						let findRes = findedArr.indexOf(result.valueOf());

						if(findRes != -1){
							let finded = findedArr[findRes];
							console.log(finded);
							for(let globalContextObj of globalContexts){
								globalContextObj.$BSLRunner = this;
								globalContextObj.$node = node;

								let propName = Object.keys(globalContextObj).find(elem => elem.toLowerCase() == finded.toLowerCase());

								if(propName){
									if(typeof(globalContextObj[propName].$help) == "function"){
										this.$help = true;
										await globalContextObj[propName].$help(globalContextObj);
										this.$help = false;
										return;
									}else{
										try{
											this.$help = true;
											await globalContextObj[propName](globalContextObj);
										}catch(e){}finally{
											this.$help = false;
										}
									}
								}
							}
						}else{
							for(let finded of findedArr){
								console.log(finded);
							}
						}
					}
				}else
				if(node.operands[0] instanceof require("./AST/variableNode").BSLVariableNode){
					let variable = await this.run(node.operands[0]);

					BSLGlobalContext.$BSLRunner = this;
					BSLGlobalContext.$node = node;

					if(variable instanceof exports.BSLRunner){
						await variable.$helpFn();
					}else if(typeof(variable.$help) == "function"){
						this.$help = true;
						await variable.$help(BSLGlobalContext);
						this.$help = false;
						return;
					}else{
						try{
							this.$help = true;
							await variable(BSLGlobalContext);
						}catch(e){}finally{
							this.$help = false;
						}
					}
				}else{
					this.$help = true;
					await this.run(node.operands[0]);
					this.$help = false;
				}
				
				return;
			}

			let propName = Object.keys(BSLGlobalContext).find(elem => elem.toLowerCase() == node.operator.text.toLowerCase());

			BSLGlobalContext.$BSLRunner = this;
			BSLGlobalContext.$node = node;

			if(propName !== undefined){

				let operands = [],
					result;

				for(let operandNode of node.operands){
					operands.push(await this.run(operandNode, true));
				}

				if(this.$isExcept) return;

				if(this.$help && typeof(BSLGlobalContext[propName].$help) == "function"){
					console.log(propName);
					await BSLGlobalContext[propName].$help(BSLGlobalContext);
					return;
				}
				
				result = await BSLGlobalContext[propName](BSLGlobalContext, ...operands);

				if(asFunc === true && result === undefined){
					await this.$throwError(node, `Обращение к процедуре как к функции (${node.operator.text})`);
				}

				return result;
			}else{
				propName = Object.keys(this.$functions).find(elem => elem.toLowerCase() == node.operator.text.toLowerCase());
				if(propName !== undefined){
					return await this.runFunction(this.$functions[propName], node, asFunc);
				}else
				if(this.$help){
					let propName = Object.keys(BSLGlobalContextObjects).find(elem => elem.toLowerCase() == node.operator.text.toLowerCase());

					if(propName !== undefined && typeof(BSLGlobalContextObjects[propName].$help) == "function"){
						console.log(propName);
						await BSLGlobalContextObjects[propName].$help(BSLGlobalContext);
					}else{
						let propName = Object.keys(BSLGlobalContextObjectsInternal).find(elem => elem.toLowerCase() == node.operator.text.toLowerCase());
						if(propName !== undefined && typeof(BSLGlobalContextObjectsInternal[propName].$help) == "function"){
							BSLGlobalContextObjectsInternal.$BSLRunner = this;
							BSLGlobalContextObjectsInternal.$node = node;

							console.log(propName);
							await BSLGlobalContextObjectsInternal[propName].$help(BSLGlobalContextObjectsInternal);
						}
					}
				}else{
					await this.$throwError(node, `Процедура или функция с указанным именем не определена (${node.operator.text})`);
				}
			}
		}else

		if(node instanceof require("./AST/binOperatorNode").BSLBinOperatorNode){
			let result = undefined,
				leftVal,
				rightVal,
				{tokenTypeList} = require("./tokenTypes"),
				{BSLBool} = require("./globalContext/objects/bool"),
				{ BSLVariableNode } = require("./AST/variableNode"),
				fnPlus = (leftVal, rightVal) => {
					let result;

					if(Object.getPrototypeOf(leftVal).hasOwnProperty("__add__")){
						result = leftVal.__add__(rightVal);
					}else
					if(leftVal instanceof BSLNumber){
						result = leftVal.plus(rightVal);
					}else
					if(leftVal instanceof BSLString){
						if(rightVal === undefined){
							return;
						}else
						if(rightVal instanceof BSLNumber){
							rightVal = rightVal.toFormat();
						}else
						if(typeof(rightVal) === "number"){
							rightVal = (new BSLNumber(rightVal)).toFormat();
						}else
						{
							rightVal = rightVal.toString();
						}

						result = leftVal + rightVal;
					}else{
						result = leftVal + rightVal;
					}

					if(result instanceof BigNumber) result = new BSLNumber(result);

					return result;
				},
				fnMinus = (leftVal, rightVal) => {
					let result;

					if(Object.getPrototypeOf(leftVal).hasOwnProperty("__sub__")){
						result = leftVal.__sub__(rightVal);
					}else
					if(leftVal instanceof BSLNumber){
						result = leftVal.minus(rightVal);
					}else{
						result = leftVal - rightVal;
					}

					if(result instanceof BigNumber) result = new BSLNumber(result);

					return result;
				};

			switch (node.operator.type){
				case tokenTypeList.PLUS:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);
					
					result = fnPlus(leftVal, rightVal);
					break;

				case tokenTypeList.MINUS:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);
					
					result = fnMinus(leftVal, rightVal);
					break;

				case tokenTypeList.MULTIPLY:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						result = leftVal.multipliedBy(rightVal);
					}else{
						result = leftVal * rightVal;
					}
					break;

				case tokenTypeList.DIV:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						result = leftVal.div(rightVal);
					}else{
						result = leftVal / rightVal;
					}
					break;

				case tokenTypeList.MOD:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						result = leftVal.mod(rightVal);
					}else{
						result = leftVal % rightVal;
					}
					break;

				case tokenTypeList.ASSIGN:
					if(!node.isCondition && node.leftNode instanceof BSLVariableNode){
						result = await this.run(node.rightNode, true);

						this.setVariable(node.leftNode, result);
					}else{
						let leftVal = await this.run(node.leftNode, true);
						let rightVal = await this.run(node.rightNode, true);
						return new BSLBool(leftVal.valueOf() == rightVal.valueOf());
					}
					break;

				case tokenTypeList.NEQ:
					if(node.leftNode instanceof BSLVariableNode)
						leftVal = this.getVariable(node.leftNode);
					else
						leftVal = await this.run(node.leftNode);
					
					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						return new BSLBool(!leftVal.isEqualTo(rightVal));
					}else{
						return new BSLBool(leftVal.valueOf() != rightVal.valueOf());
					}

				case tokenTypeList.LTEQ:
					if(node.leftNode instanceof BSLVariableNode)
						leftVal = this.getVariable(node.leftNode);
					else
						leftVal = await this.run(node.leftNode);
					
					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						return new BSLBool(leftVal.isLessThanOrEqualTo(rightVal));
					}else{
						return new BSLBool(leftVal.valueOf() <= rightVal.valueOf());
					}

				case tokenTypeList.LT:
					if(node.leftNode instanceof BSLVariableNode)
						leftVal = this.getVariable(node.leftNode);
					else
						leftVal = await this.run(node.leftNode);
					
					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						return new BSLBool(leftVal.isLessThan(rightVal));
					}else{
						return new BSLBool(leftVal.valueOf() < rightVal.valueOf());
					}

				case tokenTypeList.GTEQ:
					if(node.leftNode instanceof BSLVariableNode)
						leftVal = this.getVariable(node.leftNode);
					else
						leftVal = await this.run(node.leftNode);

					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						return new BSLBool(leftVal.isGreaterThanOrEqualTo(rightVal));
					}else{
						return new BSLBool(leftVal.valueOf() >= rightVal.valueOf());
					}

				case tokenTypeList.GT:
					if(node.leftNode instanceof BSLVariableNode)
						leftVal = this.getVariable(node.leftNode);
					else
						leftVal = await this.run(node.leftNode);

					rightVal = await this.run(node.rightNode, true);

					if(leftVal instanceof BSLNumber){
						return new BSLBool(leftVal.isGreaterThan(rightVal));
					}else{
						return new BSLBool(leftVal.valueOf() > rightVal.valueOf());
					}

				case tokenTypeList.AND:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);
					return new BSLBool(leftVal.valueOf() && rightVal.valueOf());

				case tokenTypeList.OR:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);
					return new BSLBool(leftVal.valueOf() || rightVal.valueOf());

				case tokenTypeList.NOT:
					leftVal = await this.run(node.leftNode, true);

					return new BSLBool(!leftVal.valueOf());

				case tokenTypeList.PLUSASSIGN:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);

					result = fnPlus(leftVal, rightVal);

					this.setVariable(node.leftNode, result);
					break;
				
				case tokenTypeList.MINUSASSIGN:
					leftVal = await this.run(node.leftNode, true);
					rightVal = await this.run(node.rightNode, true);

					result = fnMinus(leftVal, rightVal);

					this.setVariable(node.leftNode, result);
					break;

				case tokenTypeList.PLUSONE:
					leftVal = await this.run(node.leftNode, true);

					result = fnPlus(leftVal, new BSLNumber(1));
					this.setVariable(node.leftNode, result);
					break;

				case tokenTypeList.MINUSONE:
					leftVal = await this.run(node.leftNode, true);

					result = fnMinus(leftVal, new BSLNumber(1));
					this.setVariable(node.leftNode, result);
					break;
				
			}

			if(result instanceof require("bignumber.js").default) result = new BSLNumber(result);

			return result;
		}else

		if(node instanceof require("./AST/variableNode").BSLVariableNode){
			let result = this.getVariable(node);
			if(result !== undefined){
				return result;
			}else{
				await this.$throwError(node, `Переменная не определена (${node.text})`);
			}
		}else

		if(node instanceof require("./AST/statementsNode").BSLStatementsNode){
			let result;
			for(let codeString of node.codeStrings){
				if(codeString instanceof require("./AST/breakContinueNode").BSLBreakNode){
					this.$isBreak = true;
					return;
				}

				if(codeString instanceof require("./AST/breakContinueNode").BSLContinueNode){
					this.$isContinue = true;
					return;
				}

				result = await this.run(codeString);

				if(this.$isExcept === true){
					this.$isExcept = false;
					return;
				}

				if(this.$isBreak === true){
					return result;
				}

				if(this.$isContinue === true){
					return;
				}
			}
		}else

		if(node instanceof require("./AST/newObjectNode").BSLNewObjectNode){
			let unarOperator = node.object,
				propName = Object.keys(BSLGlobalContextObjects).find(elem => elem.toLowerCase() == unarOperator.operator.text.toLowerCase());
			
			BSLGlobalContextObjects.$BSLRunner = this;
			BSLGlobalContextObjects.$node = node;

			if(propName){
				let operands = [];

				for(let operandNode of unarOperator.operands){
					operands.push(await this.run(operandNode, true));
				}

				if(this.$help && typeof(BSLGlobalContextObjects[propName].$help) == "function"){
					console.log(propName);
					return BSLGlobalContextObjects[propName].$help(BSLGlobalContextObjects);
				}else{
					return new BSLGlobalContextObjects[propName](BSLGlobalContextObjects, ...operands);
				}
			}else{
				await this.$throwError(node, `Конструктор не найден (${unarOperator.text})`);
			}
		}else

		if(node instanceof require("./AST/objectNode").BSLObjectNode){
			let propName = Object.keys(BSLGlobalContext).find(elem => elem.toLowerCase() == node.object.text.toLowerCase())
			if(propName){
				return BSLGlobalContext[propName];
			}else
			if(this.getVariable(node.object.text) !== undefined){
				return this.getVariable(node.object.text);
			}else{
				await this.$throwError(node, `Переменная не определена (${node.text})`);
			}
		}else

		if(node instanceof require("./AST/objectNode").BSLObjectContextNode){
			let object = await this.run(node.objectNode),
				{tokenTypeList} = require("./tokenTypes");

			if(this.$isExcept) return;

			if(object instanceof exports.BSLRunner){
				let text = node.operator.operator.text;

				if(text.toLowerCase() == "valueof") text = `_${text}`;

				let propName = object.getVariable(text.toLowerCase()),
					methodName = Object.keys(object.$functions).find(elem => elem.toLowerCase() == text.toLowerCase() && (object.$functions[elem].isExport || object === this));

				if(!propName && object.$getProperty !== undefined){
					propName = object.$getProperty(node.operator.operator.text);
				}
				
				if(propName && node.operator.operator.type == tokenTypeList.OBJECTPROP){
					return propName;
				}else
				if(methodName && node.operator.operator.type == tokenTypeList.OBJECTMETHOD){
					return await this.runFunction(object.$functions[methodName], node.operator, asFunc);
				}else{
					await this.$throwError(node, `Поле объекта не обнаружено (${node.operator.operator.text})`);
				}
			}

			if(object.$getIndex !== undefined){
				let index = node.operator.text;
				if(index.toLowerCase() == "valueof") index = `_${index}`;

				let result = object.$getIndex(index);

				if(result) return result;
			}

			let text = node.operator.text;

			if(text.toLowerCase() == "valueof") text = `_${text}`;

			let propName = Object.keys(object).find(elem => elem.toLowerCase() == text.toLowerCase()),
				methodName = Object.getOwnPropertyNames(Object.getPrototypeOf(object)).find(elem => elem.toLowerCase() == text.toLowerCase());

			BSLGlobalContext.$BSLRunner = this;
			BSLGlobalContext.$node = node;

			let operatorType = node.operator;
			while(!(operatorType instanceof require("./token").BSLToken)){
				operatorType = operatorType.operator;
			}

			if(propName && operatorType.type == tokenTypeList.OBJECTPROP){
				return object[propName];
			}else
			if(methodName && operatorType.type == tokenTypeList.OBJECTMETHOD){
				let operands = [];

				let operatorUnar = node.operator;
				while(!(operatorUnar instanceof require("./AST/unarOperator").BSLUnarOperatorNode)){
					operatorUnar = operatorUnar.operator;
				}

				for(let operandNode of operatorUnar.operands){
					operands.push(await this.run(operandNode, true));
				}

				if(this.$isExcept) return;

				return await object[methodName](BSLGlobalContext, ...operands);
			}else
			if(!propName && object.$getProperty !== undefined){
				return object.$getProperty(node.operator.text);
			}else{
				await this.$throwError(node, `Поле объекта не обнаружено (${node.text})`);
			}
			
		}else

		if(node instanceof require("./AST/objectNode").BSLObjectAssignPropNode){
			let object = await this.run(node.objectNode);
			let propName = Object.keys(object).find(elem => elem.toLowerCase() == node.objectProp.text.toLowerCase());

			if(!propName && object.$setProperty !== undefined){
				BSLGlobalContext.$BSLRunner = this;
				BSLGlobalContext.$node = node;

				let result = await this.run(node.operator);
				return await object.$setProperty(BSLGlobalContext, node.objectProp.text, result);
			}

			object[propName] = result;
		}else

		if(node instanceof require("./AST/indexNode").BSLIndexNode){
			const { BSLUndefined } = require("./globalContext/objects/undefinedNull");
			
			let object = await this.run(node.operator),
				hasGetIndex = Object.getOwnPropertyNames(Object.getPrototypeOf(object)).find(elem => elem == "$getIndex")

			if(hasGetIndex){
				let result = object.$getIndex(await this.run(node.index));

				if(result === undefined)
					result = new BSLUndefined;

				return result;
			}else{
				await this.$throwError(node, `Получение элемента по индексу для значения не определено`);
			}
		}else

		if(node instanceof require("./AST/conditionNode").BSLConditionNode){
			let conditionResult = await this.run(node.condition, true);
			if(conditionResult.valueOf()){
				await this.run(node.trueNode);
			}else{
				if(node.falseNode){
					await this.run(node.falseNode);
				}
			}
		}else

		if(node instanceof require("./AST/conditionNode").BSLConditionExpressionNode){
			return await this.run(node.expression, true);
		}else

		if(node instanceof require("./AST/cycleNode").BSLCycleNode){
			let {tokenTypeList} = require("./tokenTypes");

			switch(node.cycle.type){
				case tokenTypeList.WHILE:
					while((await this.run(node.expression, true)).valueOf()){
						await this.run(node.code);

						if(this.$isBreak === true){
							this.$isBreak = false;
							break;
						}
		
						if(this.$isContinue === true){
							this.$isContinue = false;
							continue;
						}
					}
					break;

				case tokenTypeList.FOREACH:
					let collection = await this.run(node.to, true);
					
					if(typeof(collection[Symbol.iterator]) !== 'function')
						this.$throwError(node, `Итератор для значения не определен`);

					for(let value of collection){
						this.setVariable(node.expression, value);
						await this.run(node.code);

						if(this.$isBreak === true){
							this.$isBreak = false;
							break;
						}
		
						if(this.$isContinue === true){
							this.$isContinue = false;
							continue;
						}
					}
					break;

				case tokenTypeList.FOR:
					let varNode = node.expression.leftNode,
						startIdx = await this.run(node.expression.rightNode, true),
						endIdx = await this.run(node.to, true),
						isDown = node.isDown;
					
					for(let i=startIdx; (isDown ? i>=endIdx : i<=endIdx); (isDown ? i-- : i++)){
						this.setVariable(varNode, new BSLNumber(i));
						await this.run(node.code);

						if(this.$isBreak === true){
							this.$isBreak = false;
							break;
						}
		
						if(this.$isContinue === true){
							this.$isContinue = false;
							continue;
						}
					}
					break;
			}
		}else

		if(node instanceof require("./AST/breakContinueNode").BSLExceptNode){
			this.$isExcept = true;
			return;
		}else

		if(node instanceof require("./AST/tryExcept").BSLTryNode){
			this.$tryNode = node;
			await this.run(node.tryBlock);
		}else

		if(node instanceof require("./AST/rawNode").BSLRawNode){
			return node.rawValue;
		}else

		if(node instanceof require("./AST/rawNode").BSLEvalFuncNode){
			return node.evalFunc(this);
		}else

		if(node instanceof require("./AST/undefinedNullNode").BSLUndefinedNode){
			return require("./globalContext/objects/undefinedNull").BSLUndefined;
		}else

		if(node instanceof require("./AST/undefinedNullNode").BSLNullNode){
			return require("./globalContext/objects/undefinedNull").BSLNull;
		}else

		if(node instanceof require("./AST/breakContinueNode").BSLBreakNode){
			this.$isBreak = true;
		}else

		if(node instanceof require("./AST/functionNode").BSLFunctionNode){
			if(this.$functions[node.functionName.text] !== undefined){
				await this.$throwError(node, `Процедура или функция с указанным именем уже определена (${node.functionName.text})`);
			}

			this.$functions[node.functionName.text] = node;
		}else

		if(node instanceof require("./AST/functionNode").BSLReturnNode){
			let result = await this.run(node.operand);

			this.$isBreak = true;
			return result;
		}else

		// Это конечно не нода но нужно для выполнения описаний оповещений
		if(node instanceof require("./globalContext/objects/callbackDescription").BSLCallbackDescription){
			let propName = Object.keys(node.Модуль.$functions).find(elem => elem.toLowerCase() == node.ИмяПроцедуры.toLowerCase() && (node.Модуль.$functions[elem].isExport || node.Модуль === this));
			if(propName !== undefined){
				let funcNode = node.Модуль.$functions[propName],
					operands = [];

				for(let operand of node.$operands){
					operands.push(operand);
				}

				operands.push(node.ДополнительныеПараметры);

				if(asFunc === true && funcNode.isProcedure === true){
					await this.$throwError(node, `Обращение к процедуре как к функции (${node.ИмяПроцедуры})`);
				}

				let variables = {};

				if(operands.length > funcNode.arguments.length){
					await this.$throwError(node, `Слишком много фактических параметров`);
				}

				for(let i=0; i < funcNode.arguments.length; i++){
					let varNode = funcNode.arguments[i];
					if(operands.length > i){
						variables[varNode.argName.text.toLowerCase()] = operands[i];
					}else
					if(varNode.def != undefined){
						variables[varNode.argName.text.toLowerCase()] = await this.run(varNode.def);
					}else{
						await this.$throwError(node, `Недостаточно фактических параметров (${node.ИмяПроцедуры})`);
					}
				}

				if(this.$stack.length > 1000){
					await this.$throwError(node, `Переполнение стека встроенного языка`);	
				}

				this.addStackInfo(funcNode.functionName.text, this.$getCodeByLineNo(node.lineNo), variables);

				let result = await this.run(funcNode.code);
				this.$isBreak = false;

				this.$stack.pop();

				for(let userMessage of this.$BSLObject.getUserMessages(true)){
					console.log(userMessage);
				}

				return result;
			}else{
				await this.$throwError(node, `Поле объекта не обнаружено (${node.ИмяПроцедуры})`);
			}
		}else

		{
			await this.$throwError(node, `Неизвестный оператор (${node.text})`);
		}
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}