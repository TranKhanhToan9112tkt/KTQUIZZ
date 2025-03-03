import React from 'react'
import {LISTEN_TOPIC  } from 'constants/listeningTopics';
import { makeStyles } from "@material-ui/styles";
import { dictionaryRoot } from "../components/UI/style";
import { Grid } from '@material-ui/core';
import TopicBox from '../components/TopicBox/index';
import useTitle from "../hooks/useTitle";
import { Link } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
const useStyle = makeStyles((theme) => ({
  ...dictionaryRoot(theme),
}));

export default function WordTopicPage() {
  useTitle("Listen Topic")
  const classes = useStyle();
  return (
    <div className={`${classes.root} english-container`}>
      <div className="flex-center-between">
        <h1 className="english-title">Listening Levels</h1>
      </div>
      <div className="english-break"></div>
      <Grid container spacing={3}>
        {LISTEN_TOPIC.map((topic, index) => (
          <Grid item xs={12} md={12} key={index}>
            <Link
               to={`/listening/topic/${topic.value}`}>
              <img src={topic.image} height={"200px"} width={"796px"} align="center" alt="" />
              {/* <Typography variant="h6" align="center"> {topic.label} </Typography> */}
            </Link>
           
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

