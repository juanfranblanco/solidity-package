export declare class Contract {
    code: string;
    imports: Array<string>;
    absolutePath: string;
    packagePath: string;
    abi: string;
    constructor(absoulePath: string, code: string);
    getAllImportFromPackages(): string[];
    isImportLocal(importPath: string): boolean;
    formatPath(contractPath: string): string;
    replaceDependencyPath(importPath: string, depImportAbsolutePath: string): void;
    resolveImports(): void;
}
