type Notification = {
  id: number;
  payload:
    | {
        type: 'submitting';
        taskId: string;
        taskName: string;
      }
    | {
        type: 'submitted';
        submissionId: number;
      }
    | {
        type: 'receivedResults';
        submissionId: number;
        points: number;
        status: string[];
      };
};

export default Notification;
