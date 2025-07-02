import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid";

export type typeOfTableForm<T extends readonly { field: string }[]> = {
    [K in T[number]['field']]: string;
} & { _id: string };

export default function useObjectFormState<T extends {}>(initObject:T) {

    const [data , setData ] = useState<T>(initObject);

    const update = (obj:Partial<T>) => {
        setData({...data , ...obj});
    };

    const setKeyValue = (key: string , value : any) => {
        setData({...data , [key] : value})
    };

    return {
        data,
        update,
        setKeyValue,
    };
}

interface WithId {
  _id: string;
}

export function useListFormState<T extends WithId>(initList : Omit<T,'_id'> []){

    const initialList: T[] = initList.map(item => ({
        ...item,
        _id: uuidv4()
    })) as T[];

    const [list , setList] = useState<T[]>(initialList);

    const set = (items : Partial<Omit<T, '_id'>> []) => {
        setList([]);
        items.map((item) => {
            append(item);
        }); 
    }

    const append = (item: Partial<Omit<T, '_id'>>) => {
        setList(prev => [...prev, { ...item, _id: uuidv4() } as T]);
    };

    const update = (_id: string, obj: Partial<Omit<T, '_id'>>) => {
        setList(prev => prev.map(item => item._id === _id ? { ...item, ...obj } : item));
    };

    const setKeyValue = (_id: string, key: keyof Omit<T, '_id'>, value: any) => {
        setList(prev =>
            prev.map(item =>
            item._id === _id ? { ...item, [key]: value } : item
            )
        );
    };

    const remove = (_id: string) => {
        setList(prev => prev.filter(item => item._id !== _id));
    };

    const moveTo = (_id: string, targetIndex: number) => {
        setList(prev => {
        const currentIndex = prev.findIndex(item => item._id === _id);
        if (currentIndex === -1) return prev; // _id 없으면 변경 없음

        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= prev.length) targetIndex = prev.length - 1;
        if (currentIndex === targetIndex) return prev; // 위치 같으면 변경 없음

        const newList = [...prev];
        const [movedItem] = newList.splice(currentIndex, 1);
        newList.splice(targetIndex, 0, movedItem);
        return newList;
        });
    };

    const up = (_id: string) => {
        const idx = list.findIndex(item => item._id === _id);
        if (idx > 0) {
            moveTo(_id, idx - 1);
        }
    };

    const down = (_id: string) => {
        const idx = list.findIndex(item => item._id === _id);
        if (idx !== -1 && idx < list.length - 1) {
            moveTo(_id, idx + 1);
        }
    };

    return {
        list,
        append,
        update,
        remove,
        moveTo,
        up,
        down,
        set
    }
}

export function useGridFormState<T extends WithId>(initGrid : Omit<T,'_id'> []){

    const initialList: T[] = initGrid.map(item => ({
        ...item,
        _id: uuidv4()
    })) as T[];

    const [list , setList] = useState<T[]>(initialList);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 3,
      });

    const setGrid = (items : Partial<Omit<T, '_id'>> []) => {
        setList([]);
        items.map((item) => {
            append(item);
        }); 
    }
    
    const append = (item: Partial<Omit<T, '_id'>>) => {
        setList(prev => [...prev, { ...item, _id: uuidv4() } as T]);
    };

    const update = (_id: string, obj: Partial<Omit<T, '_id'>>) => {
        setList(prev => prev.map(item => item._id === _id ? { ...item, ...obj } : item));
    };

    const setKeyValue = (_id: string, key: keyof Omit<T, '_id'>, value: any) => {
        setList(prev =>
            prev.map(item =>
            item._id === _id ? { ...item, [key]: value } : item
            )
        );
    };

    const fnDataLoad = useRef<() => Promise<void> | null>(null);

    const setDataLoadFuntion = (fn: () => Promise<void>) => {
        fnDataLoad.current = fn;
    };

    const callFnDataLoad= async () => {
        fnDataLoad.current?.();
    };

    useEffect(() => {
        callFnDataLoad();
    },[paginationModel]);

    return {
        list,
        setGrid,
        append,
        update,
        setKeyValue,
        setDataLoadFuntion,
        setLoading,
        //---- 
        paginationModel,
        setPaginationModel,
        setRowCount,
        rowCount,
    };

}

export type typeUseGridFormState<T extends WithId> = ReturnType<typeof useGridFormState<T>>;
