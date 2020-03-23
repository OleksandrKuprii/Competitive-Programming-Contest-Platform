import { Submission } from '../components/SubmissionList';

export default function (submissions: Array<Submission>, taskAlias: string) {
  const submissionsClone: Array<Submission> = [...submissions];

  submissionsClone.sort((a, b) => {
    if (a.points == null) {
      return 1;
    }

    if (b.points == null) {
      return -1;
    }

    return (a.points > b.points ? -1 : 1);
  });

  return submissionsClone.find(
    (submission) => submission.taskAlias === taskAlias,
  );
}
