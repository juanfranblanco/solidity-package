import { Package } from "./package";
export declare class Project {
    projectPackage: Package;
    dependencies: Array<Package>;
    packagesDir: string;
    constructor(projectPackage: Package, dependencies: Array<Package>, packagesDir: string);
    findPackage(contractDependencyImport: string): Package;
}
