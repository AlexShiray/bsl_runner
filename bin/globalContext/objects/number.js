const { default: BigNumber } = require("bignumber.js");

exports.BSLNumber = class BSLNumber extends BigNumber{
	$type;

	constructor(number){
		super(number);
		this.$type = require("./type").BSLAvailableTypes.Число;
	}

	typeOf(){
		return this.$type;
	}
}