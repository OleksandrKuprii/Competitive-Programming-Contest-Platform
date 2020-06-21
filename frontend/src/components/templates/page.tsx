// page.tsx - Page template

import * as React from 'react';
import { FC, ReactNode } from 'react';

import WideBox from '@/atoms/wideBox';

import { Title } from '@/atoms/typography';

import { useTranslation } from 'react-i18next';


interface PageProps {
  name: string;
  children: ReactNode;
}


const Page: FC<PageProps> = ({ children, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <WideBox variant="dark">
        <Title>
          {t(`pageName.${name}`)}
        </Title>
      </WideBox>
      
      {children}
    </>
  );
}

export default Page;
