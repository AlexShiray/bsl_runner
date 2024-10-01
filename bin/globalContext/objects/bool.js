exports.BSLBool = class BSLBool extends Boolean{
	$type;

	constructor(bool){
		super(bool);
		this.$type = require("./type").BSLAvailableTypes.Булево;
	}

	toString(){
		return this.valueOf() === true ? "Да" : "Нет";
	}

	typeOf(){
        return this.$type;
    }
}