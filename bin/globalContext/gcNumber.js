const { default: BigNumber } = require("bignumber.js");

exports.BSLGCNumber = {
	РежимОкругления: {
		Окр15как10: 1,
		Окр15как20: 2
	},

	ACos: function (context, num) {
		return Math.acos(num);
	},

	ASin: function (context, num) {
		return Math.asin(num);
	},

	ATan: function (context, num) {
		return Math.atan(num);
	},

	Cos: function (context, num) {
		return Math.cos(num);
	},

	Exp: function (context, num) {
		return Math.exp(num);
	},

	Log: function (context, num) {
		if(num <= 0) 
			context.$BSLRunner.$throwError(context.$node, `Неправильное значение аргумента встроенной функции (Log)`);
		
		return Math.log(num);
	},

	Log10: function (context, num) {
		if(num <= 0) 
			context.$BSLRunner.$throwError(context.$node, `Неправильное значение аргумента встроенной функции (Log10)`);
		
		return Math.log10(num);
	},

	Pow: function (context, base, exponent) {
		if(base instanceof BigNumber)
			return base.pow(exponent);
		else
			return Math.pow(base, exponent);
	},

	Sin: function (context, num) {
		return Math.sin(num);
	},

	Sqrt: function (context, num) {
		if(base instanceof BigNumber)
			return base.sqrt(exponent);
		else
			return Math.sqrt(num);
	},

	Tan: function (context, num) {
		return Math.tan(num);
	},

	Окр: function (context, num, bitness = 0, mode = 2) {
		if(mode == 1){
			return Math.round((num - 0.1) * Math.pow(10, bitness)) / Math.pow(10, bitness) + 0.1;
		}else
		if(mode == 2){
			return Math.round(num * Math.pow(10, bitness)) / Math.pow(10, bitness);
		}
	},

	Цел: function (context, num) {
		return Math.trunc(num);
	},
};