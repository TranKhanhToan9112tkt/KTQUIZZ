import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import useTitle from "../hooks/useTitle";
import { VideoCard } from "material-ui-player";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { getGrammar } from "../redux/actions/grammarAction";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { cloudinaryImgOptimize } from "helper";
import { DEFAULTS } from "../constants/index";
import incorrectIcon from "assets/icons/checkAnswer/incorrect.gif";
import correctIcon from "assets/icons/checkAnswer/correct.gif";
import { setMessage } from "redux/actions/messageAction";
import grammarApi from "apis/grammarApi";


const useStyle = makeStyles(() => ({
  borderTopic: {
    borderStyle: "solid",
    borderColor: "initial",
    borderWidth: "1px",
    backgroundColor: "#ccff66",
    width: "700px",
    height: "auto",
  },
  grammarbox: {
    backgroundColor: "#99ffff",
    padding: "10px 10px",
    border: "1px solid #666",
    color: "black",

    marginBottom: "10px",
  },
  picture: {
    width: "50rem",
    height: "30rem",
    marginLeft: "15rem",
  },
  tabcontents: {
    border: "1px solid #2eb8b8",
    padding: "10px",
    backgroundColor: "#FFF",
    borderRadius: "0 3px 3px 3px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function GrammarPage() {
  useTitle("Grammar");
  const classes = useStyle();
  const [value, setValue] = useState(0);
  const [checkAnswer, setCheckAnswer] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);


  const grammarId = useParams().id;
  const { grammar, questions } = useSelector((state) => state.grammarReducer);

  const dispatch = useDispatch();
  useEffect(() => dispatch(getGrammar(grammarId), [dispatch]));

  const [answers, setAnswers] = useState([]);

  const getText = (text) => {
    let Text = [];
    if (text) {
      Text = text.split("\n");
    }
    return Text;
  };

  let imgSrc = null;
  if (grammar) {
    imgSrc = cloudinaryImgOptimize(
      grammar.Image ? grammar.Image : DEFAULTS.IMAGE_SRC,
      200,
      200,
      true,
      true
    );
  }

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };
  const [isCorrect, setisCorrect] = useState([]);

  const handleClickShowAnswer = () => {
    setShowAnswer(true);
    // setCheckAnswer(true);
  };

  const handleClickReset = () => {
    if (window.confirm("Do you want reload page again?")) {
      window.location.reload();
    }
  };

  const handleCheck = (index, i) => {
    if (answers[index]) {
      if (answers[index].includes(i)) {
        for (var j = 0; j < answers[index].length; j++) {
          if (answers[index][j] == i) {
            answers[index].splice(j, 1);
          }
        }
      } else {
        answers[index].push(i);
      }
    } else {
      let ar = [];
      answers[index] = ar;
      answers[index].push(i);
    }
  };

  const handleClickCheckAnswer = () => {
  const countQues = questions.length;
  if (answers.length > 0) {
    const correctAnswersCount = answers.reduce((count, answer, index) => {
      if (answer) {
        if (answer.length > 0) {
          let numberCorrect = 0;
          for (let j = 0; j < questions[index].Answers.length; j++) {
            if (questions[index].Answers[j].isCorrect === true) {
              numberCorrect += 1;
            }
          }
          if (numberCorrect === answer.length) {
            let isCorrect = true;
            for (let k = 0; k < answer.length; k++) {
              if (questions[index].Answers[answer[k]].isCorrect === false) {
                isCorrect = false;
                break;
              }
            }
            if (isCorrect) {
              return count + 1;
            }
          }
        }
      }
      return count;
    }, 0);
    
    //comment
    console.log(grammar.isLocked);

    localStorage.setItem("grammarId", grammarId);
    localStorage.setItem("correctAnswers", correctAnswersCount.toString());

    const message = `Bạn đã trả lời đúng ${correctAnswersCount}/${countQues} câu hỏi`;
    dispatch(setMessage(message));
  } else {
    if (window.confirm("Chọn đáp án cho tất cả câu hỏi.")) {
      window.close();
    }
  }
  setCheckAnswer(true);
  // setShowAnswer(true);
};

  return (
    <>
      <Container>
        <>
          <Typography variant="h6" align="center">
            {grammar.Title}
          </Typography>
          <Typography>{grammar.Content}</Typography>
        </>

        {grammar.Video ? (
          <div>
            <VideoCard
              src={isPlaying === true && grammar.Video}
              onEnded={() => setIsPlaying(false)}
            ></VideoCard>
          </div>
        ) : (
          <img className={classes.picture} src={imgSrc} alt="" align="center" />
        )}

        {/* {grammar.Audio && (
          <audio controls>
            <source src={grammar.Audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )} */}

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "#2eb8b8",
              color: "white",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              indicatorColor="primary"
            >
              <Tab label="Content" {...a11yProps(0)} />
              {/* <Tab label="Script" {...a11yProps(0)} /> */}
              <Tab label="Grammar" {...a11yProps(1)} />
              <Tab label="Quiz" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <div className={classes.tabcontents}>
            <TabPanel value={value} index={0}>
              <td dangerouslySetInnerHTML={{ __html: grammar.Script }} />
            </TabPanel>

            <TabPanel value={value} index={1}>
              {grammar.Items &&
                grammar.Items.map((item, index) => (
                  <>
                    <Typography className={classes.grammarbox}>
                      <p>
                        <strong>Point {index + 1} : </strong>
                        {item.Point}
                      </p>
                    </Typography>

                    <div>
                      {getText(item.Examples).map((it) => (
                        <Typography variant="body2" align="justify">
                          {it}
                        </Typography>
                      ))}
                    </div>
                  </>
                ))}
            </TabPanel>

            <TabPanel value={value} index={2}>
              <Typography variant="h6">
                Answer the following questions about the interview.
              </Typography>

              {questions &&
                questions.map((question, index) => (
                  <>
                    <Typography variant="body2">
                      {index + 1}) {question.Content}
                      {checkAnswer && isCorrect[index] == true && (
                        <span>
                          <img src={correctIcon} alt="Correct!" />
                        </span>
                      )}
                      {checkAnswer && isCorrect[index] == false && (
                        <span>
                          <img src={incorrectIcon} alt="Correct!" />
                        </span>
                      )}
                    </Typography>
                    <FormGroup>
                      {question.Answers.map((item, i) =>
                        showAnswer && item.isCorrect == true ? (
                          <FormControlLabel
                            key={i}
                            control={
                              <Checkbox
                                color="primary"
                                id={`${item}-${i}`}
                                onClick={() => handleCheck(index, i)}
                              />
                            }
                            label={
                              <Typography style={{ color: "#008000" }}>
                                <strong>{item.content}</strong>
                              </Typography>
                            }
                          ></FormControlLabel>
                        ) : showAnswer && item.isCorrect == false ? 
                          <FormControlLabel
                            key={i}
                            control={
                              <Checkbox
                                color="primary"
                                id={`${item}-${i}`}
                                onClick={() => handleCheck(index, i)}
                              />
                            }
                            label={
                              <Typography style={{ color: "red" }}>
                                <strong>{item.content}</strong>
                              </Typography>
                            }
                          ></FormControlLabel> : (
                          <FormControlLabel
                            key={i}
                            control={
                              <Checkbox
                                color="primary"
                                id={`${item}-${i}`}
                                onClick={() => handleCheck(index, i)}
                              />
                            }
                            label={item.content}
                          ></FormControlLabel>
                        )
                      )}
                    </FormGroup>
                  </>
                ))}

              <Button color="primary" onClick={() => handleClickCheckAnswer()}>
                Check Answers
              </Button>
              <Button color="primary" onClick={() => handleClickReset()}>
                Reset Quiz
              </Button>
              <Button color="primary" onClick={() => handleClickShowAnswer()}>
                Show Answers
              </Button>
            </TabPanel>
          </div>
        </Box>
      </Container>
    </>
  );
}
