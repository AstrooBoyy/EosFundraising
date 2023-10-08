import React, {useEffect} from "react";
import {CONNECTID, connectWeb3Modal, disconnectWeb3Modal} from "../connectors/web3-modal";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../store/actions";
import {Box, Button} from "@mantine/core";

export default function ConnectWalletButton() {
    const {walletAddress, chainId} = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem(CONNECTID)) {
            connectWeb3Modal();
        }
    }, [chainId]);

    const connect = () => {
        connectWeb3Modal();
    };

    const logoutAction = () => {
        dispatch(logout());
        disconnectWeb3Modal();
    };

    return (
        <Box>
            {!walletAddress
                ? <Button onClick={() => connect()}>
                    Connect Wallet
                </Button>
                : <Button onClick={() => logoutAction()}>
                    Disconnect Wallet
                </Button>
            }
        </Box>
    );
}
