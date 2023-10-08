import React, {useEffect, useState} from 'react';
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Group,
    Image,
    LoadingOverlay,
    Modal,
    NumberInput,
    Spoiler,
    Text,
    Tooltip,
    TypographyStylesProvider
} from "@mantine/core";
import Web3 from "web3";
import {useSelector} from "react-redux";
import {CheckIcon, CubeIcon, LightningBoltIcon, PersonIcon} from "@modulz/radix-icons";
import {showNotification, useNotifications} from "@mantine/notifications";
import {ABI} from "../contract/abi";
import {CONTRACT_ADDRESS, CHAIN_RPC, NATIVE_TOKEN_TICKER, CHAIN_NAME, defaultChainId} from "../utils/config";

function ProjectCard({project, loadBlockchainData}) {
    const {chainId, walletAddress} = useSelector((state) => state);
    const [opened, setOpened] = useState(false);
    const [value, setValue] = useState(0.00001);
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false)
    const [projectDetails, setProjectDetails] = useState({})

    const checkStatus = parseInt(project['collectedAmount']) >= parseInt(project['needToCollect'])

    const donateToProject = async () => {
        setLoading(true)
        try {
            let tipAmount = window.web3.utils.toWei(value.toString(), 'Ether')
            const web3 = new Web3(CHAIN_RPC)
            const myContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS)
            const encodedDate = await myContract.methods.donateToProject(project['id']).encodeABI()

            const params = {
                from: walletAddress,
                to: CONTRACT_ADDRESS,
                value: tipAmount,
                data: encodedDate
            };
            await window.ethereum.enable();
            window.web3 = new Web3(window.ethereum);

            await window.web3.eth.sendTransaction(params)
                .then((sendHash) => {
                    setOpened(false)
                    setLoading(false)
                    loadBlockchainData()
                })
        } catch (e) {
            setLoading(false)
        }
    }

    const handlerOpenModal = () => {
        if (!walletAddress) {
            showNotification({
                title: 'Wallet not detected',
                message: 'Please connect Wallet!',
                color: 'red'
            })
        } else if(walletAddress && chainId !== defaultChainId) {
            showNotification({
                title: 'Wrong Network',
                message: `Please connect to ${CHAIN_NAME} Network!`,
                color: 'red'
            })
        } else {
            setOpened(true)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('https://hbd.infura-ipfs.io/ipfs/' + project[1]);
            const json = await data.json();
            setProjectDetails(json)
        }
        fetchData()
    }, [project])

    return (
        <TypographyStylesProvider>
            <Card shadow="sm" padding="lg">
                <Card.Section>
                    <Image src={'https://hbd.infura-ipfs.io/ipfs/' + projectDetails?.image} height={200} alt=""/>
                </Card.Section>

                <Group position="apart" style={{marginBottom: 5, marginTop: '13px'}}>
                    <Group>
                        <Tooltip label={checkStatus ? 'Completed' : 'In Progress'} position="bottom" placement="center"
                                 gutter={10}>
                            {checkStatus
                                ? <ActionIcon size={24} mr={5} color="green" radius="xl" variant="filled">
                                    <CheckIcon size={24} mr={5}/>
                                </ActionIcon>
                                : <ActionIcon size={24} mr={5} color="orange" radius="xl" variant="filled">
                                    <LightningBoltIcon size={24} mr={5}/>
                                </ActionIcon>
                            }
                        </Tooltip>
                        <Badge size="lg" color="yellow" variant="light" leftSection={<CubeIcon/>}>
                            Collected: {project['collectedAmount'] / (10 ** 18)} / {(project['needToCollect'] / (10 ** 18)) + ' ' + NATIVE_TOKEN_TICKER}
                        </Badge>
                    </Group>
                    <Tooltip label={project['author']} position="bottom" placement="center" gutter={10}>
                        <Badge size="lg" color="teal" leftSection={<PersonIcon/>}>
                            {project['author'].substring(0, 9) + "..." + project['author'].substring(project['author'].length - 9)}
                        </Badge>
                    </Tooltip>
                </Group>
                <Group position={'center'}>
                    <Text size="xl" weight={700}>{projectDetails?.title}</Text>
                </Group>
                <Box position="apart" style={{marginBottom: 5}}>
                    <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
                        <TypographyStylesProvider>
                            <Text weight={500}>{projectDetails?.description}</Text>
                        </TypographyStylesProvider>
                    </Spoiler>
                </Box>

                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    centered
                >
                    <LoadingOverlay visible={loading}/>
                    <NumberInput
                        defaultValue={0.00001}
                        placeholder="Enter donate value"
                        label="Donate amount"
                        required
                        mb={'15px'}
                        precision={5}
                        min={0.00001}
                        value={value}
                        decimalSeparator=","
                        onChange={(val) => setValue(val)}
                    />
                    <Button fullWidth onClick={donateToProject}>Send</Button>
                </Modal>
                <Button onClick={handlerOpenModal} variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                    Donate
                </Button>
            </Card>
        </TypographyStylesProvider>
    );
}

export default ProjectCard;
