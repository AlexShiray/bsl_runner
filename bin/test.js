const { execSync } = require('node:child_process');

let screenRes = Buffer.from(execSync(`wmic desktopmonitor get screenheight, screenwidth /VALUE`)).toString().replace(/(\s)+/g, "&").replace(/(^\&|\&$)/g, "").replace(/([\w]+=\&)/g, "");

screenRes = screenRes.split("&");

let width, height;

for(let resData of screenRes){
	let keyVal = resData.split("=");

	if(keyVal[0] == "ScreenHeight") height = Number(keyVal[1]);
	if(keyVal[0] == "ScreenWidth") width = Number(keyVal[1]);
}

require("webview").spawn({
	title: "BSL Configurator",
	cwd: process.cwd() + "/bin/configurator",
	height: height * 0.7,
	width: width * 0.7
});
