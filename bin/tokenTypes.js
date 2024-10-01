exports.BSLTokenType = class BSLTokenType {
	name;
	regexp;

	constructor(name, regexp){
		this.name = name;
		this.regexp = regexp;
	}
}

exports.tokenTypeList = {
	"SEMICOLON": new exports.BSLTokenType("SEMICOLON", /^;/),
	"REGION": new exports.BSLTokenType("REGION", /^#(?:область|region)[^\n]*/iu),
	"ENDREGION": new exports.BSLTokenType("ENDREGION", /^#(?:конецобласти|endregion)[^\n]*/iu),

	"NUMBER": new exports.BSLTokenType("NUMBER", /^-?[0-9]+(?:\.[0-9]+)?/),
	"SPACE": new exports.BSLTokenType("SPACE", /^[\s]+/),
	"COMMENT": new exports.BSLTokenType("COMMENT", /^\/\/[^\n]+/),
	"STRING": new exports.BSLTokenType("STRING", /^"[^"]*"/iu),
	"TRUE": new exports.BSLTokenType("TRUE", /^(?:истина|true)/iu),
	"FALSE": new exports.BSLTokenType("FALSE", /^(?:ложь|false)/iu),

	"TRY": new exports.BSLTokenType("TRY", /^(?:попытка|try)/iu),
	"ENDTRY": new exports.BSLTokenType("ENDTRY", /^(?:конецпопытки|endtry)/iu),
	"EXCEPT": new exports.BSLTokenType("EXCEPT", /^(?:исключение|except)/iu),
	"RAISE": new exports.BSLTokenType("RAISE", /^(?:вызватьисключение|raise)/iu),

	"IF": new exports.BSLTokenType("IF", /^(?:если|if)(?=[\s])/iu),
	"IFSTART": new exports.BSLTokenType("IFSTART", /^(?:тогда|then)/iu),
	"ELSEIF": new exports.BSLTokenType("ELSEIF", /^(?:иначеесли|elseif)/iu),
	"ELSE": new exports.BSLTokenType("ELSE", /^(?:иначе|else)/iu),
	"IFEND": new exports.BSLTokenType("IFEND", /^(?:конецесли|endif)/iu),

	"BREAK": new exports.BSLTokenType("BREAK", /^(?:прервать|break)/iu),
	"CONTINUE": new exports.BSLTokenType("CONTINUE", /^(?:продолжить|continue)/iu),

	"NEWOBJECT": new exports.BSLTokenType("NEWOBJECT", /^(?:нов(?:ый|ая|ое)|new)/iu),
	"OBJECT": new exports.BSLTokenType("OBJECT", /^[\w_а-я]+(?=[\[\]\d\w_а-я]*\.)/iu),
	"OBJECTMETHOD": new exports.BSLTokenType("OBJECTMETHOD", /^\.([\w_а-я]+)(?=\()/iu),
	"OBJECTPROP": new exports.BSLTokenType("OBJECTPROP", /^\.([\w_а-я]+)/iu),
	"ARGSEPARATOR": new exports.BSLTokenType("ARGSEPARATOR", /^,/iu),

	"NEQ": new exports.BSLTokenType("NEQ", /^<>/iu),
	"LTEQ": new exports.BSLTokenType("LTEQ", /^<=/iu),
	"LT": new exports.BSLTokenType("LT", /^</iu),
	"GTEQ": new exports.BSLTokenType("GTEQ", /^>=/iu),
	"GT": new exports.BSLTokenType("GT", /^>/iu),
	"ASSIGN": new exports.BSLTokenType("ASSIGN", /^=/),

	"AND": new exports.BSLTokenType("AND", /^(?:И|AND)(?=[\s])/iu),
	"OR": new exports.BSLTokenType("OR", /^(?:ИЛИ|OR)(?=[\s])/iu),
	"NOT": new exports.BSLTokenType("NOT", /^(?:НЕ|NOT)(?=[\s])/iu),

	"HELP": new exports.BSLTokenType("HELP", /^(?:помощь|help)(?=\(|[\s])/iu),
	"CALLFUNC": new exports.BSLTokenType("CALLFUNC", /^[\w_а-я]+(?=\()/iu),
	"ASYNC": new exports.BSLTokenType("ASYNC", /^(?:асинх|async)(?=[\s])/iu),
	"FUNC": new exports.BSLTokenType("FUNC", /^(?:функция|function)(?=[\s])/iu),
	"ENDFUNC": new exports.BSLTokenType("ENDFUNC", /^(?:конецфункции|endfunction)(?:(?=[\s;])|$)/iu),
	"PROC": new exports.BSLTokenType("PROC", /^(?:процедура|procedure)(?=[\s])/iu),
	"ENDPROC": new exports.BSLTokenType("ENDPROC", /^(?:конецпроцедуры|endprocedure)(?:(?=[\s;])|$)/iu),
	"EXPORT": new exports.BSLTokenType("EXPORT", /^(?:экспорт|export)(?=[\s])/iu),
	"RETURN": new exports.BSLTokenType("RETURN", /^(?:возврат|return)(?=[\s;])/iu),
	"VALARG": new exports.BSLTokenType("VALARG", /^(?:знач|val)(?=[\s])/iu),

	"FOREACH": new exports.BSLTokenType("FOREACH", /^(?:для каждого|for each)/iu),
	"FOR": new exports.BSLTokenType("FOR", /^(?:для|for)(?=[\s])/iu),
	"WHILE": new exports.BSLTokenType("WHILE", /^(?:пока|while)(?=[\s])/iu),
	"FORTO": new exports.BSLTokenType("FORTO", /^(?:по|to)(?=[\s])/iu),
	"FOROF": new exports.BSLTokenType("FOROF", /^(?:из|in)(?=[\s])/iu),
	"CYCLESTART": new exports.BSLTokenType("CYCLESTART", /^(?:цикл|do)(?=[\s])/iu),
	"CYCLESTARTDOWN": new exports.BSLTokenType("CYCLESTARTDOWN", /^(?:обратныйцикл|backdo)(?=[\s])/iu),
	"CYCLEEND": new exports.BSLTokenType("CYCLEEND", /^(?:конеццикла|enddo)/iu),

	"PLUSONE": new exports.BSLTokenType("PLUSONE", /^\+\+/iu),
	"MINUSONE": new exports.BSLTokenType("MINUSONE", /^--/iu),
	"PLUSASSIGN": new exports.BSLTokenType("PLUSASSIGN", /^\+=/iu),
	"MINUSASSIGN": new exports.BSLTokenType("PLUSASSIGN", /^-=/iu),

	"PLUS": new exports.BSLTokenType("PLUS", /^\+/),
	"MINUS": new exports.BSLTokenType("MINUS", /^\-/),
	"MULTIPLY": new exports.BSLTokenType("MULTIPLY", /^\*/),
	"DIV": new exports.BSLTokenType("DIV", /^\//),
	"MOD": new exports.BSLTokenType("MOD", /^\%/),

	"LPAR": new exports.BSLTokenType("LPAR", /^\(/),
	"RPAR": new exports.BSLTokenType("RPAR", /^\)/),

	"LBIDX": new exports.BSLTokenType("LBIDX", /^\[/),
	"RBIDX": new exports.BSLTokenType("RBIDX", /^\]/),

	"UNDEFINED": new exports.BSLTokenType("UNDEFINED", /^(?:неопределено|undefined)/iu),
	"NULL": new exports.BSLTokenType("NULL", /^null/iu),

	"VARIABLE": new exports.BSLTokenType("VARIABLE", /^[a-zA-Z_а-яА-Я][\w_а-яА-Я]*/iu),
};

