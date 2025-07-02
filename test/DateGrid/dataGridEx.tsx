import { DataGrid, DataGridProps, GridPaginationModel } from "@mui/x-data-grid";
import { typeUseGridFormState } from "../FormState";


interface WithId {
  _id: string;
}

interface GridState<T> {
    list : T[];
    rowCount: number;
    paginationModel: GridPaginationModel;
    setPaginationModel: (model: GridPaginationModel) => void;
}

interface DataGridExProps<T extends WithId> extends Omit<DataGridProps, 'rows' | 'rowCount' | 'paginationModel' | 'onPaginationModelChange'> {
    grid: typeUseGridFormState<T>;
}

export default function DataGridEx<T extends WithId>( {grid , columns , ...rest } : DataGridExProps<T>) {


    return (
        <DataGrid rows={grid.list}
            columns={columns}
            getRowId={(row) => row._id} 
            rowCount={grid.rowCount}
            pagination
            paginationMode="server"
            paginationModel={grid.paginationModel}
            onPaginationModelChange={grid.setPaginationModel}
            pageSizeOptions={[3 ,5, 10, 20]} 
            {...rest}
        />
    );
}