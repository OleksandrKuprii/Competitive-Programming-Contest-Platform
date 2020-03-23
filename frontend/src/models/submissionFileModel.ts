import { action } from "easy-peasy";


const submissionFileModel = {
    file: null,

    updateFile: action((state: any, payload) => ({
        file: payload
    })),

    cancel: action((state: any, payload) => ({
        file: null
    }))
}

export default submissionFileModel;