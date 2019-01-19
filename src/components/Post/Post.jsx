/**
 * @file Post component
 * @description One post
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
import moment from 'moment';
import blogHelper from '../../helpers/blogHelper';

const propTypes = {
  compact: PropTypes.bool,
  post: PropTypes.object,
  showactions: PropTypes.bool
};

const defaultProps = {
  compact: false,
  post: {},
  showactions: true
};

const styles = theme => ({
  root: {
    borderColor: theme.palette.grey[300],
    borderWidth: '1px',
    borderStyle: 'solid',
    marginBottom: '12px',
    width: '32%',
    [theme.breakpoints.down('md')]: {
      width: '48%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  rootCompact: {
    borderColor: theme.palette.grey[300],
    borderWidth: '1px',
    borderStyle: 'solid',
    width: '16%',
    [theme.breakpoints.down('md')]: {
      width: '24%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '48%'
    }
  },
  cardActions: {
    display: 'flex'
  },
  cardBody: {
    height: '80px',
    overflow: 'hidden'
  },
  cardButton: {
    margin: 'auto'
  },
  image: {
    border: '1px solid #D3DBDF',
    height: 'auto',
    width: '100%'
  },
  cardTitle: {
    padding: '24px 0'
  },
  cardTitleCompact: {
    padding: '0'
  }
});

const Post = props => {

  const { classes, compact, post, showactions } = props;
  const postDate = moment(post.published_at).format('ll');
  const postBySlug = blogHelper.getPostUrl(post.slug);

  return (
    <Card className={compact ? classes.rootCompact : classes.root} {...props} classes={{}} compact="" showactions="" elevation={0}>
      <Link to={postBySlug}>
        <CardContent>
          <Typography align="center">
            <img src={blogHelper.getAssetUrl(post.feature_image)} alt={post.title} className={classes.image} />
          </Typography>
          <Typography variant={compact ? 'subheading' : 'title'} align="center" className={compact ? classes.cardTitleCompact : classes.cardTitle}>{post.title}</Typography>
          {compact ? null : (
            <React.Fragment>
              <Typography variant="caption" align="center" paragraph={true}>{post.featured ? 'Feature' : 'Cocktail'} by {post.primary_author.name}, {postDate}</Typography>
              <Typography className={classes.cardBody} component="div">{ post.custom_excerpt }</Typography>
            </React.Fragment>
          )}
        </CardContent>
        {showactions ? (
          <CardActions className={classes.cardActions}>
            <Button className={classes.cardButton} color="secondary" disableRipple disableFocusRipple>Read more</Button>
          </CardActions>
        ) : null}
      </Link>
    </Card>
  );

}

Post.propTypes = propTypes;
Post.defaultProps = defaultProps;

export default withStyles(styles)(Post);
