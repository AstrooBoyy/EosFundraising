import React, {useEffect, useState} from 'react';
import {useForm} from '@mantine/form';
import {
    Alert,
    Button,
    Group,
    Image,
    LoadingOverlay,
    NumberInput,
    Paper,
    Space,
    Textarea,
    TextInput,
} from '@mantine/core';
import DropzoneArea from "./dropzone-area";
import Web3 from 'web3';
import {useSelector} from "react-redux";
import {CHAIN_RPC, CONTRACT_ADDRESS} from "../utils/config"
import {ABI} from "../contract/abi";
import {ThirdwebStorage} from "@thirdweb-dev/storage";
import {useStorageUpload} from "@thirdweb-dev/react";


export function AddPostForm({handlerCloseModal}) {
    const { mutateAsync: upload } = useStorageUpload();

    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [buffer, setBuffer] = useState(null)
    const [imageError, setImageError] = useState(false)
    const {walletAddress} = useSelector((state) => state);

    const createProject = async () => {
        try {
            setLoading(true)
            const imageFile = new File([
                new Blob([buffer])
            ], "projectImage");
            let imgcid = null
            try {
                imgcid = (await upload({
                    data: [imageFile],
                    options: {uploadWithGatewayUrl: false, uploadWithoutDirectory: true},
                }))[0].replace("ipfs://", "");
            } catch (e) {
                console.log(e)
            }
            let needToCollect = window.web3.utils.toWei(form.values.needToCollect.toString(), 'Ether')
            const infoObject = {
                title: form.values.title,
                description: form.values.description,
                image: imgcid,
                creator: walletAddress,
                needToCollect: form.values.needToCollect.toString()
            }
            let infoCid = (await upload({
                data: [infoObject],
                options: {uploadWithGatewayUrl: false, uploadWithoutDirectory: true},
            }))[0].replace("ipfs://", "");

            const web3 = new Web3(CHAIN_RPC)
            const myContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS)
            const encodedDate = await myContract.methods.uploadProject(infoCid, needToCollect).encodeABI()

            const params = {
                from: walletAddress,
                to: CONTRACT_ADDRESS,
                data: encodedDate,
            };

            await window.ethereum.enable();
            window.web3 = new Web3(window.ethereum);

            await window.web3.eth.sendTransaction(params).then(() => {
                handlerCloseModal()
            })
        } catch (e) {
            setLoading(false)
        }
    }

    const form = useForm({
        initialValues: {
            description: '',
            title: '',
            needToCollect: 0.00001
        },
        validationRules: {
            description: (value) => value.trim().length >= 2,
            title: (value) => value.trim().length >= 2,
            needToCollect: (value) => value > 0,
        },
        errorMessages: {
            description: 'Description should contain minimum 2 character.',
            title: 'Title should contain minimum 2 character.',
            needToCollect: 'Amount to collect should by greater than 0!',
        },
    });

    useEffect(() => {
        if (buffer)
            setImageError(false)
    }, [buffer])

    const handleSubmit = () => {
        if (buffer === null || buffer === undefined) {
            setImageError(true)
        }
        createProject()
    };

    return (
        <Paper
            padding={'lg'}
            sx={(theme) => ({
                position: 'relative',
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            })}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <LoadingOverlay visible={loading}/>
                <TextInput
                    mt="md"
                    required
                    placeholder="Title"
                    label="Title"
                    {...form.getInputProps('title')}
                />
                <Textarea
                    mt="md"
                    placeholder="Description"
                    label="Description"
                    autosize
                    minRows={2}
                    maxRows={4}
                    {...form.getInputProps('description')}
                />
                <NumberInput
                    mt="md"
                    defaultValue={0.00001}
                    placeholder="NeedToCollect"
                    label="Need to collect"
                    required
                    decimalSeparator=","
                    min={0.00001}
                    precision={5}
                    {...form.getInputProps('needToCollect')}
                />
                <Space h={'lg'}/>
                <DropzoneArea file={file} setFile={setFile} buffer={buffer} setBuffer={setBuffer}/>
                <Space h={'lg'}/>
                {file &&
                    <Image
                        radius="md"
                        height={150}
                        alt={`file preview`}
                        src={URL.createObjectURL(file)}
                    />
                }
                {imageError &&
                    <Alert color="red">
                        Please select a image!
                    </Alert>
                }
                <Space h={'lg'}/>
                <Group position="center" mt="xl">
                    <Button color="blue" type="submit">
                        Save
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
