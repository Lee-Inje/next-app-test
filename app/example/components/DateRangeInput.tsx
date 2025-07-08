import React, { useState, useRef } from 'react';
import { Box, TextField, Popper, ClickAwayListener, Stack } from '@mui/material';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import dayjs from 'dayjs';


// 날짜 범위 값 타입 정의
export interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

// 컴포넌트 props 타입 정의
interface DateRangeInputProps {
  value: DateRangeValue; // 현재 선택된 날짜 범위
  onChange: (value: DateRangeValue) => void | React.Dispatch<React.SetStateAction<DateRangeValue>>; // 날짜 변경 시 호출
  labelStart?: string; // 시작일 input 라벨
  labelEnd?: string;   // 종료일 input 라벨
  minDate?: string; // 8자리(YYYYMMDD) 문자열
  maxDate?: string; // 8자리(YYYYMMDD) 문자열
  disabledDates?: string[]; // 8자리(YYYYMMDD) 문자열 배열
}

// 8자리 문자열을 Date 객체로 변환하는 함수
function parseDate(str?: string): Date | undefined {
  if (!str || str.length !== 8) return undefined;
  const y = +str.slice(0, 4);
  const m = +str.slice(4, 6) - 1;
  const d = +str.slice(6, 8);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return undefined;
  return new Date(y, m, d);
}

function parseDateArray(arr?: string[]): Date[] | undefined {
  if (!arr) return undefined;
  const result = arr.map(parseDate).filter(Boolean) as Date[];
  return result.length > 0 ? result : undefined;
}

export default function DateRangeInput({ 
  value, 
  onChange, 
  labelStart = '시작일', 
  labelEnd = '종료일',
  minDate,
  maxDate,
  disabledDates
}: DateRangeInputProps) {
  // 달력 팝업 열림 상태
  const [open, setOpen] = useState(false);
  // input 영역 ref (팝업 위치 기준)
  const anchorRef = useRef<HTMLDivElement>(null);
  // 내부 달력 상태 (DateRange 컴포넌트에 전달)
  const [internal, setInternal] = useState([
    {
      startDate: value.startDate || new Date(),
      endDate: value.endDate || new Date(),
      key: 'selection',
    },
  ]);
  // 달력 클릭 카운트 (두 번째 클릭에서만 팝업 닫기)
  const [clickCount, setClickCount] = useState(0);

  // 날짜를 yyyy.MM.DD 형식으로 포맷
  const format = (date: Date | null | undefined) => date ? dayjs(date).format('YYYY-MM-DD') : '';

  // value prop이 바뀌면 내부 상태도 동기화
  // (생략 가능, 필요시 useEffect로 구현)

  return (
    <Box>
      {/* input 영역: 시작일/종료일, 클릭 시 달력 팝업 오픈 */}
      <Stack direction="row" spacing={2} alignItems="center" ref={anchorRef}>
        <TextField
          label={labelStart}
          value={format(value.startDate)}
          onClick={() => setOpen(true)}
          inputProps={{ readOnly: true }}
          sx={{ width: 150 }}
        />
        <span>~</span>
        <TextField
          label={labelEnd}
          value={format(value.endDate)}
          onClick={() => setOpen(true)}
          inputProps={{ readOnly: true }}
          sx={{ width: 150 }}
        />
      </Stack>
      {/* 달력 팝업: input 클릭 시 노출, 바깥 클릭 시 닫힘 */}
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 1300 }}>
        {/* 팝업 바깥 클릭 시 닫힘 처리 */}
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box>
            {/* 2달치 달력, 시작/종료일 선택 */}
            <DateRange
              editableDateInputs={false} // input 직접 입력 불가, 달력에서만 선택
              onChange={item => {
                // 날짜가 바뀔 때 실행
                const selection = item.selection || {};
                setInternal([
                  {
                    startDate: selection.startDate ? new Date(selection.startDate) : new Date(), // 시작일
                    endDate: selection.endDate ? new Date(selection.endDate) : new Date(),       // 종료일
                    key: 'selection',
                  },
                ]);
                const newValue = {
                  startDate: selection.startDate ? new Date(selection.startDate) : null,
                  endDate: selection.endDate ? new Date(selection.endDate) : null,
                };
                onChange(newValue);
                // 두 번째 클릭(즉, range가 완성된 경우)에만 팝업 닫기
                setClickCount(prev => {
                  const next = prev + 1;
                  if (next >= 2) {
                    setOpen(false);
                    return 0;
                  }
                  return next;
                });
              }}
              moveRangeOnFirstSelection={false} // 첫 날짜 선택 후 두 번째 날짜 선택 시 range 이동 여부
              ranges={internal} // 현재 선택된 날짜 범위
              months={2} // 한 번에 2달치 달력 표시
              direction="horizontal" // 달력 2개를 가로로 나란히 표시
              showMonthAndYearPickers={true} // 월/년 선택 드롭다운 표시
              locale={ko} // 한글화
              dateDisplayFormat="yyyy-MM-dd" // 상단 날짜 표시 포맷
              showDateDisplay={false}   // 상단 날짜 input 표시 여부 (기본: true)
              minDate={parseDate(minDate)}
              maxDate={parseDate(maxDate)}
              disabledDates={parseDateArray(disabledDates)}
            />
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
} 