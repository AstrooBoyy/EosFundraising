import React, {useEffect} from 'react';
import Home from "./components/home";
import {AppShell, Avatar, Badge, Container, Group, Header, MediaQuery, Tooltip, useMantineTheme} from "@mantine/core";
import ConnectWalletButton from "./components/connect-wallet-button";
import {useSelector} from "react-redux";
import {connectWeb3Modal} from "./connectors/web3-modal";
import unstopLogo from './assets/unstoppable.ico';
import {ThirdwebProvider} from "@thirdweb-dev/react";

function App() {
    const theme = useMantineTheme();
    const {user, walletAddress, shortAddress} = useSelector((state) => state);

    useEffect(() => {
        ;(async () => {
            await connectWeb3Modal()
        })()
    }, [])

    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[1];

    return (
        <AppShell navbarOffsetBreakpoint="sm" fixed style={{background: secondaryColor}} header={
            <Header height={60} padding="md">
                <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                    <Container style={{width: '100%'}}>
                        <Group position="apart">
                            {(user || shortAddress)
                                ? <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
                                    <Tooltip label={walletAddress} position="bottom">
                                        <Badge style={{fontSize: '13px'}}> {user
                                            ? <div style={{display: 'flex', textTransform: 'none'}}>
                                                <img alt="unstop" width={"20px"}
                                                     style={{marginRight: '10px', borderRadius: '5px'}}
                                                     src={unstopLogo}/>
                                                {user.sub}
                                                <span style={{marginLeft: '10px'}}>[{shortAddress}]</span>
                                            </div>
                                            : shortAddress}
                                        </Badge>
                                    </Tooltip>
                                </MediaQuery>
                                : <Group>
                                    <Badge size="xl" color="gray" style={{textTransform: 'none'}}>
                                        No connected wallet
                                    </Badge></Group>
                            }
                            <Group>
                                <ConnectWalletButton/>
                                {shortAddress &&
                                    <Avatar/>
                                }
                            </Group>
                        </Group>
                    </Container>
                </div>
            </Header>
        }>
            <ThirdwebProvider clientId={"5102b2da53f1945f70c13507fb29badd"}>
                <Container style={{maxWidth: '95%', minHeight: '90vh'}}>
                    <Home/>
                </Container>
            </ThirdwebProvider>
        </AppShell>
    );
}

export default App;
