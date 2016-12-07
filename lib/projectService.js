"use strict";
const package_1 = require("./model/package");
const project_1 = require("./model/project");
const fs = require("fs");
const jsyaml = require("js-yaml");
const path = require("path");
const dapplePackageConfigFileName = "dappfile";
const packageConfigFileName = "epm.json";
const packageDependenciesDirectory = "packages";
function createEthPmPackage(projectPackageFile, rootPath) {
    let packageConfig = JSON.parse(fs.readFileSync(projectPackageFile, "utf8"));
    let projectPackage = new package_1.Package();
    projectPackage.absoluletPath = rootPath;
    if (packageConfig) {
        projectPackage.sol_sources = "contracts";
        projectPackage.name = packageConfig.package_name;
        projectPackage.version = packageConfig.version;
        projectPackage.dependencies = packageConfig.dependencies;
    }
    return projectPackage;
}
function createDapplePackage(projectPackageFile, rootPath) {
    let packageConfig = jsyaml.load(fs.readFileSync(projectPackageFile, "utf8"));
    let projectPackage = new package_1.Package();
    projectPackage.absoluletPath = rootPath;
    if (packageConfig) {
        if (packageConfig.layout !== undefined) {
            projectPackage.build_dir = packageConfig.layout.build_dir;
            projectPackage.sol_sources = packageConfig.layout.sol_sources;
        }
        projectPackage.name = packageConfig.name;
        projectPackage.version = packageConfig.version;
        projectPackage.dependencies = packageConfig.dependencies;
    }
    return projectPackage;
}
function createPackage(rootPath) {
    let projectPackageFile = path.join(rootPath, packageConfigFileName);
    if (fs.existsSync(projectPackageFile)) {
        return createEthPmPackage(projectPackageFile, rootPath);
    }
    let dappleProjectPackageFile = path.join(rootPath, dapplePackageConfigFileName);
    if (fs.existsSync(dappleProjectPackageFile)) {
        return createDapplePackage(dappleProjectPackageFile, rootPath);
    }
    return null;
}
function initialiseProject(rootPath) {
    let projectPackage = createProjectPackage(rootPath);
    let dependencies = loadDependencies(rootPath, projectPackage);
    let packagesDirAbsolutePath = path.join(rootPath, packageDependenciesDirectory);
    return new project_1.Project(projectPackage, dependencies, packagesDirAbsolutePath);
}
exports.initialiseProject = initialiseProject;
function loadDependencies(rootPath, projectPackage, depPackages = new Array()) {
    if (projectPackage.dependencies !== undefined) {
        Object.keys(projectPackage.dependencies).forEach(dependency => {
            if (!depPackages.some((existingDepPack) => existingDepPack.name === dependency)) {
                let depPackagePath = path.join(rootPath, packageDependenciesDirectory, dependency);
                let depPackage = createPackage(depPackagePath);
                if (depPackage !== null) {
                    depPackages.push(depPackage);
                    loadDependencies(rootPath, depPackage, depPackages);
                }
                else {
                }
            }
        });
    }
    return depPackages;
}
function createProjectPackage(rootPath) {
    let projectPackage = createPackage(rootPath);
    if (projectPackage === null) {
        projectPackage = new package_1.Package();
        projectPackage.absoluletPath = rootPath;
    }
    return projectPackage;
}
