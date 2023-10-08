import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {setChainId, setWeb3} from '../store/actions';
import store from '../store';
import {CHAIN_NAME, CHAIN_RPC, CONTRACT_ADDRESS, defaultChainId} from "../utils/config"
import {networkDefault, web3List} from '../utils/web3-list';
import {Badge, Box, Button, Container, Group, Modal, SimpleGrid, Text} from "@mantine/core";
import ProjectCard from "./project-card";
import {AddPostForm} from "./add-post-form";
import Web3 from "web3";
import {PersonIcon, PlusIcon} from "@modulz/radix-icons";
import {showNotification, useNotifications} from "@mantine/notifications";
import {ABI} from "../contract/abi";

const Home = () => {
    const {chainId, web3, walletAddress, shortAddress} = useSelector((state) => state);
    const [opened, setOpened] = useState(false);
    const [dataIsLoading, setDataIsLoading] = useState(true);
    const [errorGettingData, setErrorGettingData] = useState(false);
    const [projects, setProjects] = useState([])
    const notifications = useNotifications();

    useEffect(() => {
        loadWeb3()
        loadBlockchainData()
    }, [])

    useEffect(() => {
        const setWeb3Default = async () => {
            await store.dispatch(setWeb3(web3List(networkDefault).web3Default));
            await store.dispatch(setChainId(networkDefault));
        };
        if (!web3 || !chainId) {
            setWeb3Default();
        }
    }, [web3, chainId]);

    useEffect(() => {
        if (walletAddress && chainId !== defaultChainId) {
            showNotification({
                title: 'Wrong Network',
                message: `Please connect to ${CHAIN_NAME} Network!`,
                color: 'red'
            })
        }
    }, [walletAddress]);

    useEffect(() => {
        if (walletAddress && chainId !== defaultChainId) {
            showNotification({
                title: 'Wrong Network',
                message: `Please connect to ${CHAIN_NAME} Network!`,
                color: 'red'
            })
        }
    }, [chainId]);

    const loadBlockchainData = async () => {
        try {
            setErrorGettingData(false)
            const web3 = new Web3(CHAIN_RPC)
            const myContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS)
            const projectCount = await myContract.methods.projectCount().call()
            setProjects([])
            for (let i = 1; i <= projectCount; i++) {
                const project = await myContract.methods.projects(i).call()
                console.log(project.id)
                setProjects(projects => [...projects, project])
            }
            setProjects(projects => projects.reverse())
            setDataIsLoading(false)
        } catch (e) {
            console.log(e)
            setErrorGettingData(true)
            setDataIsLoading(false)
        }
    }

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
    }

    const handlerCloseModalForCreate = () => {
        setOpened(false)
        setDataIsLoading(true)
        loadBlockchainData()
    }

    const handlerOpenCreateModal = () => {
        if (!walletAddress) {
            showNotification({
                title: 'Wallet not detected',
                message: 'Please connect Wallet!',
                color: 'red'
            })
        } else if (walletAddress && chainId !== defaultChainId) {
            showNotification({
                title: 'Wrong Network',
                message: `Please connect to ${CHAIN_NAME} Network!`,
                color: 'red'
            })
        } else {
            setOpened(true)
        }
    }

    return (
        <Container>
            <Modal
                centered
                opened={opened}
                onClose={() => setOpened(false)}
            >
                <AddPostForm handlerCloseModal={handlerCloseModalForCreate}/>
            </Modal>
            {shortAddress
                ? <Group position="right" mb={'xl'}>
                    <Button variant="light" onClick={handlerOpenCreateModal} leftIcon={<PlusIcon/>}>
                        Add new project
                    </Button>
                </Group>
                : <div style={{textAlign: "center", marginBottom: "30px"}}>
                    <Badge size="xl" color="orange" style={{textTransform: 'none'}}>
                        To add a new campaign, connect your wallet
                    </Badge>
                </div>
            }

            <SimpleGrid>
                {errorGettingData
                    ? <Text size="md" weight={500} color={"red"}>
                        <center>Error getting blockchain data</center>
                    </Text>
                    : dataIsLoading
                        ? <Text size="xl" weight={400}>
                            <center>Loading data...</center>
                        </Text>
                        : projects.length === 0
                            ? <Text size="xl" weight={400}>
                                <center>No projects</center>
                            </Text>
                            : projects.map((item, index) => {
                                    return (
                                        <Box key={item + '' + index}>
                                            <ProjectCard loadBlockchainData={loadBlockchainData} project={item}/>
                                        </Box>
                                    )
                                }
                            )

                }

            </SimpleGrid>
        </Container>
    )
}

export default Home
