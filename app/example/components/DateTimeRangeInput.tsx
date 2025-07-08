import React, { useState, useRef } from 'react';
import { Box, TextField, Popper, ClickAwayListener, Stack } from '@mui/material';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface DateTimeRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateTimeRangeInputProps {
  value: DateTimeRangeValue;
  onChange: (value: DateTimeRangeValue) => void;
  labelStart?: string;
  labelEnd?: string;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
}

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

export default function DateTimeRangeInput({
  value,
  onChange,
  labelStart = '시작일',
  labelEnd = '종료일',
  minDate,
  maxDate,
  disabledDates,
}: DateTimeRangeInputProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState([
    {
      startDate: value.startDate || new Date(),
      endDate: value.endDate || new Date(),
      key: 'selection',
    },
  ]);

  // 시간 상태
  const [startTime, setStartTime] = useState<Dayjs | null>(value.startDate ? dayjs(value.startDate) : null);
  const [endTime, setEndTime] = useState<Dayjs | null>(value.endDate ? dayjs(value.endDate) : null);

  // 날짜 변경 시 시간도 동기화
  React.useEffect(() => {
    setStartTime(value.startDate ? dayjs(value.startDate) : null);
    setEndTime(value.endDate ? dayjs(value.endDate) : null);
  }, [value.startDate, value.endDate]);

  // 날짜+시간을 Date 객체로 합치기
  const mergeDateTime = (date: Date | null, time: Dayjs | null) => {
    if (!date || !time) return null;
    const d = dayjs(date);
    return d.hour(time.hour()).minute(time.minute()).second(time.second()).toDate();
  };

  // 날짜/시간 선택 완료 체크 함수
  const isAllSelected = (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined,
    startTime: Dayjs | null | undefined,
    endTime: Dayjs | null | undefined
  ) => {
    return !!(startDate && endDate && startTime && endTime);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (item: { selection?: { startDate?: Date; endDate?: Date } }) => {
    const selection = item.selection || {};
    const newStartDate = selection.startDate ? new Date(selection.startDate) : null;
    const newEndDate = selection.endDate ? new Date(selection.endDate) : null;

    setInternal([
      {
        startDate: newStartDate || new Date(),
        endDate: newEndDate || new Date(),
        key: 'selection',
      },
    ]);
    const mergedStart = mergeDateTime(newStartDate, startTime);
    const mergedEnd = mergeDateTime(newEndDate, endTime);
    onChange({
      startDate: mergedStart,
      endDate: mergedEnd,
    });
  };

  // 시간 변경 핸들러
  const handleTimeChange = (type: 'start' | 'end', newTime: Dayjs | null) => {
    if (type === 'start') {
      setStartTime(newTime);
      const mergedStart = mergeDateTime(value.startDate, newTime);
      const mergedEnd = mergeDateTime(value.endDate, endTime);
      onChange({
        startDate: mergedStart,
        endDate: mergedEnd,
      });
      // 시간/날짜 모두 선택 시 팝업 닫기
      if (value.startDate && value.endDate && newTime && endTime) {
        setOpen(false);
      }
    } else {
      setEndTime(newTime);
      const mergedStart = mergeDateTime(value.startDate, startTime);
      const mergedEnd = mergeDateTime(value.endDate, newTime);
      onChange({
        startDate: mergedStart,
        endDate: mergedEnd,
      });
      if (value.startDate && value.endDate && startTime && newTime) {
        setOpen(false);
      }
    }
  };

  // 날짜/시간이 모두 선택된 경우 팝업 닫기
  React.useEffect(() => {
    
    console.log('selectedStartDate : ', value.startDate);
    console.log('selectedEndDate : ', value.endDate);
    console.log('startTime : ', startTime && startTime.format());
    console.log('endTime : ', endTime && endTime.format());
    
    const isDateValid =
      value.startDate &&
      value.endDate &&
      dayjs(value.startDate).isValid() &&
      dayjs(value.endDate).isValid();
    const isTimeValid =
      startTime && endTime &&
      typeof startTime.hour === 'function' && typeof endTime.hour === 'function' &&
      typeof startTime.minute === 'function' && typeof endTime.minute === 'function' &&
      !isNaN(startTime.hour()) && !isNaN(startTime.minute()) &&
      !isNaN(endTime.hour()) && !isNaN(endTime.minute());
    if (isDateValid && isTimeValid) {
      setOpen(false);
    }
    // eslint-disable-next-line
  }, [value.startDate, value.endDate, startTime, endTime]);

  const format = (date: Date | null | undefined) => date ? dayjs(date).format('YYYY.MM.DD HH:mm') : '';

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" ref={anchorRef}>
        <TextField
          label={labelStart}
          value={format(value.startDate)}
          onClick={() => setOpen(true)}
          inputProps={{ readOnly: true }}
          sx={{ width: 180 }}
        />
        <span>~</span>
        <TextField
          label={labelEnd}
          value={format(value.endDate)}
          onClick={() => setOpen(true)}
          inputProps={{ readOnly: true }}
          sx={{ width: 180 }}
        />
      </Stack>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 1300 }}>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
            <DateRange
              editableDateInputs={false}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              ranges={internal}
              months={2}
              direction="horizontal"
              showMonthAndYearPickers={true}
              locale={ko}
              dateDisplayFormat="yyyy.MM.dd"
              showDateDisplay={false}
              minDate={parseDate(minDate)}
              maxDate={parseDate(maxDate)}
              disabledDates={parseDateArray(disabledDates)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={2} mt={2}>
                <TimePicker
                  label="시작 시간"
                  value={startTime}
                  onChange={newValue => handleTimeChange('start', newValue)}
                  ampm={false}
                  sx={{ width: 120 }}
                />
                <TimePicker
                  label="종료 시간"
                  value={endTime}
                  onChange={newValue => handleTimeChange('end', newValue)}
                  ampm={false}
                  sx={{ width: 120 }}
                />
              </Stack>
            </LocalizationProvider>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}