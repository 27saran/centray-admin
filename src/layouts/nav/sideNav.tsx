import { useLocation } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SimpleBar from "simplebar-react";
import { items } from "@/layouts/nav/config";
import { SideNavItem } from "@/layouts/nav/sideNavItem";
import { useRecoilValue } from "recoil";
import { currentAdminState } from "@/features/login/states/currentAdminState";

type SideNavProps = {
  onClose: () => void;
  open: boolean;
};

export const SideNav = (props: SideNavProps) => {
  const { open, onClose } = props;
  const location = useLocation();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const Scrollbar = styled(SimpleBar)``;
  const currentAdmin = useRecoilValue(currentAdminState);

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component="a"
            sx={{
              display: "inline-flex",
              height: 32,
              width: 32,
            }}
          ></Box>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              p: "12px",
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1">
                {currentAdmin?.name}
              </Typography>
              <Typography color="neutral.400" variant="body2">
                {import.meta.env.VITE_APP_ENV}
              </Typography>
            </div>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              const active = item.path
                ? location.pathname === item.path
                : false;
              // 現在ログイン中のadminのrolesによって、表示可能なアイテムを制限する
              if (item.roles && !item.roles.some(role => currentAdmin?.roles.includes(role))) {
                return null;
              }

              return (
                <SideNavItem
                  active={active}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        ></Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};
