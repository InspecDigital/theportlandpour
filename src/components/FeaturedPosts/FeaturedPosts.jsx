/**
 * @file FeaturedPosts component
 * @description List of FeaturedPosts
 * @author tm
 * @copyright Inspec Digital, LLC
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Gloss from 'components/Gloss';
import Post from 'components/Post';
import find from 'lodash/find';

const propTypes = {
  caption: PropTypes.string,
  featuredPosts: PropTypes.array,
  title: PropTypes.string,
  users: PropTypes.array
};

const defaultProps = {
  caption: '',
  featuredPosts: [],
  title: '',
  users: []
};

const styles = theme => ({
  root: {
    background: 'transparent',
    margin: '0 auto',
    maxWidth: theme.local.maxWidth
  },
  cardActions: {
    display: 'flex',
    paddingBottom: '24px',
    paddingTop: 0
  },
  cardButton: {
    margin: 'auto'
  },
  cardContent: {
    paddingBottom: 0,
    [theme.breakpoints.up('lg')]: {
    }
  },
  featuredPosts: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around'
  },
  post: {
    marginBottom: '3%',
  }
});

const FeaturedPosts = props => {

  const { caption, classes, featuredPosts, title, users } = props;

  return (
    <Card className={classes.root} elevation={0} square>
      <CardContent className={classes.cardContent}>
        <Gloss label="Featured cocktails" />
        <Typography variant="headline">{title}</Typography>
        <Typography variant="body1" paragraph>{caption}</Typography>
        <div className={classes.featuredPosts}>
          {featuredPosts.length ? featuredPosts.map(post => {
            return <Post classes={{ rootCompact: classes.post }} post={post} user={find(users, { id: post.author })} key={post.id} compact />;
          }) : null}
        </div>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Link className={classes.cardButton} to="/page/1">
          <Button color="secondary">See all the cocktails</Button>
        </Link>
      </CardActions>
    </Card>
  );

}

FeaturedPosts.propTypes = propTypes;
FeaturedPosts.defaultProps = defaultProps;

export default withStyles(styles)(FeaturedPosts);
