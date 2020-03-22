import * as React from 'react';
import {useDropzone} from 'react-dropzone'

const SolutionDropZone = () => {
    const onDrop = React.useCallback(acceptedFiles => {
        console.log('Hello')
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default SolutionDropZone;