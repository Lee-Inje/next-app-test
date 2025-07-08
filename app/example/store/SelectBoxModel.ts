import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";


interface SchoolModel {
    schoolCode: string;
    schoolName: string;
}

interface GradeModel {
    gradeCode: string;
    gradeName: string;
    schoolCode: string;
}

export function useSelectBoxModel() {

    const gradeData = [
        { gradeCode: 'grade_code_01', gradeName: '1학년', schoolCode: 'sch_code_01' },
        { gradeCode: 'grade_code_02', gradeName: '2학년', schoolCode: 'sch_code_01' },
        { gradeCode: 'grade_code_03', gradeName: '3학년', schoolCode: 'sch_code_01' },
        { gradeCode: 'grade_code_04', gradeName: '4학년', schoolCode: 'sch_code_01' },
        { gradeCode: 'grade_code_05', gradeName: '5학년', schoolCode: 'sch_code_01' },
        { gradeCode: 'grade_code_06', gradeName: '6학년', schoolCode: 'sch_code_01' },
        { gradeCode: 'grade_code_07', gradeName: '1학년', schoolCode: 'sch_code_02' },
        { gradeCode: 'grade_code_08', gradeName: '2학년', schoolCode: 'sch_code_02' },
        { gradeCode: 'grade_code_09', gradeName: '3학년', schoolCode: 'sch_code_02' },
        { gradeCode: 'grade_code_13', gradeName: '1학년', schoolCode: 'sch_code_03' },
        { gradeCode: 'grade_code_14', gradeName: '2학년', schoolCode: 'sch_code_03' },
        { gradeCode: 'grade_code_15', gradeName: '3학년', schoolCode: 'sch_code_03' },
    ]


    const [schoolCombo, setSchoolCombo] = useState<SchoolModel[]>(
        [
            { schoolCode: 'sch_code_01', schoolName: '초등학교' },
            { schoolCode: 'sch_code_02', schoolName: '중학교' },
            { schoolCode: 'sch_code_03', schoolName: '고등학교' },
        ]
    );

    const [gradeCombo, setGradeCombo] = useState<GradeModel[]>([]);
    

    const [selectedSchoolCode, setSelectedSchoolCode] = useState<string>('');
    const [selectedGradeCode, setSelectedGradeCode] = useState<string>('');

    const handleSchoolChange = (event: SelectChangeEvent<string>) => {
        setSelectedSchoolCode(event.target.value);
        setGradeCombo([]);
        setGradeCombo(gradeData.filter(item => item.schoolCode === event.target.value));
    };

    const handleGradeChange = (event: SelectChangeEvent<string>) => {
        setSelectedGradeCode(event.target.value);
    };

    return {
        schoolCombo,
        setSchoolCombo,
        gradeCombo,
        setGradeCombo,
        selectedSchoolCode,
        selectedGradeCode,
        handleSchoolChange,
        handleGradeChange
    }
}
