import * as React from 'react';
import { FC } from 'react';

import Box from '@/atoms/box';
import SidebarNavigation from "@/organisms/sidebarNavigation";
import ProfileInfo from "@/molecules/profileInfo";
import {Padding} from "~/mixins/padding";
import Spacer from "@/atoms/spacer";
import ProfileQuickActions from "@/organisms/profileQuickActions";
import {AlignItems, Grid} from "@/atoms/grid";
import MyProfileInfo from "@/organisms/myProfileInfo";

const Sidebar: FC = () => (
  <Box variant="lightDarken" height="100vh">
    <Box variant="darkDarken" height="53px">
      <SidebarNavigation />
    </Box>

    <Box variant="primaryDarken" height="59px" />

    <Spacer top={Padding.Large} />

    <Grid style={{ paddingLeft: Padding.Normal }} alignItems={AlignItems.Center}>
      <MyProfileInfo />

      <Spacer top={Padding.Medium} />

      <ProfileQuickActions />
    </Grid>
  </Box>
);

export default Sidebar;
