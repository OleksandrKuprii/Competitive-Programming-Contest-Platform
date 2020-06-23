import * as React from 'react';
import { FC } from 'react';
import { Parser as HtmlToReactParser } from 'html-to-react';
import { Text, Subtitle, FontWeight } from '@/atoms/typography';
import styled from 'styled-components';
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";

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
    <div style={{ width: '30vw', margin: '0 auto' }}>
      <Spacer top={Padding.Normal} />
      {header && <Subtitle>{header}</Subtitle>}
      <Spacer top={Padding.Normal} />
      <SectionContainer>{parsed}</SectionContainer>
    </div>
  );
};

export default React.memo(HtmlTextSection);
