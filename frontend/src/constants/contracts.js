import { ethers } from "ethers";
import simpleAccountABI from "./SimpleAccountABI.json";
import simpleAccountDeployerABI from "./SimpleAccountDeployerABI.json";

export const getSimpleAccountContract = (providerOrSigner, simpleAccountAddress) =>
  new ethers.Contract(simpleAccountAddress, simpleAccountABI, providerOrSigner);

export const getSimpleAccountDeployerContract = (providerOrSigner) =>
  new ethers.Contract(
    process.env.NEXT_PUBLIC_SIMPLE_ACCOUNT_DEPLOYER,
    simpleAccountDeployerABI,
    providerOrSigner
  );
