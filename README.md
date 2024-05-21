# SIMPLE ACCOUNT DAPP

This Solidity program is a full stack "Simple Account" application that allows users to create and manage simple accounts using a factory contract model. The application includes a frontend fully integrated with the smart contracts.

## Description

This program consists of a set of smart contracts written in Solidity. The main contract is a factory contract (`SimpleAccountDeployer`) that deploys new instances of a child contract (`SimpleAccount`). Users can create these accounts, which allow for secure fund management and transaction execution through user operations. The contracts utilize cryptographic signatures for secure transactions.

## CONTRACT ADDRESSES (SEPOLIA)
FACTORY CONTRACT: 0x114122D4083223CbcC7C7468276915Af2f39EF8A;

### Executing program
#### STEP 1
- **CREATE A SIMPLE ACCOUNT.**

Deploy the factory contract to create a new instance of the `SimpleAccount` contract.

#### STEP 2
- **DEPOSIT FUNDS INTO THE SIMPLE ACCOUNT.**

Send ETH to the created `SimpleAccount` contract address to deposit funds.

#### STEP 3
- **EXECUTE TRANSACTIONS FROM THE SIMPLE ACCOUNT.**

Authorized users can execute transactions from the `SimpleAccount`, including transferring funds to other addresses.

## CONTRACT DETAILS
- **SimpleAccount Contract**

This contract allows for secure fund management and transaction execution. It includes functions for depositing funds, transferring funds, and executing user operations.

- **SimpleAccountDeployer Contract**

This contract is responsible for deploying new instances of the `SimpleAccount` contract using the CREATE2 opcode, which ensures predictable contract addresses.

## Authors

EKARIKA NSEMEKE


## License

This project is licensed under the MIT License - see the LICENSE.md file for details
