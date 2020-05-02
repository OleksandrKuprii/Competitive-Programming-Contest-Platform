import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import getGeneralLanguageName from '../../utils/getGeneralLanguageName';

const SubmissionCodeViewer = ({
  code,
  language,
}: {
  code: string;
  language: string;
}) => (
  <SyntaxHighlighter
    language={getGeneralLanguageName(language)}
    style={tomorrowNight}
    showLineNumbers
    customStyle={{ maxHeight: 500, width: '100%', borderRadius: 3 }}
  >
    {code}
  </SyntaxHighlighter>
);

export default React.memo(SubmissionCodeViewer);
