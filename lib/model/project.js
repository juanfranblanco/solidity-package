"use strict";
class Project {
    constructor(projectPackage, dependencies, packagesDir) {
        this.projectPackage = projectPackage;
        this.dependencies = dependencies;
        this.packagesDir = packagesDir;
    }
    findPackage(contractDependencyImport) {
        return this.dependencies.find((depPack) => depPack.isImportForThis(contractDependencyImport));
    }
}
exports.Project = Project;
