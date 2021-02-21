const commands = require("./commands");
class Node {
  constructor(node) {
    this.name = node;
    this.edges = [""];
    this.command = "";
  }
  addEdge(node) {
    this.edges.push(node);
  }
}

var graph = [];
var resolved = [];
var vis = [];


const construct_graph = (node) => {
var node_name = node;
if(last_folder_name(node)!=-1){
  node_name = node.substr(last_folder_name(node)+1,node.length);
}
var temp_node = node_name;
const data = commands.read();
var node_index = -1;
for (var i = 0; i < Object.keys(data).length; i++) {
  if (data[i].name === temp_node) {
    node_index = i;
    break;
  }
}

if (node_index != -1) {
  const new_node = new Node(__dirname+"/"+node);
  if (data[node_index].deps != null) {
    new_node.edges = data[node_index].deps;
    for (var i = 0; i < new_node.edges.length; i++) {
      graph = construct_graph(new_node.edges[i]);
    }
  }
  if(data[node_index].command!=null){
    new_node.command = data[node_index].command;
  }
  graph.push(new_node);
} else {
  const deeper = node.substr(0, last_folder_name(node));
  const cur_folder = __dirname;
  process.chdir(deeper);
  graph = construct_graph(node);
  process.chdir(cur_folder);
}
return graph;
}

const mark_index = (created_graph) => {
var marked_index = {};
for(var i=0;i<created_graph.length;i++){
  marked_index[created_graph[i].name] = i;
}
return marked_index;
}

const resolve_graph = (node,marked_index,created_graph,parallel) => {
node = __dirname+"/"+node;
vis.push(node);
var all_deps_resolved=0;
for(var i=0;i<created_graph[marked_index[node]].edges.length;i++){
  if(!vis.includes(__dirname+"/"+created_graph[marked_index[node]].edges[i]) && created_graph[marked_index[node]].edges[i]!==""){
    all_deps_resolved=1;
    resolved = resolve_graph(created_graph[marked_index[node]].edges[i],marked_index,created_graph,parallel);
  }
}
  if(parallel === 1 && created_graph[marked_index[node]].command!=="" && all_deps_resolved===1){
    //Running parallel
    execute_Parallel(node,marked_index,created_graph,last_folder_name(node));
    return resolved;
  }
  else if(created_graph[marked_index[node]].command!==""){
    //Running sequentially
    execute_Sequentially(node,marked_index,created_graph,last_folder_name(node));
    return resolved;
  }
}

const execute_Parallel = (node,marked_index,created_graph,last_folder) => {
  const deeper = node.substr(0, last_folder);
  const cur_folder = __dirname;
  process.chdir(deeper);
  commands.execute(created_graph[marked_index[node]].command)
  process.chdir(cur_folder);
  resolved.push({de:deeper,com:created_graph[marked_index[node]].command});
}

const execute_Sequentially = (node,marked_index,created_graph,last_folder) => {
  const deeper = node.substr(0, last_folder);
  const cur_folder = __dirname;
  process.chdir(deeper);
  commands.executeCommand(created_graph[marked_index[node]].command)
  process.chdir(cur_folder);
  resolved.push({de:deeper,com:created_graph[marked_index[node]].command});
}

const last_folder_name = (node) => {
  var last_folder = -1;
  for (var i = node.length - 1; i >= 0; i--) {
    if (node[i] === "/" || node[i]==='\\') {
      last_folder = i;
      break;
    }
  }
  return last_folder;
}


module.exports = {
  construct_graph,
  mark_index,
  resolve_graph,
  execute_Parallel,
  execute_Sequentially,
  last_folder_name
}
