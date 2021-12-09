import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    fontFamily: "Prompt",
    display: "flex",
    maxWidth: "100vw",
    overflowX: "hidden",
  },
  typography: {
    fontFamily: "Prompt",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100vw - 240px)`,
    minHeight: "100vh",
  },
  contentShift: {
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
  link: {
    "&:not(:first-child)": {
      paddingLeft: 15,
    },
    textDecoration: "none",
    "&:hover": {
      color: "#C172FE",
      textDecoration: "none",
    },
  },
}));
