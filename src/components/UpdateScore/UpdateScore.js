import React from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import {
  Typography,
  TextField,
  Button,
  makeStyles,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import Spinner from "../Spinner/Spinner";
import useScores from "./InputHook";
// import makeStyles from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: grey[200],
    height: "calc(100vh - 90px)",
    padding: theme.spacing(2)
    // paddingTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(3, 2)
  },
  textField: {
    marginBottom: theme.spacing(4),
    width: "100%"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateScore = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ids = {
    eventId: props.eventId,
    levelId: props.levelId,
    teamId: props.teamId
  };
  // const paramIds = [];
  // if (props.params_info !== undefined) {
  //   for (let parameter of props.params_info) {
  //     paramIds.push(parameter.parameter_id);
  //   }
  // }

  const { handleSubmit, handleInputChange, inputs } = useScores();
  return (
    <div>
      {props.params_info === undefined ? (
        <Spinner />
      ) : (
        <div className={classes.container}>
          <Paper className={classes.paper}>
            <Typography variant="h4">Update Score</Typography>
            <Typography>
              Please type in the updated scores and comments:
            </Typography>

            {props.params_info.map((parameter, index) => {
              const { parameter_name, parameter_id } = parameter;

              return (
                <div id={parameter_id} key={index}>
                  <Typography variant="caption">{parameter_name}</Typography>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      id="score"
                      label="Score"
                      className={classes.textField}
                      margin="normal"
                      onChange={handleInputChange}
                      value={inputs.score}
                    />
                    <TextField
                      id="comments"
                      label="Comments"
                      className={classes.textField}
                      margin="normal"
                      onChange={handleInputChange}
                      value={inputs.comments}
                    />
                  </form>
                </div>
              );
            })}
            <Button
              variant="contained"
              color="primary"
              className="button"
              onClick={() => props.updateScore(ids)}
            >
              <div
                onClick={() => {
                  if (!props.updateScoreError) return handleClickOpen;
                  else return null
                }}
              >
                Update
              </div>
            </Button>
          </Paper>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Use Google's location service?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Let Google help apps determine location. This means sending
                anonymous location data to Google, even when no apps are
                running.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={handleClose} color="primary">
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    eventId: state.teams.eventId,
    levelId: state.teams.levelId,
    teamId: state.score.teamId,
    params_info: state.score.params_info,
    updateScoreError: state.score.updateScoreError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateScore: ids => dispatch(actions.post_score_update(ids))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateScore);
