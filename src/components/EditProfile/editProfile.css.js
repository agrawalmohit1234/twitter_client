import { makeStyles } from "@material-ui/core/styles";

export const editProfileStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: "middle",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
}));
