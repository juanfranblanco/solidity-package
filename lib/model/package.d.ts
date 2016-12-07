export declare class Package {
    name: string;
    version: string;
    sol_sources: string;
    build_dir: string;
    absoluletPath: string;
    dependencies: any;
    constructor();
    getSolSourcesAbsolutePath(): string;
    isImportForThis(contractDependencyImport: string): boolean;
    resolveImport(contractDependencyImport: string): string;
}
