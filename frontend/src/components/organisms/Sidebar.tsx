import * as React from 'react';
import { FC } from 'react';

import Box from '@/atoms/box';
import { Title } from '@/atoms/typography';
import { Padding } from '~/mixins/padding';

import { Grid, JustifyContent } from '@/atoms/grid';

const Sidebar: FC = () => (
  <Box variant="dark" height="100vh">
    <Title>Toucan</Title>

    <div style={{ paddingTop: 59 }}></div>

    <Box padding={Padding.Normal} variant="primary">
      Home
    </Box>
    <Box padding={Padding.Normal} variant="dark">
      Tasks
    </Box>
  </Box>
);

export default Sidebar;
