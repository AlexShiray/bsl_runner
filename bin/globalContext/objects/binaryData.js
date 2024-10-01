
exports.BSLBinaryData = class BSLBinaryData{
	$object;
	$filename;
	$type;
	
	constructor(context, filename){
		this.$type = require("./type").BSLAvailableTypes.ДвоичныеДанные;

		if(filename instanceof Buffer){
			this.$object = filename;
			return;
		}

		this.$object = require('node:fs').readFileSync(`${filename}`);
		this.$filename = filename;
	}

	Размер(context){
		return new (require('./number').BSLNumber)(this.$object.length);
	}

	Записать(context, desintation = undefined){
		if(desintation === undefined){
			desintation = this.$filename;
		}

		require('node:fs').writeFileSync(desintation.valueOf(), this.$object);
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}