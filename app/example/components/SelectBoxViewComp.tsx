import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useSelectBoxModel } from "../store/SelectBoxModel";


export default function SelectBoxViewComp() {

    const { schoolCombo, gradeCombo, selectedSchoolCode, selectedGradeCode, handleSchoolChange, handleGradeChange } = useSelectBoxModel();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography>학교 선택</Typography>
            <Select size="small" sx={{ width: 170 }} label="학교선택" variant="outlined"
                value={selectedSchoolCode}
                onChange={handleSchoolChange}
            >
                <MenuItem key={''} value={''}>선택해주세요</MenuItem>
                {schoolCombo.map((item) => (
                    <MenuItem key={item.schoolCode} value={item.schoolCode}>{item.schoolName}</MenuItem>
                ))}
            </Select>

            <Typography>학년 선택</Typography>
            <Select size="small" sx={{ width: 170 }} label="학년선택" variant="outlined"
                value={selectedGradeCode}
                onChange={handleGradeChange}
            >
                <MenuItem key={''} value={''}>선택해주세요</MenuItem> 
                {gradeCombo.map((item) => (
                    <MenuItem key={item.gradeCode} value={item.gradeCode}>{item.gradeName}</MenuItem>
                ))}
            </Select>
        </Box>
    )
}