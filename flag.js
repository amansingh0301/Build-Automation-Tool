const par = require("./parser");
const graph = require("./construct_graph")
const command = require("./commands");
var options = process.argv.slice(1,process.argv.length);
const flags = par.parser(options);

var parallel=0;

if(flags.watch){
  console.log("Watching "+flags.watch);
}

if(flags.parallel){
  console.log("Parallel execution");
  parallel=1;
}

var head_node = process.argv[2];
var created_graph=graph.construct_graph(head_node);
var marked_index = graph.mark_index(created_graph);
var resolved = graph.resolve_graph(head_node,marked_index,created_graph,parallel);

if(flags.watch){
  command.executeCommand("node watch.js");
}
