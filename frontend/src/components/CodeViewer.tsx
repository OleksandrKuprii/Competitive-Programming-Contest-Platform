import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeViewer = ({ code, language }: { code: string, language: string }) => (
  <SyntaxHighlighter language={language} style={tomorrowNight} showLineNumbers>
    {code}
  </SyntaxHighlighter>
);

export default CodeViewer;
