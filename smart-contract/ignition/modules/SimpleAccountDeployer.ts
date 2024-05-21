import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleAccountDeployerModule = buildModule("SimpleAccountDeployerModule", (m) => {

  const simpleAccountDeployer = m.contract("SimpleAccountDeployer");

  return { simpleAccountDeployer };
});

export default SimpleAccountDeployerModule;
