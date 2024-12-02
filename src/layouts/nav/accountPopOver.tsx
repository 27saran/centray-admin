import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentAdminState } from "@/features/login/states/currentAdminState";
import { useLogin } from "@/features/login/hooks/useLogin";

type AccountPopoverProps = {
  anchorEl: any;
  onClose: () => void;
  open: boolean;
};

export const AccountPopover = (props: AccountPopoverProps) => {
  const { anchorEl, onClose, open } = props;
  const navigate = useNavigate();
  const currentAdmin = useRecoilValue(currentAdminState);
  const { handleLogout } = useLogin();

  const handleSignOut = useCallback(() => {
    onClose?.();
    handleLogout();
    navigate("/login");
  }, [onClose, handleLogout, navigate]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
      <Typography variant="overline">Account</Typography>
      <Typography color="text.secondary" variant="body2">
        {currentAdmin?.name}
        <Typography component="span" color="text.secondary" variant="body2">
          ({currentAdmin?.roles.join(", ")})
        </Typography>
      </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};
