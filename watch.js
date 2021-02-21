const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const command = require("./commands")
const graph = require("./construct_graph")
require('log-timestamp')

//declaring variables
const deeper = "./algorithms";
const back = "..";

const file = __dirname;

var fsWait = false;
var md5Previous = null;

fs.watch(file, {
  recursive: true
}, (event, filename) => {
  if (filename) {
    if (fsWait) return;
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100)
    const md5Current = md5(fs.readFileSync(filename));
    if (md5Current === md5Previous) {
      return;
    }
    md5Previous = md5Current;
    console.log(`${filename} changed`);
    compileDependentfiles(filename);
  }
});

function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

function compileDependentfiles(changed) {
  var last_dot=-1;
  for(var i=changed.length-1;i>=0;i--){
    if(changed[i]==='.'){
      last_dot=i;
      break;
    }
  }
  changed = changed.substr(0,last_dot);
  var changed1 = changed.split('\\').join("/");
  var ar = changed.split("\\");
  changed = ar[ar.length-1];

  var resolved = [];
  var dirs = getDirectoriesRecursive(__dirname);
  for(var i=dirs.length-1;i>=0;i--){
    const cur_folder = __dirname;
    process.chdir(dirs[i]);
    const data = command.read();
    if(data!==null){
    for(var j=0;j<Object.keys(data).length;j++){
        if((data[j].deps!== undefined && (data[j].deps.includes(changed) || data[j].deps.includes(changed1)) && data[j].command!==undefined) || data[j].name===changed){
          resolved.push(data[j].command);
        }
      }
      for(var j=0;j<resolved.length;j++){
        command.executeCommand(resolved[j]);
      }
    }
    resolved = [];
    process.chdir(cur_folder);
  }
}
