import * as React from 'react';
import { FC } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Box from '@/toucanui/atoms/box';

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
    <Box>
      <SyntaxHighlighter
        language={languageTransformations[language] || language}
        style={theme || tomorrowNight}
        showLineNumbers
        customStyle={{
          maxHeight: maxHeight || 500,
          width: '100%',
          margin: 0,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </Box>
  );
};

export default React.memo(CodeViewer);
