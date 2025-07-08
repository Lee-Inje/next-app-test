import React from 'react';
import { useTabStore } from '../../store/tabStore';
import { Box, Button, Chip, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

export default function TabPage1() {
   
    const selectedTab = useTabStore((state) => state.selectedTab);

    
    return (

        <Box sx={{ mt: 3 }}>
        

          {/* 테이블 영역 */}
          <Paper sx={{ p: 2 }}>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'left', fontWeight: 'bold' }}>
                📋 2025년 학업성취도 평가 계획
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        select
                        label="시행년도"
                        size="small"
                        sx={{ minWidth: 120 }}
                        defaultValue="2024"
                    >
                        <MenuItem value="2024">2024년</MenuItem>
                        <MenuItem value="2023">2023년</MenuItem>
                        <MenuItem value="2022">2022년</MenuItem>
                    </TextField>
                    <Button variant="contained" size="small">
                        검색
                    </Button>
                </Box>
            </Box>


            
            <TableContainer>
              <Table sx={{ border: '1px solid #e0e0e0' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', fontSize: 12 }}>구분</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', fontSize: 12 }}>대상 학년</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', fontSize: 12 }}>시행계획명</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', fontSize: 12 }}>시험 신청기간</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', fontSize: 12 }}>시험 기간</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 12 }}>신청현황</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>학업성취도 평가</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>3학년</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024년 1학기 중간고사</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024-04-01 ~ 2024-04-10</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024-04-15</TableCell>
                    <TableCell>
                      <Chip label="접수중" color="primary" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>학업성취도 평가</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>3학년</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024년 1학기 기말고사</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024-06-01 ~ 2024-06-10</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024-06-20</TableCell>
                    <TableCell>
                      <Chip label="예정" color="default" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>학업성취도 평가</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>3학년</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024년 2학기 중간고사</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024-10-01 ~ 2024-10-10</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>2024-10-15</TableCell>
                    <TableCell>
                      <Chip label="예정" color="default" size="small" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

    );
}