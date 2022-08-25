import axios from "axios";

class TransactionWatcher {
  constructor() {
    this.axios = axios.create();
  }

  async getAlgoPending(address) {
    const res = await this.axios(
      `https://node.algoexplorerapi.io/v2/accounts/${address}/transactions/pending`
    );

    console.log(res);
  }

  async getEvmChainId() {
    /*let provider = new ethers.providers.Web3Provider(window.ethereum);
      const res = await provider.waitForTransaction(
        "0x009611f3f2735beb72b70a70a44d0c6cac80796e2abcc3fd14bc2f2941d9a28a"
      );

      const contract = Bridge__factory.connect(
        "0x91105e661C500e6651f04CF76787297e534b97a5",
        provider
      );

      let actionId 

      for (const log of res.logs) {
        if (log.address != "0x91105e661C500e6651f04CF76787297e534b97a5")
          continue;

        const parsed = contract.interface.parseLog(log);

        actionId = parsed?.args?.actionId;
  }*/
  }
}

export default () => new TransactionWatcher();
