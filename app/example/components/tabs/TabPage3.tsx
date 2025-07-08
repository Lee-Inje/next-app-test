import UsersGridPage from "@/app/example/page";
import { useTabStore } from "../../store/tabStore";
import UserSelectForm from "../UserSelectForm";
import { Box, Typography } from "@mui/material";
import SelectBoxViewComp from "../SelectBoxViewComp";

// /components/tabs/TabPage3.tsx
export default function TabPage3() {

  const selectedTab = useTabStore((state) => state.selectedTab);

    
  return (

    // <div><UserSelectForm/></div>

    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography>📁 페이지 3 내용</Typography>
      {/* <UserSelectForm/> */}
  </Box>

  );
}