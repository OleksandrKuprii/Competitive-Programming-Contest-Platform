import * as React from 'react';
import { FC } from 'react';

import Box from '@/atoms/box';
import { Title, Text } from '@/atoms/typography';
import { Padding } from '~/mixins/padding';

import Spacer from "@/atoms/spacer";
import Button from "@/atoms/button";
import {List, ListItem} from "@/atoms/list";

const Sidebar: FC = () => (
  <Box variant="lightDarken" height="100vh">
    <Box variant="darkDarken" height="53px" />

    <Box variant="primaryDarken" height="59px" />
  </Box>
);

export default Sidebar;
