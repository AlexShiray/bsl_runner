const { BSLBinaryData } = require("./objects/binaryData")

exports.BSLGCBinaryData = {
	ПолучитьHexСтрокуИзДвоичныхДанных: async function (context, binaryData){
		if(!(binaryData instanceof BSLBinaryData))
			await context.$BSLRunner.$throwError(context.$node, `Несоответствие типов (параметр номер 1)`);

		return binaryData.$object.toString('hex').toUpperCase();
	},
	
	ПолучитьHexДвоичныеДанныеИзДвоичныхДанных: async function (context, binaryData) {
		let result = await this.BSLGCBinaryData.ПолучитьHexСтрокуИзДвоичныхДанных(context, binaryData);
		return new BSLBinaryData(context, Buffer.from(result));
	},

	ПолучитьСтрокуИзДвоичныхДанных: async function (context, binaryData) {
		if(!(binaryData instanceof BSLBinaryData))
			await context.$BSLRunner.$throwError(context.$node, `Несоответствие типов (параметр номер 1)`);

		return binaryData.$object.toString('utf-8');
	},

	ПолучитьBase64СтрокуИзДвоичныхДанных: async function (context, binaryData) {
		if(!(binaryData instanceof BSLBinaryData))
			await context.$BSLRunner.$throwError(context.$node, `Несоответствие типов (параметр номер 1)`);

		return binaryData.$object.toString('base64');
	},

	ПолучитьBase64ДвоичныеДанныеИзДвоичныхДанных: async function (context, binaryData) {
		let result = await this.BSLGCBinaryData.ПолучитьBase64СтрокуИзДвоичныхДанных(context, binaryData);
		return new BSLBinaryData(context, Buffer.from(result));
	},

	ПолучитьДвоичныеДанныеИзBase64Строки: async function (context, string) {
		return new BSLBinaryData(context, Buffer.from(string, "base64"));
	},

	ПолучитьДвоичныеДанныеИзBase64ДвоичныхДанных: async function (context, binaryData) {
		let result = await this.BSLGCBinaryData.ПолучитьСтрокуИзДвоичныхДанных(context, binaryData);
		return await this.BSLGCBinaryData.ПолучитьДвоичныеДанныеИзBase64Строки(context, result);
	},

	ПолучитьДвоичныеДанныеИзHexСтроки: async function (context, string) {
		return new BSLBinaryData(context, Buffer.from(string, 'hex'));
	},

	ПолучитьДвоичныеДанныеИзСтроки: async function (context, string){
		return new BSLBinaryData(context, Buffer.from(string));
	}
}