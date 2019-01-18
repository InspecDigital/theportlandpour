/**
 * @file Post component
 * @description One post
 * @author tm
 * @copyright Inspec Digital, LLC
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faPinterest } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TagList from '../TagList';
import blogHelper from '../../helpers/blogHelper';

const propTypes = {
  post: PropTypes.object,
  user: PropTypes.object
};

const defaultProps = {
  post: {},
  user: {}
};

const styles = theme => ({
  root: {
    '& a': {
      textDecoration: 'underline'
    }
  },
  avatar: {
    display: 'inline-block',
    marginRight: '12px',
    verticalAlign: 'middle'
  },
  cardActions: {
    display: 'flex'
  },
  cardButton: {
    marginLeft: 'auto'
  },
  image: {
    border: '1px solid #D3DBDF',
    height: 'auto',
    maxWidth: '600px',
    width: '100%'
  },
  cardSubheading: {
    paddingBottom: '24px'
  },
  postContent: {
    '& img': {
      border: '1px solid #D3DBDF',
      display: 'block',
      height: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '600px',
      width: '100%'
    }
  },
  shareLink: {
    color: theme.palette.text.hint,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

const PostDetail = props => {

  const { classes, post } = props;
  const postDate = blogHelper.getPostDate(post.published_at);
  const absSrc = blogHelper.getAssetUrl(post.primary_author.profile_image);
  const assetUrl = post.feature_image ? blogHelper.getAssetUrl(post.feature_image) : null;
  const permalink = blogHelper.getBaseUrl() + blogHelper.getPostUrl(post.slug);
  const facebookShare = blogHelper.getFacebookShare(permalink);
  const twitterShare = blogHelper.getTwitterShare(permalink, blogHelper.getTitle(post.title) + ' - ' + post.custom_excerpt, blogHelper.getHashtags('twitter'));
  const pinterestShare = blogHelper.getPinterestShare(permalink, assetUrl, post.title + ' - ' + post.custom_excerpt);
  const emailShare = blogHelper.getEmailShare(permalink, blogHelper.getTitle(post.title), post.custom_excerpt);

  return (
    <div className={classes.root}>
      <Typography variant="display1" color="default" align="center" className={classes.cardTitle}>
        {post.title}
      </Typography>
      <Typography className={classes.cardSubheading} align="center" variant="subheading" color="textSecondary" component="div">
        "{ post.custom_excerpt }"
      </Typography>
      <Typography className={classes.cardSubheading} variant="subheading" color="textSecondary" align="center">
        <Avatar className={classes.avatar} component="span" src={absSrc} />
        posted by {post.primary_author.name} on {postDate}
      </Typography>
      <Typography align="center" paragraph>
        {assetUrl ? <img src={assetUrl} alt={post.title} className={classes.image} /> : null}
      </Typography>
      <Typography align="center" variant="headline" paragraph>
        <a className={classes.shareLink} href={facebookShare} rel="noopener noreferrer" target="_blank">
          <FontAwesomeIcon className={classes.socialIcon} icon={faFacebook} />
        </a>
        <a className={classes.shareLink} href={twitterShare} rel="noopener noreferrer" target="_blank">
          <FontAwesomeIcon className={classes.socialIcon} icon={faTwitter} />
        </a>
        <a className={classes.shareLink} href={pinterestShare} rel="noopener noreferrer" target="_blank">
          <FontAwesomeIcon className={classes.socialIcon} icon={faPinterest} />
        </a>
        <a className={classes.shareLink} href={emailShare} rel="noopener noreferrer" target="_blank">
          <FontAwesomeIcon className={classes.socialIcon} icon={faEnvelope} />
        </a>
      </Typography>
      <Typography align="center" variant="caption" paragraph>permalink: {permalink}</Typography>
      <Typography component="div" className={classes.postContent}>
        <div dangerouslySetInnerHTML={{__html: post.html}} />
      </Typography>
      <TagList tags={post.tags} />
    </div>
  );

}

PostDetail.defaultProps = defaultProps;
PostDetail.propTypes = propTypes;

export default withStyles(styles)(PostDetail);
