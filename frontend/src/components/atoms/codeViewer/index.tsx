import * as React from 'react';
import { FC } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeViewerProps {
  children: string;
  language: string;
  theme?: any;
  maxHeight?: number;
}

const languageTransformations: { [index: string]: string } = {
  python3: 'python',
  python2: 'python',
};

const CodeViewer: FC<CodeViewerProps> = ({
  children,
  language,
  theme,
  maxHeight,
}) => {
  return (
    <SyntaxHighlighter
      language={languageTransformations[language] || language}
      style={theme || tomorrowNight}
      showLineNumbers
      customStyle={{
        maxHeight: maxHeight || 500,
        width: '100%',
        boxShadow: '2px 2px 2px 2px #000',
        margin: 0,
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default React.memo(CodeViewer);
