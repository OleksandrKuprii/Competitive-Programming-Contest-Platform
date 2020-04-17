import * as React from 'react';
import { Parser as HtmlToReactParser } from 'html-to-react';

export interface TaskDescriptionSectionArgs {
  text: string;
  header: string;
}

const TaskDescriptionSection = ({ header, text }: TaskDescriptionSectionArgs) => {
  const htmlToReactParser = new HtmlToReactParser();

  const parsed = htmlToReactParser.parse(text);

  return (
    <>
      <p className="h5 font-weight-bold">{header}</p>

      <blockquote>{parsed}</blockquote>
    </>
  );
};

export default TaskDescriptionSection;
