
"use strict";
import * as util from "../util";
import {Contract} from "./contract";
import {Project} from "./project";
import * as fs from "fs";

export class ContractCollection {
    public contracts: Array<Contract>;
    constructor() {
        this.contracts = new Array<Contract>();
    }

    public findContract(contract: Contract, contractPath: string) {
        return contract.absolutePath === contractPath;
    }

    public containsContract(contractPath: string) {
        return this.contracts.findIndex(
                (contract: Contract) => { return contract.absolutePath === contractPath; }) > -1;
    }

    public getContractsForCompilation() {
        let contractsForCompilation = {};
        this.contracts.forEach(contract => {
            contractsForCompilation[contract.absolutePath] = contract.code;
        });
        return contractsForCompilation;
    }

    public addContractAndResolveImports(contractPath: string, code: string = null, project: Project) {
        if (code === null) {
            code = this.readContractCode(contractPath);
        }
        let contract = this.addContract(contractPath, code);
        if (contract !== null) {
            contract.resolveImports();
            contract.imports.forEach(foundImport => {
                if (fs.existsSync(foundImport)) {
                    this.addContractFromLocalImport(foundImport, project);
                } else {
                    this.addContractFromPackageImport(foundImport, contract, project);
                }
            });
        }
        return contract;
    }

    private addContract(contractPath: string, code: string) {
        if (!this.containsContract(contractPath)) {
            let contract = new Contract(contractPath, code);
            this.contracts.push(contract);
            return contract;
        }
        return null;
    }

    private formatPath(contractPath: string) {
        return util.formatPath(contractPath);
    }

    private getAllImportFromPackages() {
        let importsFromPackages = new Array<string>();
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

    private readContractCode(contractPath: string) {
        if (fs.existsSync(contractPath)) {
            return fs.readFileSync(contractPath, "utf8");
        }
        return null;
    }

    private addContractFromLocalImport(localImport: string, project: Project){
        if (!this.containsContract(localImport)) {
            let importContractCode = this.readContractCode(localImport);
            if (importContractCode != null) {
                this.addContractAndResolveImports(localImport, importContractCode, project);
            }
        }
    }

    private addContractFromPackageImport(packageImport: string, contract: Contract, project: Project) {
        let depPack = project.findPackage(packageImport);

        if (depPack !== undefined) {
            let depImportPath = this.formatPath(depPack.resolveImport(packageImport));
            if (!this.containsContract(depImportPath)) {
                let importContractCode = this.readContractCode(depImportPath);
                if (importContractCode != null) {
                    this.addContractAndResolveImports(depImportPath, importContractCode, project);
                    contract.replaceDependencyPath(packageImport, depImportPath);
                }
            } else {
                contract.replaceDependencyPath(packageImport, depImportPath);
            }
        }
    }

}
