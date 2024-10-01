const {BSLLexer} = require("./lexer")
	, {BSLParser} = require("./parser")
	, {BSLRunner} = require("./runner")
;

exports.BSL = class{
	userMessages = [];
	#lexer;
	#parser;
	#runner;

	constructor(){
		this.#lexer = new BSLLexer();
		this.#parser = new BSLParser();
		this.#runner = new BSLRunner(this); 
	}

	async run(source, filename = undefined){
		let AST,
			{ BSLCompiler } = require("./compile");

		if(source.substring(0, 4) !== "BBSL"){
			this.#lexer.code = source;
			this.#lexer.filename = filename;

			this.#parser.tokens = await this.#lexer.lexAnalysis();
			this.#lexer = null;
			
			this.#parser.filename = filename;
			this.#parser.code = source;
			AST = await this.#parser.startParse();
			this.#parser = null;

			if(process.argv.indexOf("-b") != -1){
				let compiler = new BSLCompiler(AST, filename, source);
				compiler.compile(process.argv.indexOf("-S") != -1);
				compiler.compress();
				compiler.save();
				console.log("Build successfully");
				process.exit();
			}

			this.#runner.code = source;
		}else{
			let compiler = new BSLCompiler(source);
			compiler.decompress();
			[source, AST] = compiler.decompile();

			if(source !== undefined)
				this.#runner.$code = source;
		}

		this.#runner.$filename = filename;
		try{
			await this.#runner.run(AST);
		}catch(e){
			await this.#runner.$throwError(this.#runner, "Неверный формат потока", undefined, NaN, e);
		}
	}

	async evalFormula(source){
		let lexer = new BSLLexer(source),
			tokens = await lexer.lexAnalysis(),
			parser = new BSLParser(tokens),
			AST = await parser.parseFormula(),
			runner = new BSLRunner(this);

		return await runner.run(AST);
	}

	async evalCode(source, filename = undefined){
		let lexer = new BSLLexer(source);

		if(filename != undefined){
			lexer.filename = filename;
		}

		let tokens = await lexer.lexAnalysis(),
			parser = new BSLParser(tokens);

		if(filename != undefined){
			parser.filename = filename;
		}

		let AST = await parser.startParse(),
			runner = new BSLRunner(this);

		if(filename != undefined){
			runner.filename = filename;
		}

		runner.variables = this.#runner.variables;

		await runner.run(AST);

		return runner;
	}

	*getUserMessages(clear = false){
		for(let message of this.userMessages){
			yield message;
		}

		if(clear)
			this.userMessages = [];
	}

	set userMessage(value){
		this.userMessages.push(value);
	}
}