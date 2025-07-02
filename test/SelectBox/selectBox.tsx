'use client';

import { useEffect, useState } from 'react';
import { eventBus } from './evnetBus';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  SxProps,
  Theme,
} from '@mui/material';

interface SelectBoxProps {
  label: string;
  value : string;
  onChange : (value:string) => void;
  eventKey: string;
  dependsOn?: string[]; 
  getApiUrl: (depValues: Record<string, string>) => string | null;
  sx?: SxProps<Theme>,
}

export default function SelectBox({
  label,
  value = "",
  onChange,
  eventKey,
  dependsOn = [],
  getApiUrl,
  sx = {}
}: SelectBoxProps) {
  const [options, setOptions] = useState<{key:string , txt:string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {

    if (dependsOn.length === 0) {
      const url = getApiUrl({});
      fetchOptions(url);
      return;
    }

    const handlers: Record<string, (val: string) => void> = {};
    dependsOn.forEach((key) => {
      handlers[key] = (val: string) => {
        onChange(''); 
        setOptions([]);

        if(val != '') {
          const url = getApiUrl({ [key] : val });
          fetchOptions(url);
        }
      };
      eventBus.on(key, handlers[key]);
    });

    return () => {
      dependsOn.forEach((key) => eventBus.off(key, handlers[key]));
    };

  }, []);

  useEffect(() => {
    eventBus.emit(eventKey, value);
  }, [value]);


  const fetchOptions = async (url: string | null) => {
    if (!url) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setOptions(Array.isArray(data) ? data : data.items || []);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl margin="normal" disabled={loading} >
      <InputLabel id={`${eventKey}-label`}>{label}</InputLabel>
      <Select
        labelId={`${eventKey}-label`}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        sx={sx}
      >
        <MenuItem value="">Select {label}</MenuItem>
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
            Loading...
          </MenuItem>
        ) : (
          options.map((opt) => (
            <MenuItem key={opt.key} value={opt.key}>
              {opt.txt}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
