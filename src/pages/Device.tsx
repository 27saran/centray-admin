//import { useParams } from "react-router-dom";
import { Box, Container, Stack, Typography } from "@mui/material";
import { NavLayout } from "@/layouts/nav/layout";
import { DeviceTable } from "@/layouts/device/Table";
//import { useGetDevices } from "@/features/device/hooks/useGetDevices";

export const Device = () => {
  //const { device_type } = useParams();
  //const { data: devicesRes } = useGetDevices();

  //const devicePrefix = device_type == 'operation_present_box' ? 'PresentBox' : 'Import SpreadSheet';

  return (
    <NavLayout>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h2">Device</Typography>
            <DeviceTable datas={[]} />
          </Stack>
        </Container>
      </Box>
    </NavLayout>
  );
};
