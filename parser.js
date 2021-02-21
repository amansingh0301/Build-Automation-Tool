//Declaration of Variables
var acceptedArgumentName = ["watch","parallel"];
var argumentName = [];
var argumentValue = [];

//function for extracting argument name

function extractKeyName(commandLineOptions) {
  var keyNames = [];
  for (var i = 2; i < commandLineOptions.length; i++) {
    keyNames.push(commandLineOptions[i].split("=")[0].split("-")[2]);
  }
  return keyNames;
}

//function for extracting values of key

function extractKeyValue(commandLineOptions) {
  var keyValues = [];
  for (var i = 2; i < commandLineOptions.length; i++) {
    if(commandLineOptions[i].split("=")[1]){
      keyValues.push(commandLineOptions[i].split("=")[1]);
    }else{
      keyValues.push(" ");
    }
  }
  return keyValues;
}

//function to check argumnet names are valid or not

function validKeyName(argumentNames) {
  for (var i = 0; i < argumentNames.length; i++) {
    if (!acceptedArgumentName.includes(argumentNames[i])) {
      return false;
    }
  }
  return true;
}

//function to check '--key' is present or not

function keyPresent(argumentNames) {
  return argumentNames.includes("key") ? true : false
}

//function to check values are correct or note

function validKeyVlaue(argumentNames, argumentValues) {
  for (var i = 0; i < argumentNames.length; i++) {
    if (argumentNames[i] === 'key') {
      if (isNaN(argumentValues[i])) {
        return false;
      } else {
        return true;
      }
    }
  }
}

//converting final answer to json jsonObject

function jsonObject() {
  var ans = {};
  for (var i = 0; i < argumentName.length; i++) {
    ans[argumentName[i]] = argumentValue[i];
  }
  return ans;
}

const parser = (pr) => {
  argumentName = extractKeyName(pr);
  argumentValue = extractKeyValue(pr);

  //If arguments are valid and '--key' is present or not

  if (!validKeyName(argumentName)){ //|| !keyPresent(argumentName)) {
    throw new Error("Not a valid argument");
  }

  //arguments are valid and '--key' is present

  //now checking values are valid or not

  // if (!validKeyVlaue(argumentName, argumentValue)) {
  //   throw new Error("Not a valid argument value");
  // }

  //valid argument key Values

  return jsonObject();

}


module.exports = {
  parser
};
