
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />

import { Contract } from "../src/model/contract";
import * as util from "../src/util";
import * as chai from "chai";
import * as path from "path";


const expect = chai.expect;

describe("contract", () => {
  it("should resolve local imports as absolute paths, using a compatible format for solidity", () => {
    let absolutePath = "/root/path/contracts/submodule/Hello.sol";
    let contractCode = "pragma solidity ^0.4.3; \n\r import '../Auth.sol';";
    const contract = new Contract(absolutePath, contractCode);
    contract.resolveImports();
    // on windows should use forward slashes
    expect(contract.imports[0]).to.equal(util.formatPath(path.resolve("/root/path/contracts/Auth.sol")));
  });

  it("should resolve module imports", () => {
    let absolutePath = "/root/path/contracts/submodule/Hello.sol";
    let contractCode = "pragma solidity ^0.4.3; \n\r import 'auth/Auth.sol';";
    const contract = new Contract(absolutePath, contractCode);
    contract.resolveImports();
    expect(contract.imports[0]).to.equal("auth/Auth.sol");
  });

  it("should replace code dependency path", () => {
    let absolutePath = "/root/path/contracts/submodule/Hello.sol";
    let contractCode = "pragma solidity ^0.4.3; \n\r import 'auth/Auth.sol';";
    const contract = new Contract(absolutePath, contractCode);
    let absolutePathImport = util.formatPath(path.resolve("/root/path/contracts/auth/Auth.sol"));
    contract.replaceDependencyPath("auth/Auth.sol", absolutePathImport);
    expect(contract.code).to.equal("pragma solidity ^0.4.3; \n\r import '" + absolutePathImport + "';");
  });

  it("should consider . prefixed imports as local", () => {
    let importPathLocal = "./Hello.sol";
    let importPathLocalRoot = "../Hello.sol";
    let importPathModule = "module/Hello.sol";
    const contract = new Contract("", "");
    expect(contract.isImportLocal(importPathLocal)).to.be.true;
    expect(contract.isImportLocal(importPathLocalRoot)).to.be.true;
    expect(contract.isImportLocal(importPathModule)).to.be.false;
  });

  it("should retrieve all the imports from packages", () => {
    let absolutePath = "/root/path/contracts/submodule/Hello.sol";
    let contractCode =
    "pragma solidity ^0.4.3; \n\r import 'auth/Auth.sol'; \n\r import 'module/Test.sol' \n\r import './Factory.sol'";
    const contract = new Contract(absolutePath, contractCode);
    contract.resolveImports();
    let imports = contract.getAllImportFromPackages();
    expect(imports.length).to.equal(2);
    expect(imports[0]).to.equal("auth/Auth.sol");
    expect(imports[1]).to.equal("module/Test.sol");
  });

});
