// page.tsx - Page template

import * as React from 'react';
import {FC, ReactNode} from 'react';

import WideBox from '@/atoms/wideBox';

import ContextualPageActions from "@/organisms/contextualPageActions";
import ContextualPageHeading from "@/organisms/contextualPageHeading";
import {Padding} from "~/mixins/padding";
import Spacer from "@/atoms/spacer";

interface PageProps {
  children: ReactNode;
}


const Page: FC<PageProps> = ({children}) =>
  (
    <>
      <div style={{ position: 'fixed' }}>
        <ContextualPageHeading/>
        <ContextualPageActions/>
      </div>

      <Spacer top={(53 + 59 + Padding.Large) as Padding} />

      <WideBox>
        {children}
      </WideBox>
    </>
  )

export default Page;
