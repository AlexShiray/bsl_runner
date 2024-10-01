
exports.BSLHashFunction = class BSLHashFunction{
	name;
	$type;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Описывает используемую хеш функцию для объекта ХешированиеДанных`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(context, name){
		this.$type = require("./objects/type").BSLAvailableTypes.ХешФункция;
		this.name = name;
	}

	toString(){
		return this.$type.toString();
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLGCHashFunction = {
	ХешФункция:{
		CRC32: new exports.BSLHashFunction(this, "CRC32"),
		MD5: new exports.BSLHashFunction(this, "md5"),
		SHA1: new exports.BSLHashFunction(this, "sha1"),
		SHA256: new exports.BSLHashFunction(this, "sha256"),
		SHA512: new exports.BSLHashFunction(this, "sha512"),
		$help: function(context){
			console.log(`Описывает типы хеш функций для объекта ХешированиеДанных.
			|	Значения:
			|	CRC32 - Вычислять значение CRC32
			|	MD5 - Вычислять значение MD5
			|	SHA1 - Вычислять значение SHA-1
			|	SHA256 - Вычислять значение SHA-256
			|	SHA512 - Вычислять значение SHA-512
			`.replace(/\n[\s]+\|/g, "\n"));
				return;
		}
	}
}