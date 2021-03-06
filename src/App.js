import React from 'react';
import ReactGA from 'react-ga';
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import withStyles from '@material-ui/core/styles/withStyles';
//import blogActions from './actions/blogActions';
import themeHelper from './helpers/themeHelper';
import AboutView from './views/AboutView';
import BlogView from './views/BlogView';
import ContactView from './views/ContactView';
import FeatureView from './views/FeatureView';
import HomeView from './views/HomeView';
import NoView from './views/NoView';
import PostView from './views/PostView';
import SearchView from './views/SearchView';
//import SitemapView from './views/SitemapView';
import WorkWithUsView from './views/WorkWithUsView';
import Header from './components/Header';
import WithTracker from './components/WithTracker';
import './App.css';

const theme = createMuiTheme(themeHelper.getTheme());

const styles = theme => ({
  curtain: {
    background: theme.palette.common.white,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100000
  },
  hidden: {
    display: 'none'
  },
  wrapper: {
    visibility: 'visible ! important',
    width: '100%'
  }
});

const ga = {
  trackingId: 'UA-98891622-2',
  gaOptions: {
    cookieDomain: 'auto'
  }
}

const App = props => {

//  const actionCallback = () => {
//    return props.dispatch(blogActions.clearMessaging());
//  }

  const { classes } = props;

  ReactGA.initialize(ga);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.wrapper} style={{visibility:'hidden'}}>
        <Header />
        <Switch>
          <Route path="/" exact component={WithTracker(HomeView)} />
          <Route path="/feature-page/:page" component={WithTracker(FeatureView)} />
          <Route path="/page/:page" component={WithTracker(BlogView)} />
          <Route path="/post/:slug" component={WithTracker(PostView)} />
          <Route path="/about" component={WithTracker(AboutView)} />
          <Route path="/contact" component={WithTracker(ContactView)} />
          <Route path="/work-with-us" component={WithTracker(WorkWithUsView)} />
          <Route path="/search/:q/:page" component={WithTracker(SearchView)} />
          <Redirect from="/blog/:slug" to="/post/:slug" />
          <Route path="/sitemap" component={NoView} />
          <Route component={WithTracker(NoView)} />
        </Switch>
      </div>
    </MuiThemeProvider>
  );

}

export default withStyles(styles)(App);
