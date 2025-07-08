'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useUserStore } from '../store/UserStore';
import { useEffect, useState } from 'react';
import { Box, TextField, InputAdornment, FormControl, Select, MenuItem, Button, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ko from 'date-fns/locale/ko';

function formatDate(date: Date | null) {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function UserSelectedList() {
  const { selectedUsers, toggleSelectedCheck, moveBack } = useUserStore();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  // checked 속성이 변경될 때 selectedRows 업데이트
  useEffect(() => {
    const checkedIds = selectedUsers.filter(user => user.checked).map(user => user.id);
    setSelectedRows(checkedIds);
  }, [selectedUsers]);

  // 검색 필터링된 선택된 사용자 목록
  const filteredSelectedUsers = selectedUsers.filter(user => {
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

  const handleSelectionChange = (selection: any) => {
    // 새로 선택된 항목들
    const newlySelected = selection.filter((id: number) => !selectedRows.includes(id));
    // 선택 해제된 항목들
    const newlyDeselected = selectedRows.filter(id => !selection.includes(id));
    
    // 새로 선택된 항목들의 checked를 true로
    newlySelected.forEach((id: number) => {
      if (!selectedUsers.find(u => u.id === id)?.checked) {
        toggleSelectedCheck(id);
      }
    });
    
    // 새로 선택 해제된 항목들의 checked를 false로
    newlyDeselected.forEach((id: number) => {
      if (selectedUsers.find(u => u.id === id)?.checked) {
        toggleSelectedCheck(id);
      }
    });
    
    setSelectedRows(selection);
  };

  const handleSearch = () => {
    // 검색 버튼 클릭 시 추가 로직이 필요한 경우 여기에 구현
    // 현재는 실시간 필터이므로 별도 동작 없음
  };

  const getSearchPlaceholder = () => {
    switch (searchField) {
      case 'name': return '이름을 입력하세요...';
      case 'email': return '이메일을 입력하세요...';
      case 'id': return 'ID를 입력하세요...';
      default: return '검색어를 입력하세요...';
    }
  };

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
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            {/* <DatePicker
              label="시작일"
              value={startDate}
              onChange={setStartDate}
              format="yyyy-MM-dd"
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
            <DatePicker
              label="종료일"
              value={endDate}
              onChange={setEndDate}
              format="yyyy-MM-dd"
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            /> */}
          </LocalizationProvider>
        </Stack>
        {/* 검색 결과 개수 */}
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          검색 결과: {filteredSelectedUsers.length}개 / 전체: {selectedUsers.length}개
        </Box>
      </Box>
      {/* 선택된 사용자 목록 DataGrid */}
      <DataGrid
        rows={filteredSelectedUsers}
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
        값 : {JSON.stringify(selectedUsers)}
      </Box>
    </Box>
  );
}
