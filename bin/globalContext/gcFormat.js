const {BSLDate} = require('./objects/date')
	, {NumberFormatter} = require('../numberFormatter/numfmt')
;
const { BSLNumber } = require('./objects/number');
exports.BSLGCFormat = {
	Формат: function (context, value, formatString) {
		let langsArr = getLangsArr(formatString);

		if(value instanceof BigNumber){
			let newValue = new BSLNumber(value),
				format = {};

			if(langsArr["ЧС"] !== undefined){
				newValue = newValue.shiftedBy(-parseInt(langsArr["ЧС"]));
			}

			if(langsArr["ЧДЦ"] !== undefined){
				newValue = newValue.decimalPlaces(parseInt(langsArr["ЧДЦ"]));
			}else{
				if(langsArr["ЧЦ"] !== undefined){
					newValue = newValue.decimalPlaces(0);
				}
			}

			if(langsArr["ЧРД"] !== undefined){
				format["decimalSeparator"] = langsArr["ЧРД"];
			}else{
				format["decimalSeparator"] = ",";
			}

			if(langsArr["ЧРГ"] !== undefined){
				format["groupSeparator"] = langsArr["ЧРГ"];
			}else{
				format["groupSeparator"] = `\xa0`;
			}

			if(langsArr["ЧГ"] !== undefined){
				let groupSizes = langsArr["ЧГ"].split(",");
				format["groupSize"] = parseInt(groupSizes[0]);
				if(groupSizes.length > 1){
					format["secondaryGroupSize"] = parseInt(groupSizes[1]); 
				}

				if(groupSizes.length > 2){
					format["fractionGroupSize"] = parseInt(groupSizes[2]); 
				}
			}else{
				format["groupSize"] = 3;
			}

			if(newValue.isEqualTo(0)){
				if(langsArr["ЧН"] !== undefined){
					return langsArr["ЧН"];
				}else{
					return "";
				}
			}else{
				if(langsArr["ЧВН"] !== undefined && langsArr["ЧЦ"] !== undefined){
					let intLength = newValue.abs().integerValue().toString().length;

					format["prefix"] = "";
					for(let i = intLength; i < parseInt(langsArr["ЧЦ"]); i++){
						format["prefix"] += "0" + (i  % format["groupSize"] == 0 ? format["groupSeparator"] : "");
					}
				}

				let newValueFormat = newValue.abs().toFormat(format);

				if(newValue.isLessThan(0)){
					if(langsArr["ЧО"] === undefined){
						langsArr["ЧО"] = "1";
					}

					switch(langsArr["ЧО"]){
						case "0":
							return `(${newValueFormat})`;

						case "1":
							return `-${newValueFormat}`;

						case "2":
							return `- ${newValueFormat}`;

						case "3":
							return `${newValueFormat}-`;

						case "4":
							return `${newValueFormat} -`;
					}
				}

				return newValueFormat;
			}
		}else
		if(value instanceof BSLDate){
			if(value.toLocaleString() === "Invalid Date"){
				if(langsArr["ДП"] !== undefined){
					return langsArr["ДП"];
				}else{
					return "";
				}
			}

			if(langsArr["ДФ"] === undefined && langsArr["ДЛФ"] !== undefined){
				switch(langsArr["ДЛФ"]){
					case "D":
						return value.toLocaleDateString();
						break;

					case "DD":
						langsArr["ДФ"] = "d MMMM yyyy 'г.";
						break;

					case "DT":
						return "" + value.toLocaleDateString() + " " + value.toLocaleTimeString(); 
						break;

					case "DDT":
						langsArr["ДФ"] = "d MMMM yyyy 'г.' hh:mm:ss";
						break;

					case "T":
						return value.toLocaleTimeString();
						break;
				}
			}

			if(langsArr["ДФ"] !== undefined){
				let pos = 0,
					regExes = {
						day4: /^(дддд|dddd)/u,
						day3: /^(ддд|ddd)/u,
						day2: /^(дд|dd)/u,
						day1: /^(д|d)/u,
						month4: /^(ММММ|MMMM)/u,
						month3: /^(МММ|MMM)/u,
						month2: /^(ММ|MM)/u,
						month1: /^(М|M)/u,
						quart: /^(к|q)/u,
						year4: /^(гггг|yyyy)/u,
						year2: /^(гг|yy)/u,
						year1: /^(г|y)/u,
						hour12_2: /^(чч|hh)/u,
						hour12_1: /^(ч|h)/u,
						hour24_2: /^(ЧЧ|HH)/u,
						hour24_1: /^(Ч|H)/u,
						min2: /^(мм|mm)/u,
						min1: /^(м|m)/u,
						sec2: /^(cc|ss)/u,
						sec1: /^(c|s)/u,
						ampm: /^(вв?|tt?)/u,
						dot: /^([^'\wа-яА-Я])/u,
						text: /^'([^']*)(?:'|$)/u
					},
					searchStr = langsArr["ДФ"].substr(pos),
					resultStr = "";

				while(searchStr.length > 0){
					let match;
					for(let regex_name of Object.keys(regExes)){
						match = searchStr.match(regExes[regex_name]);
						let val;

						if(match && match[0]){
							switch(regex_name){
								case "day1":
									resultStr += value.getDate();
									break;

								case "day2":
									val = value.getDate();

									resultStr += (val < 10 ? "0" : "") + val;
									break;

								case "day3":
									resultStr += value.toLocaleString((langsArr["Л"] !== undefined ? langsArr["Л"] : "RU"), {weekday: "short"});
									break;

								case "day4":
									resultStr += value.toLocaleString((langsArr["Л"] !== undefined ? langsArr["Л"] : "RU"), {weekday: "long"});
									break;

								case "month1":
									val = value.getMonth();

									resultStr += (val + 1);
									break;

								case "month2":
									val = value.getMonth();

									resultStr += (val < 10 ? "0" : "") + (val + 1);
									break;

								case "month3":
									resultStr += value.toLocaleString((langsArr["Л"] !== undefined ? langsArr["Л"] : "RU"), {month: "short"});
									break;

								case "month4":
									resultStr += value.toLocaleString((langsArr["Л"] !== undefined ? langsArr["Л"] : "RU"), {month: "long"});
									break;

								case "quart":
									resultStr += String(Math.floor((value.getMonth() + 1) / 4) + 1);
									break;
									
								case "year1":
									resultStr += String(parseInt(value.toLocaleString((langsArr["Л"] !== undefined ? langsArr["Л"] : "RU"), {year: "2-digit"})));
									break;

								case "year2":
									resultStr += value.toLocaleString((langsArr["Л"] !== undefined ? langsArr["Л"] : "RU"), {year: "2-digit"});
									break;

								case "year4":
									resultStr += String(value.getFullYear());
									break;

								case "hour12_1":
									val = value.getHours();

									if(val > 12){
										val -= 12;
									}

									resultStr += String(val);
									break;

								case "hour12_2":
									val = value.getHours();

									if(val > 12){
										val -= 12;
									}

									resultStr += (val < 10 ? "0" : "") + val;
									break;
									
								case "hour24_1":
									val = value.getHours();

									resultStr += String(val);
									break;

								case "hour24_2":
									val = value.getHours();

									resultStr += (val < 10 ? "0" : "") + val;
									break;

								case "min1":
									resultStr += value.getMinutes();
									break;

								case "min2":
									val = value.getMinutes();

									resultStr += (val < 10 ? "0" : "") + val;
									break;

								case "sec1":
									resultStr += value.getSeconds();
									break;
									
								case "sec2":
									val = value.getSeconds();

									resultStr += (val < 10 ? "0" : "") + val;
									break;

								case "ampm":
									val = value.getHours();

									resultStr += (val > 12 ? "PM" : "AM");
									break;

								case "dot":
									resultStr += match[1];
									break;

								case "text":
									resultStr += match[1];
									break;
							}

							pos += match[0].length;
							searchStr = langsArr["ДФ"].substr(pos);
							break;
						}
					}

					if(!(match && match[0])){
						resultStr += searchStr.substring(0, 1);
						pos += 1;
						searchStr = langsArr["ДФ"].substr(pos);
					}
				}

				return resultStr;
			}
		}else
		if(value instanceof BSLBool){
			if(value.valueOf() === false && langsArr["БЛ"] !== undefined){
				return langsArr["БЛ"];
			}

			if(value.valueOf() === true && langsArr["БИ"] !== undefined){
				return langsArr["БИ"];
			}
		}
	},

	ЧислоПрописью: function (context, value, formatString = "", currencyString = "") {
		let langsArr = getLangsArr(formatString),
			newValue = new BSLNumber(value),
			options = {
				
			};

		if(langsArr["НП"] !== undefined && langsArr["НП"].toLowerCase() === "ложь"){
			options.useCurrency = false;
		}

		if(langsArr["НД"] !== undefined && langsArr["НД"].toLowerCase() === "ложь"){
			options.ignoreDecimal = true;
		}

		if(langsArr["ИИ"] !== undefined && langsArr["ИИ"].toLowerCase() === "использовать"){
			options.doNotAddOnly = false;
		}

		let currencyMatch = currencyString.match(/^([^,]+)?, ?(?:([^,]+)?, ?)?([^,]+)?, ?(?:([^,]+)?, ?)?([^,]+)?, ?(?:([^,]+)?, ?)?([^,]+)?, ?(?:([^,]+)?, ?)?([^,]+)?$/imu);

		options.currency = {
			one: currencyMatch[1],
			two: currencyMatch[2] || currencyMatch[3],
			many: currencyMatch[3],
			fractional: {
				one: currencyMatch[5],
				two: currencyMatch[6] || currencyMatch[7],
				many: currencyMatch[7],
				digits: parseInt(currencyMatch[9]),
			},
		}

		let numfmt = new NumberFormatter((langsArr["Л"] !== undefined ? langsArr["Л"] : "ru_RU"), options);
		return numfmt.format(value);
	},

	НСтр: function (context, string, langCode) {
		let langsArr = getLangsArr(string);

		return langsArr[langCode];
	}
};

function getLangsArr(string){
	let langsStrs = string.split(";"),
		langsArr = {},
		lastKey = undefined;

	for(let langStr of langsStrs){
		let match = langStr.match(/^[\s]?([\wа-я]+)=(.+)?$/ium);
		if(match !== null){
			lastKey = match[1];
			langsArr[match[1]] = match[2] || "";
		}else{
			if(langStr.match(/^'/ium) !== null){
				langsArr[lastKey] += `;${langStr}`;
			}
		}
	}

	for(let key in langsArr){
		langsArr[key] = langsArr[key].replace(/^'/ium, "").replace(/'$/ium, "").replace(/''/iumg, "'");
	}

	return langsArr;
}