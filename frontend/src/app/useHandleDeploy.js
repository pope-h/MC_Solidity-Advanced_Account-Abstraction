"use client"
import { getSimpleAccountDeployerContract } from "@/constants/contracts";
import { getProvider } from "@/constants/providers";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useCallback, useState } from "react";

const useHandleDeploy = () => {
    const [fr, setFr] = useState();

    const { walletProvider } = useWeb3ModalProvider();
    return useCallback(
      async (add, pass) => {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract1 = getSimpleAccountDeployerContract(signer);
        try {
          const tx = await contract1.deployAccount(add, pass);
          await tx.wait();
          console.log("transaction: ", tx);
          const receipt1 = await tx.wait();
          console.log("receipt: ", receipt1);
          if (receipt1.status) {
             alert(
                 `deployed account successfully`
               );
              
              // contract
              //   .getAddress(add, pass)
              //   .then((getSimpleAccountAddress) => {
              //     console.log(
              //       "getSimpleAccountAddress",
              //       getSimpleAccountAddress
              //     );
              //   })
              //   .catch((err) => {
              //     console.error("error fetching deployed address: ", err);
              //   });
          
          }
        } catch (error) {
          console.log("Error handling SimpleAccountDeployer:", error.message);
          alert(`Error handling SimpleAccountDeployer: ${error.message}`);
          throw error;
        }
      },
      [walletProvider]
    );
}

export default useHandleDeploy;