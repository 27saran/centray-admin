import { useCallback, useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { SideNav } from "@/layouts/nav/sideNav";
import { TopNav } from "@/layouts/nav/topNav";

const SIDE_NAV_WIDTH = 280;

type LayoutProps = {
  children: ReactNode;
};

export const NavLayout = (props: LayoutProps) => {
  const { children } = props;
  const location = useLocation();
  const [openNav, setOpenNav] = useState(false);

  const handleNavChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handleNavChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location]
  );

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});
