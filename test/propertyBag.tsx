import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { Property, PROPERTY_TYPE,  TEST_PROPERTY,  usePropertyStore } from "./propertyStore";
import { useEffect } from "react";


function FormFactory( {p} : {p : Property} ) {

    const updateItem = usePropertyStore((s) => s.updateItem);
    const setValue = (value:any) => {
        updateItem(p._id ,  {extVal : value} );
    }    

    return (
        <FormControl style={{border: '1px solid blue' , marginBottom: '10px'}}>
            { 
                p.type == PROPERTY_TYPE.TEXT ? <TextField value={p.extVal} onChange={(e) => setValue(e.target.value)}></TextField> :
                p.type == PROPERTY_TYPE.INPUT ? <Input value={p.extVal} onChange={(e) => setValue(e.target.value)}></Input> :
                p.type == PROPERTY_TYPE.COMBO ? 
                    <Select value={p.extVal} onChange={(e:SelectChangeEvent) => setValue(e.target.value)}>
                    {
                        p.options?.map((t) => (<MenuItem value={t.key}>{t.txt}</MenuItem>))
                    }
                    </Select>:
                p.type == PROPERTY_TYPE.COMBO_YN ? <Select value={p.extVal} onChange={(e:SelectChangeEvent) => setValue(e.target.value)}><MenuItem value="Y">Y</MenuItem><MenuItem value="N">N</MenuItem></Select> :
                <div>알수없는 타입</div>        
            }
            <FormHelperText id="my-helper-text">key:{p.extAttr} id:{p._id}</FormHelperText>
        </FormControl>
    );
} 

export default function PropertyBag() {

    const setItems  = usePropertyStore((s) => s.setItems);
    const up = usePropertyStore((s) => s.moveUp);
    const down = usePropertyStore((s) => s.moveDown);
    const del = usePropertyStore((s) => s.remove);
    const items = usePropertyStore((s) => s.items);


    useEffect(() => {
       setItems(TEST_PROPERTY); //  초기값 셋팅
    } , []);

    return (
        <>
            {items.map((item) => (
                <div key={item._id}>
                <FormFactory p={item}></FormFactory> 
                <Button onClick={() => up(item._id)}>위로</Button> 
                <Button onClick={() => down(item._id)}>아래</Button> 
                <Button onClick={() => del(item._id)}>삭제</Button> 
                </div>
            ))}
        </>
    );
}
