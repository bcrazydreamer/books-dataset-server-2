const fs = require("fs");
const path = require("path");

var configs = {
    user : "testinguser",
    pwd : "12345test"
}

if (fs.existsSync(path.resolve(__dirname, 'config_ow.js'))) {
    var overwriteConfig = require(path.resolve(__dirname, 'config_ow.js'));
    if(configs && overwriteConfig){
        for (var key in overwriteConfig) {
            configs[key] = overwriteConfig[key];
        }
    }
    for (var key in overwriteConfig) {
        configs[key] = overwriteConfig[key];
    }
} else {
    console.log('>>No Config Over Write Found<<');
}

module.exports = configs;