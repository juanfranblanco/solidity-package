var path = require('path');
var projectService = require("../lib").projectService;
var contractsCollection = require("../lib").contractsCollection;

//setting up the project
var project = projectService.initialiseProject(path.join(__dirname, 'ethpm'));

console.log(project.projectPackage.name);

//sample contract
var contractPath = path.join(__dirname, 'ethpm', "contracts", "mortal.sol");


var contractsService = new contractsCollection.ContractCollection();

//add a single contract to the collection 
contractsService.addContractAndResolveImports(contractPath, null, project); 

//get input for the solidity compiler
var contractsForCompilation = contractsService.getContractsForCompilation();
console.log(JSON.stringify(contractsForCompilation));
