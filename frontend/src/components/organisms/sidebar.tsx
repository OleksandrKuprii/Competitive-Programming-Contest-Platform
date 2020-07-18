import * as React from 'react';
import { FC } from 'react';

import Box from '@/toucanui/atoms/box';
import SidebarNavigation from "@/organisms/sidebarNavigation";
import {Padding} from "~/mixins/padding";
import Spacer from "@/toucanui/atoms/spacer";
import ProfileQuickActions from "@/organisms/profileQuickActions";
import {AlignItems, Grid} from "@/toucanui/atoms/grid";
import MyProfileInfo from "@/organisms/myProfileInfo";

const Sidebar: FC = () => (
  <Box variant="lightDarken" height="100vh">
    <Box variant="darkDarken" height="53px">
      <SidebarNavigation />
    </Box>

    <Box variant="greyDarken" height="59px" />

    <Spacer top={Padding.Large} />

    <Grid style={{ paddingLeft: Padding.Normal }} alignItems={AlignItems.Center}>
      <MyProfileInfo />

      <Spacer top={Padding.Medium} />

      <ProfileQuickActions />
    </Grid>
  </Box>
);

export default Sidebar;
