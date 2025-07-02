'use client';

import DataGridEx from "@/test/DateGrid/dataGridEx";
import { createFormObjectStore } from "@/test/FormEx/FormStore";
import useObjectFormState, {  useListFormState  , typeOfTableForm, useGridFormState} from "@/test/FormState";
import SelectBoxTest from "@/test/SelectBox/selectBox";
import { Box, Button, FormControl, FormControlLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridEventListener, GridEventLookup, GridEvents, GridRowParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

// grid type 정의 
const columns : GridColDef<any>[] = [
    { field: 'pKey', headerName: '부모키', width: 70 },
    { field: 'key', headerName: '키', width: 150 },
    { field: 'txt', headerName: '텍스트', width: 100 },
    { field: 'bbb', headerName: '추가버튼', width: 100 , renderCell(params) { return(<Button onClick={() => alert('버튼클릭')}>버튼</Button>) },  },
    ] as const;;
type Item = typeOfTableForm<typeof columns>;
// grid type 정의 //

export default function TestFormPage() {

    const [info , setInfo] = useState('');
    const grid = useGridFormState<Item>([]); 
    
    const loadData = async () => {
        try {
           const res = await fetch(`http://localhost:4000/items?_page=${grid.paginationModel.page+1}&_limit=${grid.paginationModel.pageSize}`);
           const totalCount = Number(res.headers.get('X-Total-Count') ?? 0);
           if (!res.ok) throw new Error('API error');
           const data = await res.json();
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

   const onCellClick = (params : GridCellParams) => consolLog('onCellClick' , [params.id , params.colDef , params.field]);
   const onRowDoubleClick = (params : any) => consolLog('onRowDoubleClick' ,params);
   const onRowClick = (params : any) => consolLog('onRowClick' ,params);
  //  test //
   
  return (
    <div>
        <div style={{ display: 'flex', justifyContent:"center", alignItems :"center", height: '50vh' , width:"100%" , gap: '16px'}}>
            <Box sx={{width:'700px'}}>
                <DataGridEx 
                    grid={grid} 
                    columns={columns} 
                    onCellClick={ onCellClick   }
                    onRowDoubleClick={ onRowDoubleClick } 
                    onRowClick={ onRowClick }
                />
            </Box>
        </div>
        <div>{grid.paginationModel.page} {grid.paginationModel.pageSize}</div>
        <div>{info}</div>
    </div>
  );
}
