'use client';

import { useEffect } from 'react';
import { useUserStore } from '../store/UserStore';
import UserList from './UserList';
import UserSelectedList from './UserSelectedList';
import { Box, Button, Typography } from '@mui/material';

export default function UserSelectForm() {
  const { setUsers, moveSelected, moveBack } = useUserStore();

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const response = await fetch('http://localhost:4000/users');
    //     const data = await response.json();
    //     setUsers(data);
    //   } catch (error) {
    //     console.error('사용자 데이터 로드 실패:', error);
    //   }
    // };
    // fetchUsers();
    setUsers([
      { id: 1, name: '홍길동', email: 'hong@test.com', createdAt: '2024-06-01' },
      { id: 2, name: '이순신', email: 'lee@test.com', createdAt: '2024-06-02' },
      { id: 3, name: '강감찬', email: 'kang@test.com', createdAt: '2024-06-03' },
      { id: 4, name: '김철수', email: 'kim@test.com', createdAt: '2024-06-04' },
      { id: 5, name: '박영희', email: 'park@test.com', createdAt: '2024-06-05' },
      { id: 6, name: '정민수', email: 'jung@test.com', createdAt: '2024-06-06' },
      { id: 7, name: '최지영', email: 'choi@test.com', createdAt: '2024-06-07' },
    ]);
  }, [setUsers]);

  return (
    <Box p={2}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ width: '41.67%' }}>
          <Typography variant="h6">사용자 목록</Typography>
          <UserList />
        </Box>
        <Box sx={{ width: '16.67%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" onClick={moveSelected} sx={{ minWidth: 100 }}>
            ▶ 이동
          </Button>
          <Button variant="outlined" onClick={moveBack} sx={{ minWidth: 100 }}>
            ◀ 되돌리기
          </Button>
        </Box>
        <Box sx={{ width: '41.67%' }}>
          <Typography variant="h6">선택된 사용자</Typography>
          <UserSelectedList />
        </Box>
      </Box>
    </Box>
  );
}
