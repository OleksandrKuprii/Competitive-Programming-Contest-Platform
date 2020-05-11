import * as React from 'react';
import { FC } from 'react';
import { Parser as HtmlToReactParser } from 'html-to-react';
import { Paragraph, Subtitle } from '@/atoms/typography';
import styled from 'styled-components';

export interface HtmlTextSectionProps {
  text: string;
  header: string;
}

const htmlToReactParser = new HtmlToReactParser();

const SectionContainer = styled(Paragraph)`
  * {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
    padding-left: 1em;
  }
`;

const HtmlTextSection: FC<HtmlTextSectionProps> = ({ header, text }) => {
  const parsed = htmlToReactParser.parse(text);

  return (
    <>
      {header && <Subtitle semiBold>{header}</Subtitle>}
      <SectionContainer>{parsed}</SectionContainer>
    </>
  );
};

export default React.memo(HtmlTextSection);
