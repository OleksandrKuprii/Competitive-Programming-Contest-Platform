import * as React from 'react';
import { FC } from 'react';
import { Parser as HtmlToReactParser } from 'html-to-react';
import { Paragraph, Subtitle } from '@/atoms/typography';

export interface HtmlTextSectionProps {
  text: string;
  header: string;
}

const htmlToReactParser = new HtmlToReactParser();

const HtmlTextSection: FC<HtmlTextSectionProps> = ({ header, text }) => {
  const parsed = htmlToReactParser.parse(text);

  return (
    <>
      {header && <Subtitle>{header}</Subtitle>}
      <Paragraph>{parsed}</Paragraph>
    </>
  );
};

export default React.memo(HtmlTextSection);
