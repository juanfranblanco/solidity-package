import { Contract } from "./contract";
import { Project } from "./project";
export declare class ContractCollection {
    contracts: Array<Contract>;
    constructor();
    findContract(contract: Contract, contractPath: string): boolean;
    containsContract(contractPath: string): boolean;
    getContractsForCompilation(): {};
    addContractAndResolveImports(contractPath: string, code: string, project: Project): Contract;
    private addContract(contractPath, code);
    private formatPath(contractPath);
    private getAllImportFromPackages();
    private readContractCode(contractPath);
    private addContractFromLocalImport(localImport, project);
    private addContractFromPackageImport(packageImport, contract, project);
}
