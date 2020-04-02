import baseURL from './apiBaseURL';

interface FetchTasksUrlParams {
  number: number,
  offset: number,
}

interface FetchTaskUrlParams {
  alias: string
}

interface FetchSubmissionsUrlParams {
  number: number,
  offset: number,
}

interface FetchSubmissionUrlParams {
  id: number
}

const fetchTasksUrlBuilder = ({ number, offset }: FetchTasksUrlParams) => (
  `${baseURL}/tasks?&number=${number}&offset=${offset}&user_id=1`
);

const fetchTaskUrlBuilder = ({ alias }: FetchTaskUrlParams) => (
  `${baseURL}/task/${alias}`
);

const fetchSubmissionsUrlBuilder = ({ number, offset }: FetchSubmissionsUrlParams) => (
  `${baseURL}/submissions?number=${number}&offset=${offset}&user_id=1`
);

const fetchSubmissionUrlBuilder = ({ id }: FetchSubmissionUrlParams) => (
  `${baseURL}/submission/${id}`
);

const z
