// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract SimpleAccount {
    using ECDSA for bytes32;

    uint96 private _nonce;
    address public owner;

    event FundsDeposited(address from, uint256 amount);
    event FundsTransferred(address to, uint256 amount);
    event EntryPointChanged(address indexed oldEntryPoint, address indexed newEntryPoint);

    struct UserOperation {
        address sender;
        uint256 nonce;
        bytes initCode;
        bytes callData;
        uint256 callGasLimit;
        uint256 verificationGasLimit;
        uint256 preVerificationGas;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
        bytes paymasterAndData;
        bytes signature;
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    constructor(address anOwner) {
        owner = anOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function nonce() public view returns (uint256) {
        return _nonce;
    }

    function transfer(address payable dest, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        dest.transfer(amount);
        emit FundsTransferred(dest, amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function executeUserOperation(UserOperation calldata userOp) external onlyOwner {
        require(userOp.nonce == _nonce, "Invalid nonce");
        require(userOp.sender == address(this), "Invalid sender");

        // Handle the operation based on userOp.callData (example: transfer)
        (bool success, ) = address(this).call(userOp.callData);
        require(success, "Operation failed");

        _nonce++;
    }
}