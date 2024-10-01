const { BSLNumber } = require('../globalContext/objects/number');

exports.NumberFormatter = class{
	$locale;
	options;

	constructor(locale = "en_US", options = {}){
		let localeData;

		try{
			localeData = require(`./locales/${locale}`);
		}catch(e){
			localeData = require(`./locales/en_US`);
		}

		this.$locale = localeData.locale;

		if(options.currency === undefined){
			options.currency = {};
		}

		if(options.currency.fractional === undefined){
			options.currency.fractional = {};
		}

		this.options = {
			useCurrency: options.useCurrency || true,
			ignoreDecimal: options.ignoreDecimal || false,
			decimalsAsNumbers: options.decimalsAsNumbers || true,
			doNotAddOnly: options.doNotAddOnly || true,
			currency: {
				one: options.currency.one,
				two: options.currency.two,
				many: options.currency.many,
				fractional: {
					one: options.currency.fractional.one,
					two: options.currency.fractional.two,
					many: options.currency.fractional.many,
					digits: options.currency.fractional.digits || this.$locale.currency.fractional.digits,
				},
			}
		};
	}

	format (number){
		let sign = 1,
			num = new BSLNumber(number),
			numInt = num.abs().integerValue(BigNumber.ROUND_DOWN),
			numFract = num.abs().decimalPlaces(this.options.currency.fractional.digits).minus(numInt),
			resultArr = [];

		if(num.isNegative() && !num.isZero()){
			sign = -1;
		}

		let numMod = numFract.mod(1);
		while(numMod != 0){
			numFract = numFract.shiftedBy(1);
			numMod = numFract.mod(1);
		}

		resultArr.push((sign < 0 ? this.$locale.texts.minus : "") + this.#getSpellFromNum(numInt));
		if(this.options.useCurrency == true){
			let exactNum = numInt.mod(10);

			if(exactNum > 0 && exactNum < 2)
				resultArr.push(this.options.currency.one);
			else if(exactNum > 1 && exactNum < 3)
				resultArr.push((this.options.currency.two !== undefined ? this.options.currency.two : this.options.currency.one));
			else
				resultArr.push((this.options.currency.many !== undefined ? this.options.currency.many : this.options.currency.one));
		}

		if(!this.options.ignoreDecimal){
			if(!this.options.decimalsAsNumbers){
				resultArr.push(this.#getSpellFromNum(numFract));
			}else{
				resultArr.push(numFract.toString());
			}

			if(this.options.useCurrency == true){
				let exactNum = numFract.mod(10);
	
				if(exactNum > 0 && exactNum < 2)
					resultArr.push(this.options.currency.fractional.one);
				else if(exactNum > 1 && exactNum < 3)
					resultArr.push((this.options.currency.fractional.two !== undefined ? this.options.currency.fractional.two : this.options.currency.fractional.one));
				else
					resultArr.push((this.options.currency.fractional.many !== undefined ? this.options.currency.fractional.many : this.options.currency.fractional.one));
			}
		}

		return resultArr.join(" ");
	}

	#getSpellFromNum(number){
		let num = new BSLNumber(number),
			resultArr = [];

		num = num.abs();
		let i = 0;
		while(i < this.$locale.numMapping.length){
			let numMap = this.$locale.numMapping[i];

			if(num.isGreaterThanOrEqualTo(numMap.number)){
				let exactNum = 1;
				if(numMap.number >= this.$locale.exactNum){
					exactNum = num.idiv(numMap.number);
					resultArr.push(this.#getSpellFromNum(exactNum));
				}

				if(exactNum > 0 && exactNum < 2)
					resultArr.push(numMap.one);
				else if(exactNum > 1 && exactNum < 3)
					resultArr.push((numMap.two !== undefined ? numMap.two : numMap.one));
				else 
					resultArr.push((numMap.many !== undefined ? numMap.many : numMap.one));

				num = num.minus(numMap.number * exactNum);

				if(!this.options.doNotAddOnly && numMap.number >= this.$locale.exactNum && !num.isZero() && this.$locale.texts.and != ""){
					resultArr.push(this.$locale.texts.and);
				}

				if(num.isZero()){
					break;
				}
				i = 0;
			}else
				i++;
		}

		for(let i = 1; i < resultArr.length; i++){
			resultArr[i] = resultArr[i].toLowerCase();
		}

		return resultArr.join(" ");
	}
}