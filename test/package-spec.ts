
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />

import { Package } from "../src/model/package";
import * as chai from "chai";
import * as path from "path";

const expect = chai.expect;

describe("package", () => {
  it("should identify if an import belongs to the package", () => {
    let contractImport = "test/Hello.sol";
    let contractInvalidImport = "testing/Hello.sol";
    let contractNoPath = "Hello.sol";
    const solPackage = new Package();
    solPackage.name = "test";
    expect(solPackage.isImportForThis(contractImport)).to.be.true;
    expect(solPackage.isImportForThis(contractInvalidImport)).to.be.false;
    expect(solPackage.isImportForThis(contractNoPath)).to.be.false;
  });

  it("should be able to resolve import to the absolute path", () => {
    const solPackage = new Package();
    solPackage.name = "test";
    solPackage.absoluletPath = "/root/user/myproject/modules/test";
    solPackage.sol_sources = "solidity";

    let contractImport = "test/Hello.sol";
    expect(solPackage.resolveImport(contractImport)).to.equal(
      path.join(solPackage.absoluletPath, solPackage.sol_sources, "Hello.sol"));

    let contractSubpathImport = "test/monkey/Hello.sol";
    expect(solPackage.resolveImport(contractSubpathImport)).to.equal(
      path.join(solPackage.absoluletPath, solPackage.sol_sources, "monkey", "Hello.sol"));
  });

});
