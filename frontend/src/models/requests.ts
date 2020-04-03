import baseURL from './apiBaseURL';

const fetchTasksUrlBuilder = (number: number, offset: number, auth: boolean) => (
  `${baseURL}/${auth ? 'tasks/auth' : 'tasks'}?&number=${number}&offset=${offset}&user_id=1`
);

const fetchTaskUrlBuilder = (alias: string) => (
  `${baseURL}/task/${alias}`
);

const fetchSubmissionsUrlBuilder = (number: number, offset: number) => (
  `${baseURL}/submissions?number=${number}&offset=${offset}&user_id=1`
);

const fetchSubmissionUrlBuilder = (id: number) => (
  `${baseURL}/submission/${id}`
);

const submitSubmissionUrlBuilder = () => (
  `${baseURL}/submission`
);

const buildFetch = (requestURL: string, token?: string, body?: object) => (
  fetch(requestURL, {
    method: body === undefined ? 'GET' : 'POST',
    headers: token === undefined ? {} : {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
);

export const fetchTasks = (token?: string) => (
  buildFetch(fetchTasksUrlBuilder(20, 0, token !== undefined), token)
);

export const fetchTask = (alias: string, token?: string) => (
  buildFetch(fetchTaskUrlBuilder(alias), token)
);

export const fetchSubmissions = (token?: string) => (
  buildFetch(fetchSubmissionsUrlBuilder(20, 0), token)
);

export const fetchSubmission = (id: number, token: string) => (
  buildFetch(fetchSubmissionUrlBuilder(id), token)
);

export const submitSubmission = (alias: string, lang: string, code: string, token: string) => (
  buildFetch(submitSubmissionUrlBuilder(), token, { alias, lang, code })
);
