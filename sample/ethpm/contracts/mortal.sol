pragma solidity ^0.4.0;

import {owned} from "./owned.sol";
import "auth/auth.sol";

contract mortal is owned {
    function kill() public onlyowner {
        selfdestruct(msg.sender);
    }
}