import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  Event as EventIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
//import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

//var checkUserType = localStorage.getItem("dataAuth");
//var checkUserType = "";
//var chkUserType = checkUserType ? localStorage.getItem("dataAuth") : "";

//console.log(typeLogin);
//console.log(chkUserType.USER_TYPE);
//if(chkUserType.)
//if (chkUserType.USER_TYPE === "student") {
const student_menu = [
  { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  {
    id: 1,
    label: "ตารางกิจกรรม",
    link: "/app/events",
    icon: <EventIcon />,
  },
  { id: 6, type: "title", label: "รายงาน" },
  {
    id: 7,
    label: "Library",
    link: "/app/xml",
    icon: <LibraryIcon />,
  },
  {
    id: 8,
    label: "Support",
    link: "/app/xyz",
    icon: <SupportIcon />,
  },
  {
    id: 9,
    label: "FAQ",
    link: "/app/abc",
    icon: <FAQIcon />,
  },
];
//
const user_menu = [
  { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  {
    id: 1,
    label: "รายชื่อนักศึกษาทุน",
    link: "/app/students",
    icon: <TypographyIcon />,
  },
  { id: 2, label: "ข้อมูลทุน", link: "/app/tables", icon: <TableIcon /> },
  {
    id: 3,
    label: "ข้อมูลผู้ดูแลทุน",
    link: "/app/notifications",
    icon: <NotificationsIcon />,
  },
  {
    id: 4,
    label: "ปีการศึกษา",
    link: "/app/ems",
    icon: <UIElementsIcon />,
  },
  { id: 5, type: "divider" },
  { id: 6, type: "title", label: "รายงาน" },
  {
    id: 7,
    label: "Library",
    link: "/app/xml",
    icon: <LibraryIcon />,
  },
  {
    id: 8,
    label: "Support",
    link: "/app/xyz",
    icon: <SupportIcon />,
  },
  {
    id: 9,
    label: "FAQ",
    link: "/app/abc",
    icon: <FAQIcon />,
  },
];

//const structure = structurex;
function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  var checkUserType = localStorage.getItem("dataAuth")
    ? localStorage.getItem("dataAuth")
    : "";

  var chkUserType = checkUserType ? JSON.parse(checkUserType) : "";
  const typeLogin = chkUserType.USER_TYPE;
  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {typeLogin === "student"
          ? student_menu.map((link) => (
              <SidebarLink
                key={link.id}
                location={location}
                isSidebarOpened={isSidebarOpened}
                {...link}
              />
            ))
          : user_menu.map((link) => (
              <SidebarLink
                key={link.id}
                location={location}
                isSidebarOpened={isSidebarOpened}
                {...link}
              />
            ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
