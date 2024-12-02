import { SvgIcon } from "@mui/material";
import RedeemIcon from "@mui/icons-material/Redeem";
import PlaceIcon from "@mui/icons-material/Place";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import EngineeringIcon from "@mui/icons-material/Engineering";
import TableRowsIcon from "@mui/icons-material/TableRows";
import SecurityIcon from "@mui/icons-material/Security";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import Notifications from "@mui/icons-material/Notifications";

type SidebarItemProps = {
  title: string;
  path: string;
  icon: React.ReactElement;
  roles?: string[];
};

export const AreaFragmentAnchorRoles = ["admin", "qonoq_admin", "anchor"];
export const AreaFragmentGeoSpatialRoles = [
  "admin",
  "qonoq_admin",
  "geo_spatial",
];
export const AreaFragmentGpsRoles = ["admin", "qonoq_admin", "gps"];
export const AreaFragmentMarkerRoles = ["admin", "qonoq_admin", "marker"];
export const PresentBoxRoles = ["admin", "qonoq_admin", "present_box"];
export const MasterTableRoles = [
  "admin",
  "qonoq_admin",
  "anchor",
  "geo_spatial",
  "gps",
  "marker",
];
export const AdminsRoles = ["admin", "qonoq_admin"];
export const AdminOnlyRole = ["admin"];

export const items: SidebarItemProps[] = [
  {
    title: "Anchor AreaFragment",
    path: "/area_fragments/anchor",
    icon: <SvgIcon component={PlaceIcon} />,
    roles: AreaFragmentAnchorRoles,
  },
  {
    title: "GeoSpatial AreaFragment",
    path: "/area_fragments/geo_spatial",
    icon: <SvgIcon component={PlaceIcon} />,
    roles: AreaFragmentGeoSpatialRoles,
  },
  {
    title: "GPS AreaFragment",
    path: "/area_fragments/gps",
    icon: <SvgIcon component={PlaceIcon} />,
    roles: AreaFragmentGpsRoles,
  },
  {
    title: "Marker AreaFragment",
    path: "/area_fragments/marker",
    icon: <SvgIcon component={PlaceIcon} />,
    roles: AreaFragmentMarkerRoles,
  },
  {
    title: "Verify AreaFragment",
    path: "/area_fragments/verify",
    icon: <SvgIcon component={PlaceIcon} />,
    roles: MasterTableRoles,
  },
  {
    title: "Area Fixed Reward",
    path: "/area_fixed_rewards",
    icon: <SvgIcon component={MilitaryTechIcon} />,
    roles: MasterTableRoles,
  },
  {
    title: "Area Random Reward",
    path: "/area_random_rewards",
    icon: <SvgIcon component={MilitaryTechIcon} />,
    roles: MasterTableRoles,
  },
  {
    title: "Random Reward Detail",
    path: "/random_reward_details",
    icon: <SvgIcon component={MilitaryTechIcon} />,
    roles: MasterTableRoles,
  },
  {
    title: "PresentBox",
    path: "/present_boxes",
    icon: <SvgIcon component={RedeemIcon} />,
    roles: PresentBoxRoles,
  },
  {
    title: "PushNotification",
    path: "/push_notifications",
    icon: <SvgIcon component={Notifications} />,
    roles: AdminsRoles,
  },
  {
    title: "Vc Payment Manager",
    path: "/vc_payment_managers",
    icon: <SvgIcon component={AttachMoneyIcon} />,
    roles: AdminOnlyRole,
  },
  {
    title: "Maintenance",
    path: "/maintenances",
    icon: <SvgIcon component={EngineeringIcon} />,
    roles: AdminOnlyRole,
  },
  {
    title: "Master Table",
    path: "/master_tables",
    icon: <SvgIcon component={TableRowsIcon} />,
    roles: MasterTableRoles,
  },
  {
    title: "PresentBox Audit",
    path: "/audits/operation_present_box",
    icon: <SvgIcon component={SecurityIcon} />,
    roles: AdminsRoles,
  },
  {
    title: "Import SpreadSheet Audit",
    path: "/audits/import_spreadsheet",
    icon: <SvgIcon component={SecurityIcon} />,
    roles: AdminsRoles,
  },
  {
    title: "App Version",
    path: "/app_versions",
    icon: <SvgIcon component={AutorenewIcon} />,
    roles: AdminOnlyRole,
  },
];
