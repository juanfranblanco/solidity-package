"use strict";
const util = require("../util");
const contract_1 = require("./contract");
const fs = require("fs");
class ContractCollection {
    constructor() {
        this.contracts = new Array();
    }
    findContract(contract, contractPath) {
        return contract.absolutePath === contractPath;
    }
    containsContract(contractPath) {
        return this.contracts.findIndex((contract) => { return contract.absolutePath === contractPath; }) > -1;
    }
    getContractsForCompilation() {
        let contractsForCompilation = {};
        this.contracts.forEach(contract => {
            contractsForCompilation[contract.absolutePath] = contract.code;
        });
        return contractsForCompilation;
    }
    addContractAndResolveImports(contractPath, code = null, project) {
        if (code === null) {
            code = this.readContractCode(contractPath);
        }
        let contract = this.addContract(contractPath, code);
        if (contract !== null) {
            contract.resolveImports();
            contract.imports.forEach(foundImport => {
                if (fs.existsSync(foundImport)) {
                    this.addContractFromLocalImport(foundImport, project);
                }
                else {
                    this.addContractFromPackageImport(foundImport, contract, project);
                }
            });
        }
        return contract;
    }
    addContract(contractPath, code) {
        if (!this.containsContract(contractPath)) {
            let contract = new contract_1.Contract(contractPath, code);
            this.contracts.push(contract);
            return contract;
        }
        return null;
    }
    formatPath(contractPath) {
        return util.formatPath(contractPath);
    }
    getAllImportFromPackages() {
        let importsFromPackages = new Array();
        this.contracts.forEach(contract => {
            let contractImports = contract.getAllImportFromPackages();
            contractImports.forEach(contractImport => {
                if (importsFromPackages.indexOf(contractImport) < 0) {
                    importsFromPackages.push(contractImport);
                }
            });
        });
        return importsFromPackages;
    }
    readContractCode(contractPath) {
        if (fs.existsSync(contractPath)) {
            return fs.readFileSync(contractPath, "utf8");
        }
        return null;
    }
    addContractFromLocalImport(localImport, project) {
        if (!this.containsContract(localImport)) {
            let importContractCode = this.readContractCode(localImport);
            if (importContractCode != null) {
                this.addContractAndResolveImports(localImport, importContractCode, project);
            }
        }
    }
    addContractFromPackageImport(packageImport, contract, project) {
        let depPack = project.findPackage(packageImport);
        if (depPack !== undefined) {
            let depImportPath = this.formatPath(depPack.resolveImport(packageImport));
            if (!this.containsContract(depImportPath)) {
                let importContractCode = this.readContractCode(depImportPath);
                if (importContractCode != null) {
                    this.addContractAndResolveImports(depImportPath, importContractCode, project);
                    contract.replaceDependencyPath(packageImport, depImportPath);
                }
            }
            else {
                contract.replaceDependencyPath(packageImport, depImportPath);
            }
        }
    }
}
exports.ContractCollection = ContractCollection;
