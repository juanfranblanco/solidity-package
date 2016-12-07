pragma solidity ^0.4.0;
import 'test/test.sol';

contract auth {
    address owner;

    function auth() {
        owner = msg.sender;
    }

    modifier onlyauth {
        if (msg.sender != owner) {
            throw;
        } else {
            _;
        }
    }
}