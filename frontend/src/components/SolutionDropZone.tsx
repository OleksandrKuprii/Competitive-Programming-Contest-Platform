import * as React from 'react';
import Dropzone from 'react-dropzone'
import { Jumbotron, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';

const SolutionDropZone = () => {
    const { t } = useTranslation();

    const [dragEntered, setDragEntered] = React.useState(false);

    const updateFile = useStoreActions((actions: any) => actions.submissionFile.updateFile)
    const cancel = useStoreActions((actions: any) => actions.submissionFile.cancel)
    const file = useStoreState((state: any) => state.submissionFile.file)

    return (
        <Dropzone multiple={false} disabled={file !== null}
            onDropAccepted={(files) => {setDragEntered(false); updateFile(files[0])}}
            onDragEnter={() => setDragEntered(true)}
            onDragLeave={() => setDragEntered(false)}>
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                    <input {...getInputProps()} />

                    <Jumbotron style={dragEntered ? { backgroundColor: '#79808c', color: 'white', fontWeight: 'bold' } : undefined}>
                        {file === null ? t('taskpage.dropfilehere') :
                            <>
                                <p className="h3">{file.name}</p>

                                <ButtonGroup aria-label="Basic example">
                                    <Button variant="primary">OK</Button>
                                    <Button variant="secondary" onClick={cancel}>Cancel</Button>
                                </ButtonGroup>
                            </>
                        }
                    </Jumbotron>
                </div>
            )
            }
        </Dropzone >
    )
}

export default SolutionDropZone;