import React from "react";
import {Group, Text, useMantineTheme} from '@mantine/core';
import {CrossCircledIcon, ImageIcon, UploadIcon} from '@modulz/radix-icons';
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
// import * as buffer from "buffer";
// window.Buffer = buffer.SlowBuffer;

function ImageUploadIcon({status, ...props}) {
    if (status.accepted) {
        return <UploadIcon {...props} />;
    }

    if (status.rejected) {
        return <CrossCircledIcon {...props} />;
    }

    return <ImageIcon {...props} />;
}


export default function DropzoneArea({file, setFile, buffer, setBuffer}) {
    const theme = useMantineTheme();

    const captureFile = (file) => {
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result))
        }
    }

    return (
        <Dropzone multiple={false}
                  onDrop={(file) => {
                      captureFile(file[0])
                      setFile(file[0])
                  }}
                  onReject={(files) => console.log('rejected files', files)}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
        >

            <Group position="center" spacing="xl" style={{minHeight: 220, pointerEvents: 'none'}}>

                <Dropzone.Accept>
                    <UploadIcon style={{width: 80, height: 80}}/>
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <CrossCircledIcon style={{width: 80, height: 80}}/>
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <ImageIcon style={{width: 80, height: 80}}/>
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Drag images here or click to select files
                    </Text>
                </div>
            </Group>

        </Dropzone>
    );
}
