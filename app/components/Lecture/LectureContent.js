import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();

const useStyles = makeStyles({
  wrap: {
    width: '100%',
    display: 'flex',
    padding: 24,
    marginBottom: 8
  },
  content: {
    flex: 1
  },
  url: {
    color: 'teal',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  text: {
    '& span': {
      lineHeight: '100%'
    }
  }
});

function LectureContent(props) {
  const classes = useStyles();
  const { data } = props;
  return (
    <div className={classes.wrap}>
      <div className={classes.content}>
        {data.type === 'text' ? (
          <div className={classes.text}>{htmlToReactParser.parse(data.content)}</div>
        ) : (
          <img src={data.url} alt="" />
        )}
      </div>
    </div>
  );
}

LectureContent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any)
};

export default LectureContent;
