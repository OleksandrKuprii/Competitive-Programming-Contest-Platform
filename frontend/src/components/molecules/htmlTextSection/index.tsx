import * as React from 'react';
import { FC } from 'react';
import { Parser as HtmlToReactParser } from 'html-to-react';
import { Text, Subtitle, FontWeight } from '@/atoms/typography';
import styled from 'styled-components';

export interface HtmlTextSectionProps {
  text: string;
  header: string;
}

const htmlToReactParser = new HtmlToReactParser();

const SectionContainer = styled(Text)`
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
      {header && <Subtitle weight={FontWeight.Bold}>{header}</Subtitle>}
      <SectionContainer>{parsed}</SectionContainer>
    </>
  );
};

export default React.memo(HtmlTextSection);
