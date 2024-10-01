
exports.BSLString = class BSLString extends String{
	$type;
	

	constructor(string){
		super(string);
		this.$type = require("./type").BSLAvailableTypes.Строка;
	}

	typeOf(){
		return this.$type;
	}
}