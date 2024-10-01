const {exec} = require("node:child_process"),
	util = require('node:util'),
	execPromise = util.promisify(exec);

exports.BSLGCOS = {
	ЗапуститьПриложение: async (context, command, dir = "", wait = false, exitcode = 0)=>{
		let options = {};

		if(dir != ""){
			options.cwd = dir;
		}

		if(wait == true){
			try{
				await execPromise(command, options);
				context.$BSLRunner.setVariable(context.$node.operands[3], 0);
			}catch(e){
				context.$BSLRunner.setVariable(context.$node.operands[3], e.code);
			}
		}else{
			exec(command, options);
		}
	},
}