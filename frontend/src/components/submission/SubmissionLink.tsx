import * as React from 'react';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

export interface SubmissionLinkArgs {
  id: string
  children?: ReactNode
}

const SubmissionLink = ({ id, children }: SubmissionLinkArgs) => (
  <Link to={`/submission/view/${id}`}>
    {children === undefined ? id : children}
  </Link>
);

export default SubmissionLink;
