// page.tsx - Page template

import * as React from 'react';
import {FC, ReactNode} from 'react';

import WideBox from '@/atoms/wideBox';

import ContextualPageActions from "@/organisms/contextualPageActions";
import ContextualPageHeading from "@/organisms/contextualPageHeading";
import {Padding} from "~/mixins/padding";
import Spacer from "@/atoms/spacer";
import Fade from "@/animations/fade";
import Box from "@/atoms/box";

interface PageProps {
  children: ReactNode;
}


const Page: FC<PageProps> = ({children}) =>
  (
    <>
      <div>
        <ContextualPageHeading/>
        <ContextualPageActions/>
      </div>

      <WideBox style={{maxHeight: 'calc(100vh - 53px - 59px)'}}>
        <Fade in>
          <Box padding={Padding.Large} style={{ minHeight: 'calc(100vh - 53px - 59px)' }}>
            {children}
          </Box>
        </Fade>
      </WideBox>
    </>
  )

export default Page;
