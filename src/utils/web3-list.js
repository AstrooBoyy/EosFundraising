import Web3 from "web3";
import {defaultChainId} from "./config";
export const web3Default = {
    17777: {
        web3Default: new Web3(
            new Web3.providers.HttpProvider('https://api.evm.eosnetwork.com/')
        ),
        name: 'EOS EVM Mainnet',
        explorer: 'https://explorer.evm.eosnetwork.com/',
    },
};

export const web3List = (_chainId) => {
    return web3Default[_chainId];
};

export const networkDefault = (() => {
    const savedChainId = Number.parseInt(localStorage.getItem('chainId'));
    return savedChainId > 0 && web3Default[savedChainId] ? savedChainId : defaultChainId;
})();


