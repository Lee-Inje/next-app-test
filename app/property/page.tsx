"use client"

import PropertyBag from "@/test/propertyBag";
import {  COMMON_CODE, PROPERTY_TYPE, usePropertyStore } from "@/test/propertyStore";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import {  useState } from "react";


export default function PropertyPage() {

    const items = usePropertyStore((s) => s.items);
        const append = usePropertyStore((s) => s.append);
        const clear = usePropertyStore((s) => s.clear);
        const commCd = COMMON_CODE;
    
        const [type , setType] = useState<string>()
    
        const addProperty = () => {
            switch(type) {
              case "TEXT" : append({extAttr:'newItem' , extVal : '' , type : PROPERTY_TYPE.TEXT}); return; 
              case "COMBO" : append({extAttr:'newItem' , extVal : '' , type : PROPERTY_TYPE.COMBO , options:[{key:'aa1' , txt : '항목1'} , {key:'aa2' , txt : '항목2'} ] }); return; 
              case "COMBOYN" : append({extAttr:'newItem' , extVal : 'Y' , type : PROPERTY_TYPE.COMBO_YN}); return;
              case "COMBOSYS1" : append({extAttr:'newItem' , extVal : 'Y' , type : PROPERTY_TYPE.COMBO , options:commCd.ALLOC_STAT_CD}); return;
              case "COMBOSYS2" : append({extAttr:'newItem' , extVal : 'Y' , type : PROPERTY_TYPE.COMBO , options:commCd.EXAM_STAT}); return; 
              default : return;
            }
        }

    return(
    <div className="grid ">
        <Grid size={2} >
          <Grid size={12} >
            <PropertyBag/>
          </Grid> 
        </Grid>
        <div>{JSON.stringify(items)}</div>
        <div style={{width: '50%' , marginTop:'20px'}}>
          <FormControl fullWidth>
            <InputLabel id="select-label">사용 여부</InputLabel>
            <Select
              labelId="select-label"
              value={type}
              label="사용 여부"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="TEXT">Text</MenuItem>
              <MenuItem value="COMBO">Combo</MenuItem>
              <MenuItem value="COMBOYN">ComboYn</MenuItem>
              <MenuItem value="COMBOSYS1">배정상태 코드</MenuItem>
              <MenuItem value="COMBOSYS2">시험상태</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={ addProperty }>추가</Button>
          <Button onClick={ clear }>초기화</Button>
        </div>
    </div>
    );
}