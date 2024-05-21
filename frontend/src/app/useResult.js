"use client"
import { getSimpleAccountDeployerContract } from "@/constants/contracts";
import {readOnlyProvider } from "@/constants/providers";
import {useEffect, useState } from "react";
import useHandleDeploy from "./useHandleDeploy";


const useResult = (add, pass) => {
  const [account, setAccount] = useState();
    const fetch = useHandleDeploy(add, pass)
  useEffect(() => {
    const contract = getSimpleAccountDeployerContract(readOnlyProvider);

    contract
      .getAddress(add, pass)
      .then((res) => {
        console.log("RESULTTTTT ", res);
        setAccount(res);
      })
      .catch((err) => {
        console.error("error fetching DEPLOYED: ", err);
        setAccount("");
      });
  }, [fetch]);

  return account;
};

export default useResult;