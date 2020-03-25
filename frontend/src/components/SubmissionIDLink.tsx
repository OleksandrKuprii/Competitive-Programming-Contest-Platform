import * as React from 'react';
import { Link } from 'react-router-dom';

export interface SubmissionIDLinkArgs {
  id: number
}

const SubmissionIDLink = ({ id }: SubmissionIDLinkArgs) => (
  <Link to={`/submission/view/${id}`} style={{ color: 'white' }}>
    {id}
  </Link>
);

export default SubmissionIDLink;
