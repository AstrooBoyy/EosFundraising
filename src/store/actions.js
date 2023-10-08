import ActionTypes from "./types";


export const setWeb3 = (web3) => async (dispatch) => {
    dispatch({ type: ActionTypes.SET_WEB3, web3 });
};

export const logout = () => (dispatch) => {
    dispatch({ type: ActionTypes.LOGOUT });
};

export const setChainId = (chainId) => async (dispatch) => {
    localStorage.setItem('chainId', chainId);
    dispatch({ type: ActionTypes.SET_CHAINID, chainId });
};

export const setUser = (user) => async (dispatch) => {
    dispatch({ type: ActionTypes.SET_USER, user });
};

export const setAddress = (walletAddress) => async (dispatch) => {
    if (walletAddress !== null) {
        let shortAddress = `${walletAddress.slice(0, 7)}...${walletAddress.slice(
            walletAddress.length - 7,
            walletAddress.length
        )}`;

        dispatch({
            type: ActionTypes.SET_ADDRESS,
            walletAddress,
            shortAddress,
        });
    }
};
