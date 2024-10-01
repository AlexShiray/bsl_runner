const {BSL} = require("./bsl.js")
;

(async()=>{
	let source = await require('node:fs/promises').readFile(process.argv[2], {encoding: "utf-8"});
	
	let bsl = new BSL();
	
	await bsl.run(source, process.argv[2]);

	for(let userMessage of bsl.getUserMessages(true)){
		console.log(userMessage);
	}
})()