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
      {header ? <p className="h6 font-weight-bold m-0">{header}</p> : undefined}
      <div className="task-description-section">{parsed}</div>
    </>
  );
};

export default TaskDescriptionSection;
