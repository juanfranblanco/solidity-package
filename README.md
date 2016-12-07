# Solidity Package

Standalone Epm.json (and legacy support for dapple) package reader, local dependency package contract resolver, code extraction and import resolver to use in combination of solc.js

This has been refactored out from the vs-code solidity extension to make it reusable and portable as a standalone version.

This will eventually replaced the parts from the vs-code solidity.

See sample folder on how to create a compatible input for solidity.

```javascript
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

```

##TODO
* Support versioning
* Clarification on how dependencies are set on the package. (String / IPFS)
* Refactoring and renaming (ProjectService, ContractCollection)
* More tests.   
