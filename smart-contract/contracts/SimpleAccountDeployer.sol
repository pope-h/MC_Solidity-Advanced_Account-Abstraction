// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SimpleAccount.sol";

contract SimpleAccountDeployer {
    function deployAccount(address owner, uint256 salt) public returns (address) {
        address addr = getAddress(owner, salt);
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return addr;
        }
        return address(new SimpleAccount{salt: bytes32(salt)}(owner));
    }

    function getAddress(address owner, uint256 salt) public view returns (address) {
        return Create2.computeAddress(
            bytes32(salt),
            keccak256(abi.encodePacked(type(SimpleAccount).creationCode, abi.encode(owner)))
        );
    }
}