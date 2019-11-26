import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    marginBottom: 24
  },
  media: {
    height: 140
  }
});

function MediaCard(props) {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <Card className={classes.card} onClick={onClick}>
      <CardActionArea>
        <CardMedia className={classes.media} image={props.image || props.defaultImage} title="Contemplative Reptile" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

MediaCard.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.node.isRequired,
  image: PropTypes.string,
  defaultImage: PropTypes.string,
  title: PropTypes.string
};

export default MediaCard;
