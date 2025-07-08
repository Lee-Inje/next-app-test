// /components/TabView.tsx
'use client';

import React from 'react';
import { Tabs, Tab, Box, Paper, Typography } from '@mui/material';
import { useTabStore } from '../store/tabStore';

// 각 탭 별 컴포넌트 import
import TabPage1 from './tabs/TabPage1';
import TabPage2 from './tabs/TabPage2';
import TabPage3 from './tabs/TabPage3';

export default function TabView() {
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 1600, mx: 'auto', mt: 4 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>시험일정안내</Typography>
      </Box>
      <Tabs value={selectedTab} onChange={handleChange} centered sx={{ backgroundColor: '#f5f5f5' }}>
        <Tab label="시험일정" />
        <Tab label="맟춤형 학업성취도 자율평가" />
        <Tab label="국가수준 학업성취도평가 범위" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && <TabPage1 />}
        {selectedTab === 1 && <TabPage2 />}
        {selectedTab === 2 && <TabPage3 />}
      </Box>
    </Paper>
  );
}
