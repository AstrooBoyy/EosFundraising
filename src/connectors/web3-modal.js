import Web3 from "web3";
import Web3Modal from "web3modal";
import {setAddress, setChainId, setUser, setWeb3,} from "../store/actions";
import store from "../store";
import * as UAuthWeb3Modal from '@uauth/web3modal'
import UAuthSPA from '@uauth/js'
import {UNST_APP_ID, UNST_APP_REDIRECT_URL} from "../utils/config";

export const CONNECTID = 'WEB3_CONNECT_CACHED_PROVIDER';

const rpcSupport = {
    17777: 'https://api.evm.eosnetwork.com/',
};

export const uauthOptions = {
    clientID: UNST_APP_ID,
    redirectUri: UNST_APP_REDIRECT_URL,
    scope: "openid wallet email:optional"
}


const providerOptions = {
    walletconnect: {
        options: {
            rpc: rpcSupport,
        },
    },
};

export const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
});

UAuthWeb3Modal.registerWeb3Modal(web3Modal)

export const disconnectWeb3Modal = async () => {
    localStorage.removeItem(CONNECTID);
    web3Modal.clearCachedProvider();
};

export const connectWeb3Modal = async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    let chainID = await web3.eth.net.getId();

    let accounts = await web3.eth.getAccounts();

    store.dispatch(setChainId(chainID));
    store.dispatch(setWeb3(web3));

    if (accounts.length > 0)
        store.dispatch(setAddress(accounts[0]));

    if (web3Modal.cachedProvider === "custom-uauth") {
        const {package: uauthPackage, options: uauthOptions} = providerOptions["custom-uauth"];
        await UAuthWeb3Modal.getUAuth(uauthPackage, uauthOptions).user()
            .then((user) => {
                store.dispatch(setUser(user));
            })
    }

    provider.on('connect', (info) => {
        console.log(info);
    });

    provider.on('disconnect', (error) => {
        console.log(error);
        store.dispatch(setAddress(null));
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
        localStorage.removeItem('username')
        localStorage.removeItem('request')
        localStorage.removeItem('uauth-default-username')
    });

    provider.on('accountsChanged', async (accounts) => {
        store.dispatch(setAddress(accounts[0]));
    });

    provider.on('chainChanged', async (chainID) => {
        chainID = parseInt(web3.utils.hexToNumber(chainID));
        store.dispatch(setChainId(chainID));
        store.dispatch(setWeb3(web3));
    });
};
