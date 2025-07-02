"use client"

import PropertyBag from "@/test/propertyBag";
import {  COMMON_CODE, PROPERTY_TYPE, usePropertyStore } from "@/test/propertyStore";
import { Box, Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import Link from "next/link";
import {  useState } from "react";


export default function Home() {

  return (
    <div style={{ display: 'flex', justifyContent:"center", alignItems :"center", height: '100vh' , width:"100%" , gap: '15px'}}>
        <ButtonGroup sx={{gap: '15px'}}>
          <Button><Link href='/property'>속성창</Link></Button>
          <Button><Link href='/selectBoxTest'>api 연동 콤보박스</Link></Button>
          <Button><Link href='/form'>입력폼</Link></Button>
        </ButtonGroup>
    </div>
  );
}
