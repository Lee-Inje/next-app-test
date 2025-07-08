'use client';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useUserStore } from '../store/UserStore';
import { useEffect, useState } from 'react';
import { Box, TextField, InputAdornment, FormControl, Select, MenuItem, Button, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import dayjs, { Dayjs } from 'dayjs';

function formatDate(date: Dayjs | null) {
  if (!date) return '';
  return date.format('YYYY-MM-DD');
}

export default function UserList() {
  const { users, toggleCheck } = useUserStore();
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  // checked 속성이 변경될 때 selectedRows 업데이트
  useEffect(() => {
    const checkedIds = users.filter(user => user.checked).map(user => user.id);
    setSelectedRows(checkedIds);
  }, [users]);

  // 검색 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    // 날짜 필터
    if (startDate && user.createdAt < formatDate(startDate)) return false;
    if (endDate && user.createdAt > formatDate(endDate)) return false;
    // 텍스트 필터
    if (!searchTerm) return true;
    switch (searchField) {
      case 'name':
        return user.name.toLowerCase().includes(searchTerm.toLowerCase());
      case 'email':
        return user.email.toLowerCase().includes(searchTerm.toLowerCase());
      case 'id':
        return user.id.toString().includes(searchTerm);
      default:
        return true;
    }
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: '이름', width: 130 },
    { field: 'email', headerName: '이메일', width: 200 },
    { field: 'createdAt', headerName: '가입일', width: 120 },
  ];

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    const selectionArr = (selection as (string | number)[]).filter(
      (id): id is number => typeof id === "number"
    );
    const selectedRowsArr = (selectedRows as (string | number)[]).filter(
      (id): id is number => typeof id === "number"
    );

    const newlySelected = selectionArr.filter((id) => !selectedRowsArr.includes(id));
    const newlyDeselected = selectedRowsArr.filter((id) => !selectionArr.includes(id));

    newlySelected.forEach((id) => {
      if (!users.find(u => u.id === id)?.checked) {
        toggleCheck(id);
      }
    });

    newlyDeselected.forEach((id) => {
      if (users.find(u => u.id === id)?.checked) {
        toggleCheck(id);
      }
    });

    setSelectedRows(selection);
  };

  const handleSearch = () => {
    // 검색 버튼 클릭 시 추가 로직이 필요한 경우 여기에 구현
    console.log('검색 실행:', searchField, searchTerm);
  };

  const getSearchPlaceholder = () => {
    switch (searchField) {
      case 'name': return '이름을 입력하세요...';
      case 'email': return '이메일을 입력하세요...';
      case 'id': return 'ID를 입력하세요...';
      default: return '검색어를 입력하세요...';
    }
  };

  const handleStartDateChange = (value: Dayjs | null, _?: any) => setStartDate(value);
  const handleEndDateChange = (value: Dayjs | null, _?: any) => setEndDate(value);

  return (
    <Box>
      {/* 검색 영역 */}
      <Box sx={{ mb: 2 }}>
        {/* 1줄: 콤보박스 + 검색어 + 검색 버튼 */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {/* 검색 필드 콤보박스 */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              size="small"
            >
              <MenuItem value="name">이름</MenuItem>
              <MenuItem value="email">이메일</MenuItem>
              <MenuItem value="id">ID</MenuItem>
            </Select>
          </FormControl>
          {/* 검색어 입력 */}
          <TextField
            size="small"
            placeholder={getSearchPlaceholder()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            sx={{ flex: 1 }}
          />
          {/* 검색 버튼 */}
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            size="small"
          >
            검색
          </Button>
        </Stack>
        {/* 2줄: 시작일/종료일 달력 */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            {/* <DatePicker
              label="시작일"
              value={startDate}
              onChange={handleStartDateChange}
              format="YYYY-MM-DD"
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
            <DatePicker
              label="종료일"
              value={endDate}
              onChange={handleEndDateChange}
              format="YYYY-MM-DD"
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            /> */}
          </LocalizationProvider>
        </Stack>
        {/* 검색 결과 개수 */}
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          검색 결과: {filteredUsers.length}개 / 전체: {users.length}개
        </Box>
      </Box>
      {/* 사용자 목록 DataGrid */}
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        checkboxSelection
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={handleSelectionChange}
        getRowId={(row) => row.id}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      {/* 디버깅용 값 출력 */}
      <Box sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
        값 : {JSON.stringify(users)}
      </Box>
    </Box>
  );
}
