/**
 * @file Blog view
 * @description Blog homepage
 * @author tm
 * @copyright Inspec Digital, LLC
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { frontloadConnect } from 'react-frontload';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import blogActions from '../../actions/blogActions';
import Footer from '../../components/Footer';
import Pager from '../../components/Pager';
import Posts from '../../components/Posts';
import blogConstants from '../../constants/blogConstants';
import blogHelper from '../../helpers/blogHelper';
import Helmet from 'react-helmet';

const frontload = async props => {
  const page = props.match.params.page;
  const paginationPage = props.blog.features.meta.pagination.page;
  const { features } = props.blog.features;
  if(+page !== +paginationPage || features.length === 0) {
    props.dispatch(blogActions.request(blogConstants.WAITING_POSTS));
    const features = await blogActions.fetchFeatures({page: page});
    await props.dispatch(features);
  }
  if(props.blog.users.length === 0) {
    props.dispatch(blogActions.request(blogConstants.WAITING_USERS));
    const users = await blogActions.fetchUsers();
    await props.dispatch(users);
  }
}

const styles = theme => ({
  posts: {
    padding: '0 24px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: 'auto'
    }
  },
  root: {
    margin: '0 auto',
    maxWidth: theme.local.maxWidth,
    paddingTop: theme.local.headerPadding,
    position: 'relative'
  },
  rootContent: {
    display: 'flex',
  },
  sidebar: {
    paddingBottom: '24px',
    paddingRight: '24px',
    width: '30%'
  },
  title: {
    paddingBottom: '24px',
    paddingLeft: '36px',
    paddingRight: '36px'
  }
});

/**
 * Blog view component
 * @extends Component
 */
class FeatureView extends Component {

  componentDidMount() {

    this.historyFeaturesUnlisten = this.props.history.listen((location, action) => {
      const path = location.pathname.split('/');
      const page = path[path.indexOf('feature-page') + 1];
      //window.scrollTo(0, 0);
      return page ? this.props.dispatch(blogActions.getFeatures({page: page})) : null;
    });

    if(this.props.blog.tags.length === 0) {
      this.props.dispatch(blogActions.getTags());
    }

  }

  componentWillUnmount() {

    return this.historyFeaturesUnlisten();

  }

  render() {

    const { classes, match } = this.props;
    const { users, waiting } = this.props.blog;
    const { features, meta } = this.props.blog.features;
    const { pagination } = meta;

    const progress = <LinearProgress />;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Helmet>
            <title>{blogHelper.getTitle('Cocktails - Page ' + match.params.page)}</title>
            <link rel="canonical" href={blogHelper.getBaseUrl() + match.url} />
            <meta property="og:type" content="object" />
            <meta property="og:description" content={blogHelper.getDescription()} />
            <meta property="og:image" content={features.length ? blogHelper.getBaseUrl() + features[0].feature_image : null} />
            <meta property="og:image:alt" content={blogHelper.getTitle()} />
            <meta property="og:image:height" content="750" />
            <meta property="og:image:secure_url" content={features.length ? blogHelper.getBaseUrl() + features[0].feature_image : null} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="600" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:site_name" content={blogHelper.getTitle()} />
            <meta property="og:title" content={'Cocktails - page ' + match.params.page} />
            <meta property="og:url" content={blogHelper.getBaseUrl() + match.url} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={'Cocktails - page ' + match.params.page} />
            <meta name="twitter:description" content={blogHelper.getDescription()} />
            <meta name="twitter:image" content={features.length ? blogHelper.getBaseUrl() + features[0].feature_image : null} />
            <meta name="twitter:image:alt" content={blogHelper.getTitle()} />
          </Helmet>
          <div className={classes.rootContent}>
            <div className={classes.features}>
              <Typography align="center" variant="display2">Features</Typography>
              <Pager pagination={pagination} />
              {waiting ? progress : null}
              <Posts posts={features} users={users} />
              <Pager pagination={pagination} />
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );

  }

}

const mapStateToProps = state => {

  return state;

}

const styledComponent = withStyles(styles)(FeatureView)

export default connect(mapStateToProps)(frontloadConnect(frontload, {onMount: true, onUpdate: false})(styledComponent));
