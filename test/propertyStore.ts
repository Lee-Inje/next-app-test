import { useStore } from "zustand";
import { createListStore, WithId } from "./ListStore";



export const enum PROPERTY_TYPE {
    TEXT , INPUT , COMBO , COMBO_SYSTEM , COMBO_YN   
}

export interface Property extends WithId {
    type: PROPERTY_TYPE;
    extAttr: string;
    extVal: string;
    isDisable?: boolean;
    options? : {key: string , txt: string}[];
    ext? : {};
}

export const propertyStore = createListStore<Property>();
export const usePropertyStore = <T>(selector: (state : ReturnType<typeof propertyStore.getState>) => T) => useStore(propertyStore , selector );

// -- 테스트 데이타 셋팅 
export const TEST_PROPERTY:Property[] = [
    {_id : '' , type:PROPERTY_TYPE.TEXT , extAttr: 'A_TEXT' , extVal : 'A일반텍스트'},
    {_id : '' , type:PROPERTY_TYPE.TEXT , extAttr: 'B_TEXT' , extVal : 'B일반텍스트'},
    {_id : '' , type:PROPERTY_TYPE.INPUT , extAttr: 'A_INPUT' , extVal : 'A입력텍스트'},
    {_id : '' , type:PROPERTY_TYPE.INPUT , extAttr: 'B_INPUT' , extVal : 'B입력텍스트'},
    {_id : '' , type:PROPERTY_TYPE.COMBO_YN , extAttr: 'A_SELECT_YN' , extVal : 'Y'},
];

export const COMMON_CODE = {
    ALLOC_STAT_CD : [ {key: '01' , txt: '미배정'} , {key: '02' , txt: '배정중'} , {key: '03' , txt: '배정완료'}] ,
    EXAM_STAT : [ {key: 'BEFORE' , txt: '대기'} , {key: 'END' , txt: '종료'} , {key: 'ING' , txt: '진행'}] ,
}
;
