"use client";
import {
  getSimpleAccountContract,
  getSimpleAccountDeployerContract,
} from "@/constants/contracts";
import { getProvider } from "@/constants/providers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useState } from "react";
import { ethers, getNumber, keccak256 } from "ethers";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hgNzWcMKC8C
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [simpleAccountAddress, setSimpleAccountAddress] = useState("");
  const [deployAddress, setDeployAddress] = useState("");
  const [password, setPassword] = useState();
  const [destAddress, setDestAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [simpleAccountBalance, setSimpleAccountBalance] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [value, setValue] = useState("");
  const [calldata, setCalldata] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [params, setParams] = useState([]);

  const readWriteProvider = getProvider(walletProvider);

  const generateSalt = (password) => {
    return keccak256(ethers.toUtf8Bytes(password));
  };

  const handleDeploy = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;
    const simpleAccountDeployerContract =
      getSimpleAccountDeployerContract(signer);
    const salt = generateSalt(password);

    try {
      const tx = await simpleAccountDeployerContract.deployAccount(
        deployAddress,
        salt
      );
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        const getSimpleAccountAddress =
          await simpleAccountDeployerContract.getAddress(
            deployAddress,
            salt
          );

        console.log("getSimpleAccountAddress", getSimpleAccountAddress);

        setSimpleAccountAddress(getSimpleAccountAddress);

        console.log(
          `SimpleAccount created successfully! Address: ${getSimpleAccountAddress}`
        );
        alert(
          `SimpleAccount created successfully! Address: ${getSimpleAccountAddress}`
        );
      } else {
        console.log("Transaction failed");
        alert("Transaction failed");
      } 
    } catch (error) {
      console.log("Error handling SimpleAccountDeployer:", error.message);
      alert(`Error handling SimpleAccountDeployer: ${error.message}`);
      throw error;
    }
  };

  const handleTransfer = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;
    const simpleAccountContract = getSimpleAccountContract(
      signer,
      simpleAccountAddress
    );

    try {
      const tx = await simpleAccountContract.transfer(
        destAddress,
        transferAmount
      );
      await tx.wait();

      const getSimpleAccountBalance = await simpleAccountContract.getBalance();

      console.log("getSimpleAccountBalance", getSimpleAccountBalance);

      setSimpleAccountBalance(getSimpleAccountBalance);

      console.log(`Transfer successful to Address: ${destAddress}`);
      alert(`Transfer successful to Address: ${destAddress}`);
    } catch (error) {
      console.log("Error handling Transfer:", error.message);
      alert(`Error handling Transfer: ${error.message}`);
      throw error;
    }
  };

  const handleExecuteTransaction = async () => {
    const signer = readWriteProvider
      ? await readWriteProvider.getSigner()
      : null;
    const simpleAccountContract = getSimpleAccountContract(
      signer,
      simpleAccountAddress
    );

    try {
      const valueInWei = ethers.parseEther(value);
      const userOperation = {
        sender: simpleAccountAddress,
        nonce: await simpleAccountContract.nonce(),
        initCode: "0x",
        callData: calldata,
        callGasLimit: 1000000,
        verificationGasLimit: 1000000,
        preVerificationGas: 21000,
        maxFeePerGas: ethers.utils.parseUnits("2", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("1", "gwei"),
        paymasterAndData: "0x",
      };

      // Sign the userOperation
      const userOpHash = keccak256(
        ethers.defaultAbiCoder.encode(
          [
            "address",
            "uint256",
            "bytes",
            "bytes",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "bytes",
          ],
          [
            userOperation.sender,
            userOperation.nonce,
            userOperation.initCode,
            userOperation.callData,
            userOperation.callGasLimit,
            userOperation.verificationGasLimit,
            userOperation.preVerificationGas,
            userOperation.maxFeePerGas,
            userOperation.maxPriorityFeePerGas,
            userOperation.paymasterAndData,
          ]
        )
      );
      const signature = await signer.signMessage(ethers.arrayify(userOpHash));
      userOperation.signature = signature;

      const tx = await simpleAccountContract.executeUserOperation(
        userOperation
      );
      await tx.wait();

      console.log("Transaction executed successfully");
      alert("Transaction executed successfully");
    } catch (error) {
      console.log("Error handling Execute Transaction:", error.message);
      alert(`Error handling Execute Transaction: ${error.message}`);
      throw error;
    }
  };

  const encodeCalldata = (functionName, params, abi) => {
    const contractInterface = new ethers.utils.Interface(abi);
    return contractInterface.encodeFunctionData(functionName, params);
  };

  const handleEncodeCalldata = () => {
    const abi = [
      // Add your ABI here
      "function deposit(uint256 amount)",
    ];
    const params = [ethers.utils.parseUnits(value, 18)];
    const encodedCalldata = encodeCalldata(functionName, params, abi);
    setCalldata(encodedCalldata);
  };

  return (
    <>
      <header className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">
        <h1 className="text-2xl font-bold">Web3 Wallet Manager</h1>
        <button className="rounded-md bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600">
          <w3m-button />
        </button>
      </header>
      {isConnected ? (
        <main className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
          <section className="rounded-md bg-gray-800 p-6 text-white">
            <h2 className="mb-4 text-2xl font-bold">Admin</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  SimpleAccountDeployer
                </h3>
                <div className="space-y-2">
                  <div>
                    <label
                      className="block font-medium"
                      htmlFor="deployAddress"
                    >
                      Address
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="deployAddress"
                      type="text"
                      value={deployAddress}
                      onChange={(e) => setDeployAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-medium" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    className="rounded-md bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600"
                    onClick={handleDeploy}
                  >
                    Deploy Account
                  </button>
                  <div>
                    <label className="block font-medium" htmlFor="lastAddress">
                      Last Created Address
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="lastAddress"
                      readOnly
                      type="text"
                      value={simpleAccountAddress}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-md bg-gray-800 p-6 text-white">
            <h2 className="mb-4 text-2xl font-bold">User</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-bold">SimpleAccount</h3>
                <div className="space-y-2">
                  <div>
                    <label
                      className="block font-medium"
                      htmlFor="transferAddress"
                    >
                      Transfer To
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="transferAddress"
                      type="text"
                      value={destAddress}
                      onChange={(e) => setDestAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-medium"
                      htmlFor="transferAmount"
                    >
                      Amount
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="transferAmount"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                  <button
                    className="rounded-md bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600"
                    onClick={handleTransfer}
                  >
                    Transfer
                  </button>
                  <div>
                    <label className="block font-medium" htmlFor="balance">
                      Balance
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="balance"
                      readOnly
                      type="text"
                      value={simpleAccountBalance}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">Execute Transaction</h3>
                <div className="space-y-2">
                  <div>
                    <label
                      className="block font-medium"
                      htmlFor="targetAddress"
                    >
                      Target Address
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="targetAddress"
                      type="text"
                      value={targetAddress}
                      onChange={(e) => setTargetAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-medium" htmlFor="value">
                      Value (ETH)
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-medium" htmlFor="functionName">
                      Function Name
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="functionName"
                      type="text"
                      value={functionName}
                      onChange={(e) => setFunctionName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-medium" htmlFor="params">
                      Parameters (comma-separated)
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                      id="params"
                      type="text"
                      value={params.join(",")}
                      onChange={(e) => setParams(e.target.value.split(","))}
                    />
                  </div>
                  <button
                    className="rounded-md bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600"
                    onClick={handleEncodeCalldata}
                  >
                    Encode Calldata
                  </button>
                  <button
                    className="rounded-md bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600"
                    onClick={handleExecuteTransaction}
                  >
                    Execute Transaction
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl font-bold">Connect your wallet to continue</p>
        </div>
      )}
    </>
  );
}