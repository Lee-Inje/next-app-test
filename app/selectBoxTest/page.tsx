'use client';

import SelectBox from '@/test/SelectBox/selectBox'; 
import {  useState } from "react";

export default function TestSelect() {

    const [category , setCategory] = useState<string>('');
    const [item , setItem] = useState<string>('');
    const [subItem , setSubItem] = useState<string>('');


  return (
    <div>
        <div style={{ display: 'flex', justifyContent:"center", alignItems :"center", height: '30vh' , width:"100%" , gap: '16px'}}>
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
        </div>

        <div style={{ display: 'flex', justifyContent:"center", alignItems :"center", height: '30vh' , width:"100%" , gap: '16px'}}>
            <div>category : {category} </div><div>item : {item} </div><div>subItem : {subItem} </div>
        </div>
    </div>
  );
}
