// requiring
const execSync = require('child_process').execSync;
const fs = require("fs");
const {exec} = require('child_process')

const executeCommand = (commands) => {
  var ou = execSync(commands, {
    stdio: 'inherit'
  });
  if (ou !== null) {
    console.log(ou);
  }

  console.log("sequentially : "+commands);
}

const execute = (commands) => {
  exec(commands, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log("parallel : "+commands)
  console.log(`stdout: ${stdout}`);
});
}

//reading build.json Function
const read = () => {
  if(fs.existsSync("build.json")){
    return JSON.parse(fs.readFileSync("build.json", {
      encoding: 'utf8'
    }));
  }
  return null;
}

//exporting

module.exports = {
  executeCommand,
  read,
  execute
}
