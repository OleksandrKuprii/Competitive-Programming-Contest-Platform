import * as React from 'react';
import { FC } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneLight, tomorrowNight} from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeViewerProps {
  children: string;
  language: string;
}

const languageTransformations: { [index: string]: string } = {
  python3: 'python',
  python2: 'python',
};

const CodeViewer: FC<CodeViewerProps> = ({
  children,
  language,
}) => {
  return (
    <SyntaxHighlighter
      language={languageTransformations[language] || language}
      style={tomorrowNight}
      showLineNumbers
      customStyle={{
        height: '100%',
        width: '100%',
        margin: 0,
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default React.memo(CodeViewer);
