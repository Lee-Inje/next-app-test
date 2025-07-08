'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Popper, ClickAwayListener, Stack, Container, Divider, Button, FormHelperText } from '@mui/material';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import dayjs from 'dayjs';
import DateRangeInput, { DateRangeValue } from './components/DateRangeInput';
import DateTimeRangeInput, { DateTimeRangeValue } from './components/DateTimeRangeInput';
import DataGridEx from '@/test/DateGrid/dataGridEx';
import useObjectFormState, {  useListFormState  , typeOfTableForm, useGridFormState} from "@/test/FormState";
import { GridCellParams, GridColDef, GridEventListener, GridRenderCellParams, GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import { info } from 'console';
import SelectBox from '@/test/SelectBox/selectBox';
import UserSelectForm from './components/UserSelectForm';
import TabView from './components/TabView';
import CustomDialog from './components/common/CustomDialog';


import { useForm } from 'react-hook-form';
import { object, string, ref } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// grid data start =======================================================================================
// grid type 정의 
const columns : GridColDef<any>[] = [
  { field: 'pKey', headerName: '부모키', width: 70 },
  { field: 'key', headerName: '키', width: 150 },
  { field: 'txt', headerName: '텍스트', width: 100 },
  { field: 'bbb', headerName: '추가버튼', width: 100 , 
    renderCell(params) { 
      return(<Button variant="contained" size="small" onClick={(e) => { e.stopPropagation(); alert('버튼클릭')} }>버튼</Button>) 
    },  
  },
  { field: 'edit', headerName: '수정', width: 100, sortable: false, filterable: false, align: 'center', headerAlign: 'center', 
      renderCell: (params: GridRenderCellParams) => (
          <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={e => {
                  e.stopPropagation(); // 행 클릭 이벤트 버블링 방지
                  console.log('수정버튼 클릭 :', params.row);
              }}
          >
              수정
          </Button>
      ),
  },
  ] as const;
  
type Item = typeOfTableForm<typeof columns>;
// grid type 정의 //
// grid data end =======================================================================================


export default function Example6Page() {

// grid code start ======================================================================================= 
  const [info , setInfo] = useState('');
  const grid = useGridFormState<Item>([]); 
  
  const loadData = async () => {
      try {
         const res = await fetch(`http://localhost:4000/items?_page=${grid.paginationModel.page+1}&_limit=${grid.paginationModel.pageSize}`);
         const totalCount = Number(res.headers.get('X-Total-Count') ?? 0);
         if (!res.ok) throw new Error('API error');
         const data = await res.json();

         console.log("grid loadData data  :: ", data);

         //여기 고민
         grid.setRowCount(totalCount);
         grid.setGrid(data);
          //여기 고민
      } catch {
          //에러처리
      } finally {
          //정리작업
      }
 }
 grid.setDataLoadFuntion(loadData); // 여기 등록된 함수가 필요시 호출된다.

 useEffect(() => {
      loadData();// 필요시 초기호출
 } ,  []);




 //  test //
 const consolLog = (eventType:string , params : any) => setInfo( eventType + ' : ' + JSON.stringify(params));

//  const onCellClick = (params : GridCellParams) => consolLog('onCellClick' , [params.id , params.colDef , params.field]);
//  const onRowDoubleClick = (params : any) => consolLog('onRowDoubleClick' ,params);
//  const onRowClick = (params : any) => consolLog('onRowClick' ,params);

//  const handleRowClick = (params: GridRowParams) => {
//   console.log('✅ Row Clicked1:',  params);
//   console.log('✅ Row Clicked2:',  params.row);
//  };


const handleCellClick: GridEventListener<'cellClick'> = (params, event) => {
  console.log('✅ Cell Clicked: params = ', params);
  consolLog('Cell Clicked : ' , [params.field, params.row] );
  if( 'txt' == params.field ){
    alert("txt 컬럼 cell 클릭!!");
  }
};

const handleRowClick: GridEventListener<'rowClick'> = (params, event) => {
  console.log('✅ Row Clicked:', params);
  consolLog('Row Clicked' , [params.id, params.row] );
};

const handleColumnHeaderClick: GridEventListener<'columnHeaderClick'> = (params, event) => {
  console.log('✅ Column Header Clicked:', params);
  consolLog('Column Header Clicked : ' , [params.field, params.colDef] );
  if( 'txt' == params.field ){
    alert("txt 컬럼 Header 클릭!!");
  }  
};

const handleCellDoubleClick: GridEventListener<'cellDoubleClick'> = (params, event) => {
  console.log('✅ Cell Double Clicked:', params);
  consolLog('Cell Double Clicked : ' , [params.field, params.row] );
};

const handleRowDoubleClick: GridEventListener<'rowDoubleClick'> = (params, event) => {
  console.log('✅ Row Double Clicked:', params);
  consolLog('Row Double Clicked : ' , [params.id, params.row] );
};



// apiRef 선언
const apiRef = useGridApiRef(); 

// 특정 row 선택
const selectSecondRow = () => {
  if (apiRef.current) {
    // DataGridEx에서 getRowId={(row) => row._id}로 설정되어 있으므로, 실제 row의 _id 값을 사용해야 함
    // grid.list[1]이 두 번째 row라면, 그 _id를 사용하여 선택
    if (grid.list.length > 1) {
      apiRef.current.selectRow(grid.list[1]._id, true); // 두 번째 row 선택
      
      // 선택된 row 정보 호출 - 필요없음(테스트코딩)
      if (apiRef.current) {
        const selectedRows = apiRef.current.getSelectedRows();
        if (selectedRows.size === 0) {
          alert('선택된 행이 없습니다.');
        } else {
          // 여러 개 선택 가능, 첫 번째만 표시
          const firstSelected = selectedRows.values().next().value;
          consolLog('특정 row 선택 : ' , firstSelected );
        }
      }
      alert("_id : " + grid.list[1]._id );
    } else {
      alert('두 번째 row가 없습니다.');
    }
  } else {
    // 오류 발생
    console.error('apiRef.current가 null입니다.');
  }
};

// 선택된 row 정보 가져오기
const handleShowSelectedRows = () => {
  if (apiRef.current) {
    const selectedRows = apiRef.current.getSelectedRows();
    if (selectedRows.size === 0) {
      alert('선택된 행이 없습니다.');
      return;
    }
    // 여러 개 선택 가능, 첫 번째만 표시
    const firstSelected = selectedRows.values().next().value;
    alert('선택된 row 데이터: ' + JSON.stringify(firstSelected));
  }
};

// 컬럼 업데이트 사용 안할듯.
// const updateRowAge = () => {
//   apiRef.current.updateRows([{ id: 1, age: 99 }]); // id=1의 age 수정
// };


// 특정 행으로 스크롤 : 스크롤만 이동할 뿐, 선택되거나 포커스되지는 않음. : 사용안할듯?
// const scrollToRow = () => {
//   if (apiRef.current) {
//     apiRef.current.scrollToIndexes({ rowIndex: 1 }); // 2번째 행으로 스크롤
//     apiRef.current.setCellFocus(1, 'txt'); // 행 id=10, 'name' 셀 포커스
//     handleShowSelectedRows();
//   }
// };

//  test //
// grid code end ======================================================================================= 


// grid datepicker start ======================================================================================= 

  const [dateRange, setDateRange] = useState<DateRangeValue>({ 
    startDate: null, 
    endDate: null,
  } as DateRangeValue);

  const [dateRange2, setDateRange2] = useState<DateTimeRangeValue>({ 
    startDate: null, 
    endDate: null,
  } as DateTimeRangeValue);

  
  const [dateRange3, setDateRange3] = useState<DateTimeRangeValue>({ 
    startDate: null, 
    endDate: null,
  } as DateTimeRangeValue);

  const [dateRange4, setDateRange4] = useState<DateTimeRangeValue>({ 
    startDate: null, 
    endDate: null,
  } as DateTimeRangeValue);


// grid datepicker end ======================================================================================= 




// 콤보 start ======================================================================================= 
  const [category , setCategory] = useState<string>('');
  const [item , setItem] = useState<string>('');
  const [subItem , setSubItem] = useState<string>('');

// 콤보 end ======================================================================================= 


// 팝업 호출 start ======================================================================================= 

// 1. 예제1
const [open, setOpen] = useState(false);


// 예제2
const [open2, setOpen2] = useState(false);
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [errors2, setErrors2] = useState<{ name?: string; email?: string }>({});

const useHandleSubmit = () => {
  const newErrors: typeof errors2 = {};
  if (!name.trim()) newErrors.name = '이름을 입력하세요.';
  if (!email.trim()) newErrors.email = '이메일을 입력하세요.';

  if (Object.keys(newErrors).length > 0) {
    setErrors2(newErrors);
    return;
  }

  // 성공 처리
  alert(`제출됨\n이름: ${name}\n이메일: ${email}`);
  setOpen(false);

  // 초기화
  setName('');
  setEmail('');
  setErrors2({});
};


// 예제3-1

// const [open3, setOpen3] = useState(false);

// interface FormInputs {
//   name: string;
//   email: string;
// }

// // ✅ yup 유효성 스키마 정의
// const schema = yup.object().shape({
//   name: yup.string().required('이름을 입력하세요.'),
//   email: yup
//     .string()
//     .required('이메일을 입력하세요.')
//     .email('올바른 이메일 형식이 아닙니다.'),
// });



// const {
//   register,
//   handleSubmit,
//   formState: { errors },
//   reset,
// } = useForm<FormInputs>({
//   resolver: yupResolver(schema),
// });

// const onSubmit = (data: FormInputs) => {
//   alert(`제출됨\n이름: ${data.name}\n이메일: ${data.email}`);
//   setOpen3(false);
//   reset(); // 폼 초기화
// };



// 예제3-2


type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

// ✅ 이메일 중복 확인 (모의 API 호출)
const checkEmailExists = async (email: string) => {
  await new Promise((res) => setTimeout(res, 800)); // delay
  const dummyEmails = ['test@example.com', 'hello@world.com'];
  return dummyEmails.includes(email);
};

// ✅ yup 스키마 정의
const schema = object({
  name: string().required('이름을 입력하세요.'),
  email: string()
    .required('이메일을 입력하세요.')
    .email('이메일 형식이 올바르지 않습니다.')
    .test('check-duplicate', '이미 사용 중인 이메일입니다.', async (value) => {
      if (!value) return false;
      const exists = await checkEmailExists(value);
      return !exists;
    }),
  phone: string()
    .required('전화번호를 입력하세요.')
    .matches(/^010\d{8}$/, '010으로 시작하는 11자리 숫자를 입력하세요.'),
  password: string()
    .required('비밀번호를 입력하세요.')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
  confirmPassword: string()
    .oneOf([ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인을 입력하세요.'),
});

const [open3, setOpen3] = useState(false);
const [loading, setLoading] = useState(false);

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
} = useForm<FormData>({
  resolver: yupResolver(schema),
  mode: 'onChange',
});

const onSubmit = async (data: FormData) => {
  setLoading(true);
  await new Promise((res) => setTimeout(res, 1000));
  alert(JSON.stringify(data, null, 2));
  reset();
  setOpen(false);
  setLoading(false);
};


// 팝업 호출 end ======================================================================================= 

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        컴포넌트 샘플
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>


        {/* 큰 샘플 영역 - 전체 너비 */}
        <Paper elevation={3} sx={{ p: 4, bgcolor: '#f8f9fa' }}>
          <Typography variant="h5" gutterBottom color="primary">
            그리드 샘플
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            그리드 컴포넌트입니다.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flex: 1  }}>
              <Button variant="contained" color="primary" onClick={() => selectSecondRow()}>특정로우선택</Button>
              <Button variant="outlined" color="secondary" onClick={() => loadData()}>새로고침</Button>
              <Button variant="outlined" color="success" onClick={handleShowSelectedRows}>선택된 행 정보 보기</Button>
              {/* <Button variant="outlined" color="info" onClick={scrollToRow}>특정행 스크롤</Button> */}
          </Box>          
          <DataGridEx 
              grid={grid} 
              columns={columns} 
              // onCellClick={ onCellClick   }
              // onRowDoubleClick={ onRowDoubleClick } 
              // onRowClick={ onRowClick }
              apiRef={apiRef}
              onCellClick={handleCellClick}
              onRowClick={handleRowClick}
              onColumnHeaderClick={handleColumnHeaderClick}
              onCellDoubleClick={handleCellDoubleClick}
              onRowDoubleClick={handleRowDoubleClick}

          />

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              현재페이지: {grid.paginationModel.page}, 페이지사이즈: {grid.paginationModel.pageSize}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              info : {info}
            </Typography>
          </Box>
        </Paper>








        {/* 큰 샘플 영역 - 전체 너비 */}
        <Paper elevation={3} sx={{ p: 4, bgcolor: '#f8f9fa' }}>
          <Typography variant="h5" gutterBottom color="primary">
            TAB 샘플
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            TAB 컴포넌트입니다.
          </Typography>
          
          <TabView />

          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              info : 
            </Typography>
          </Box>
        </Paper>








        {/* 중간 샘플 영역들 - 가로 배치 */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* 중간 샘플 영역 - 절반 너비 */}
          <Paper elevation={2} sx={{ p: 3, flex: '1 1 400px', minWidth: 0, bgcolor: '#fff3e0' }}>
            <Typography variant="h6" gutterBottom color="warning.main">
              ⏰ 날짜 범위 선택 (일반)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              제한 없이 자유롭게 시작, 종료 날짜를 선택할 수 있습니다.
            </Typography>

            <DateRangeInput 
              value={dateRange} 
              onChange={setDateRange} 
            />

            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                선택된 기간: {dateRange.startDate ? dayjs(dateRange.startDate).format('YYYY.MM.DD') : '-'} ~ {dateRange.endDate ? dayjs(dateRange.endDate).format('YYYY.MM.DD') : '-'}
              </Typography>
            </Box>
          </Paper>

          {/* 중간 샘플 영역 - 절반 너비 */}
          <Paper elevation={2} sx={{ p: 3, flex: '1 1 400px', minWidth: 0, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom color="info.main">
              📊 날짜 범위 선택 (특정일 제외, 선태기간 지정)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              지정된된 날짜를 선택할 수 있습니다.
            </Typography>
            
            <DateRangeInput 
              value={dateRange2} 
              onChange={setDateRange2}
              minDate="20250801" 
              maxDate="20251231" 
              disabledDates={['20250901', '20250930']} 
            />

            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                선택된 기간: {dateRange2.startDate ? dayjs(dateRange2.startDate).format('YYYY.MM.DD') : '-'} ~ {dateRange2.endDate ? dayjs(dateRange2.endDate).format('YYYY.MM.DD') : '-'}
              </Typography>
            </Box>
          </Paper>
        </Box>














        {/* 중간 샘플 영역들 - 가로 배치 */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* 중간 샘플 영역 - 절반 너비 */}
          <Paper elevation={2} sx={{ p: 3, flex: '1 1 400px', minWidth: 0, bgcolor: '#fff3e0' }}>
            <Typography variant="h6" gutterBottom color="warning.main">
              ⏰ 날짜+시간 범위 선택 (중간 영역)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              날짜와 시간을 함께 선택할 수 있는 컴포넌트입니다.
            </Typography>

            <DateTimeRangeInput 
              value={dateRange3} 
              onChange={setDateRange3} 
            />

            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                선택된 기간: {dateRange3.startDate ? dayjs(dateRange3.startDate).format('YYYY.MM.DD HH:mm') : '-'} ~ {dateRange3.endDate ? dayjs(dateRange3.endDate).format('YYYY.MM.DD HH:mm') : '-'}
              </Typography>
            </Box>
          </Paper>

          {/* 중간 샘플 영역 - 절반 너비 */}
          <Paper elevation={2} sx={{ p: 3, flex: '1 1 400px', minWidth: 0, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom color="info.main">
              📊 기본 날짜 선택 (중간 영역)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              제한 없이 자유롭게 날짜를 선택할 수 있습니다.
            </Typography>

            <DateTimeRangeInput 
              value={dateRange4} 
              onChange={setDateRange4} 
              minDate="20250801" 
              maxDate="20251231" 
              disabledDates={['20250901', '20250930']} 
            />

            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                선택된 기간: {dateRange4.startDate ? dayjs(dateRange4.startDate).format('YYYY.MM.DD HH:mm') : '-'} ~ {dateRange4.endDate ? dayjs(dateRange4.endDate).format('YYYY.MM.DD HH:mm') : '-'}
              </Typography>
            </Box>
            
          </Paper>
        </Box>

















        {/* 작은 샘플 영역들 - 3개 가로 배치 */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* 작은 샘플 영역 - 1/3 너비 */}
          <Paper elevation={1} sx={{ p: 2, flex: '1 1 300px', minWidth: 0, bgcolor: '#e8f5e8' }}>
            <Typography variant="subtitle1" gutterBottom color="success.main">
              📊 이중콤보
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              첫번째 콤보 선택값에따라 두번째 콤보값이 변경되는 콤보.
            </Typography>
            
            <SelectBox 
                label="카테고리"
                eventKey="category"
                getApiUrl={() => '/api/categories'}
                value={category}
                onChange={(val) => setCategory(val)}
                sx ={{width:'230px'}}
            />

            <SelectBox 
                label="아이템"
                eventKey="item"
                dependsOn = {["category"]}
                getApiUrl={(parentObj) => `/api/items?pKey=${parentObj.category}`}
                value={item}
                onChange={(val) => setItem(val)}
                sx ={{width:'230px'}}
            />

            <SelectBox 
                label="서브아이템"
                eventKey="subItem"
                dependsOn = {["item"]}
                getApiUrl={(parentObj) => `/api/subitems?pKey=${parentObj.item}`}
                value={subItem}
                onChange={(val) => setSubItem(val)}
                sx ={{width:'230px'}}
            />

            <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="caption" fontWeight="bold">
                category : {category} || item : {item} || subItem : {subItem} 
              </Typography>
            </Box>
          </Paper>




          {/* 작은 샘플 영역 - 1/3 너비 */}
          <Paper elevation={1} sx={{ p: 2, flex: '1 1 300px', minWidth: 0, bgcolor: '#fff0f0' }}>
            <Typography variant="subtitle1" gutterBottom color="error.main">
              ⚠️ 모달 팝업
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              UI v7 Custom Dialog 예제
            </Typography>
            

            <Button variant="outlined" onClick={() => setOpen(true)}>
              다이얼로그 열기(1)
            </Button>

            <CustomDialog
              open={open}
              title="알림"
              onClose={() => setOpen(false)}
              onConfirm={() => {
                alert('확인 클릭됨');
                setOpen(false);
              }}
              confirmText="예"
              cancelText="아니오"
            >
              <Typography>정말 이 작업을 실행하시겠습니까?</Typography>
            </CustomDialog>
            

            <Button variant="outlined" onClick={() => setOpen2(true)}>
              Form 열기 열기(2)
            </Button>

            <CustomDialog
              open={open2}
              title="사용자 정보 입력"
              onClose={() => setOpen2(false)}
              onConfirm={useHandleSubmit}
              confirmText="제출"
              cancelText="닫기"
            >
              <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
                <Stack spacing={2}>
                  <TextField
                    label="이름"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                  />
                  {errors.name && (
                    <FormHelperText error>{errors2.name}</FormHelperText>
                  )}

                  <TextField
                    label="이메일"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <FormHelperText error>{errors2.email}</FormHelperText>
                  )}
                </Stack>
              </Box>
            </CustomDialog>



            <Button variant="contained" onClick={() => setOpen3(true)}>
              Form + 유효성 검사 열기(3)
            </Button>

            {/* <CustomDialog
              open={open3}
              title="사용자 정보"
              onClose={() => {
                setOpen3(false);
                reset();
              }}
              onConfirm={handleSubmit(onSubmit)}
              confirmText="제출"
              cancelText="닫기"
            >
              <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
                <Stack spacing={2}>
                  <TextField
                    label="이름"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register('name')}
                  />
                  <TextField
                    label="이메일"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register('email')}
                  />
                </Stack>
              </Box>
            </CustomDialog> */}

            <CustomDialog
                    open={open3}
                    title="회원가입"
                    onClose={() => {
                      setOpen3(false);
                      reset();
                    }}
                    onConfirm={handleSubmit(onSubmit)}
                    confirmText="가입하기"
                    cancelText="닫기"
                  >
                    <Box component="form" noValidate autoComplete="off">
                      <Stack spacing={2}>
                        <TextField
                          label="이름"
                          fullWidth
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          {...register('name')}
                        />

                        <TextField
                          label="이메일"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          {...register('email')}
                        />

                        <TextField
                          label="전화번호"
                          placeholder="010xxxxxxxx"
                          fullWidth
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          {...register('phone')}
                        />

                        <TextField
                          label="비밀번호"
                          type="password"
                          fullWidth
                          error={!!errors.password}
                          helperText={errors.password?.message}
                          {...register('password')}
                        />

                        <TextField
                          label="비밀번호 확인"
                          type="password"
                          fullWidth
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword?.message}
                          {...register('confirmPassword')}
                        />
                      </Stack>
                    </Box>
                  </CustomDialog>

            {/* <DateRangeInput 
              value={dateRange} 
              onChange={setDateRange}
              minDate="20250801"
              maxDate="20251231"
              disabledDates={['20250901', '20250930']}
            />

            <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="caption" fontWeight="bold">
                선택: {dateRange.startDate ? dayjs(dateRange.startDate).format('MM.DD') : '-'} ~ {dateRange.endDate ? dayjs(dateRange.endDate).format('MM.DD') : '-'}
              </Typography>
            </Box> */}
          </Paper>




          {/* 작은 샘플 영역 - 1/3 너비 */}
          <Paper elevation={1} sx={{ p: 2, flex: '1 1 300px', minWidth: 0, bgcolor: '#f0f8ff' }}>
            <Typography variant="subtitle1" gutterBottom color="info.main">
              🕐 시간 포함 선택
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              날짜와 시간을 함께 선택할 수 있습니다.
            </Typography>
            
            {/* <DateTimeRangeInput 
              value={dateRange2} 
              onChange={setDateRange2}
            />

            <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="caption" fontWeight="bold">
                선택: {dateRange2.startDate ? dayjs(dateRange2.startDate).format('MM.DD HH:mm') : '-'} ~ {dateRange2.endDate ? dayjs(dateRange2.endDate).format('MM.DD HH:mm') : '-'}
              </Typography>
            </Box> */}
          </Paper>
        </Box>

        {/* 정보 표시 영역 - 전체 너비 */}
        <Paper elevation={2} sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            📋 선택된 데이터 요약
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, flex: '1 1 400px', minWidth: 0 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                날짜 범위 선택 결과
              </Typography>
              <Typography variant="body2">
                시작일: {dateRange.startDate ? dayjs(dateRange.startDate).format('YYYY년 MM월 DD일') : '선택되지 않음'}
              </Typography>
              <Typography variant="body2">
                종료일: {dateRange.endDate ? dayjs(dateRange.endDate).format('YYYY년 MM월 DD일') : '선택되지 않음'}
              </Typography>
              {dateRange.startDate && dateRange.endDate && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  총 {dayjs(dateRange.endDate).diff(dayjs(dateRange.startDate), 'day') + 1}일
                </Typography>
              )}
            </Box>
            
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, flex: '1 1 400px', minWidth: 0 }}>
              <Typography variant="subtitle2" color="secondary" gutterBottom>
                날짜+시간 범위 선택 결과
              </Typography>
              <Typography variant="body2">
                시작: {dateRange2.startDate ? dayjs(dateRange2.startDate).format('YYYY년 MM월 DD일 HH시 mm분') : '선택되지 않음'}
              </Typography>
              <Typography variant="body2">
                종료: {dateRange2.endDate ? dayjs(dateRange2.endDate).format('YYYY년 MM월 DD일 HH시 mm분') : '선택되지 않음'}
              </Typography>
              {dateRange2.startDate && dateRange2.endDate && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  총 {dayjs(dateRange2.endDate).diff(dayjs(dateRange2.startDate), 'hour')}시간 {dayjs(dateRange2.endDate).diff(dayjs(dateRange2.startDate), 'minute') % 60}분
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

