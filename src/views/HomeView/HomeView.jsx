/**
 * @file Blog view
 * @description Blog homepage
 * @author tm
 * @copyright Inspec Digital, LLC
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { frontloadConnect } from 'react-frontload';
import Divider from '@material-ui/core/Divider';
import blogActions from '../../actions/blogActions';
import AboutBlock from '../../components/AboutBlock';
import FeatureBlock from '../../components/FeatureBlock';
import Footer from '../../components/Footer';
import GettingStartedBlock from '../../components/GettingStartedBlock';
import Hero from '../../components/Hero';
import NewsletterBlock from '../../components/NewsletterBlock';
import PitchBlock from '../../components/PitchBlock';
import PostsBlock from '../../components/PostsBlock';
import WorkWithUsBlock from '../../components/WorkWithUsBlock';
import blogHelper from '../../helpers/blogHelper';
import Helmet from 'react-helmet';

const frontload = async props => {
  const posts = await blogActions.fetchPosts({filter: ''});
  await props.dispatch(posts);
  const pages = await blogActions.fetchPages();
  await props.dispatch(pages);
}

/**
 * Blog view component
 * @extends Component
 */
class HomeView extends Component {

  render() {

    const { pages } = this.props.blog.pages;
    const { posts } = this.props.blog.posts;

    return (
      <React.Fragment>
        <Helmet>
          <title>{blogHelper.getTitle()}</title>
          <link rel="canonical" href={blogHelper.getBaseUrl(true)} />
          <meta name="description" content={blogHelper.getDescription()} />
          <meta property="og:type" content="website" />
          <meta property="og:description" content={blogHelper.getDescription()} />
          <meta property="og:image" content={posts.length ? blogHelper.getBaseUrl() + posts[0].feature_image : null} />
          <meta property="og:image:alt" content={blogHelper.getTitle()} />
          <meta property="og:image:height" content="750" />
          <meta property="og:image:secure_url" content={posts.length ? blogHelper.getBaseUrl() + posts[0].feature_image : null} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="600" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content={blogHelper.getTitle()} />
          <meta property="og:title" content={blogHelper.getTitle()} />
          <meta property="og:url" content={blogHelper.getBaseUrl()} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={blogHelper.getTitle()} />
          <meta name="twitter:description" content={blogHelper.getDescription()} />
          <meta name="twitter:image" content={posts.length ? blogHelper.getBaseUrl() + posts[0].feature_image : null} />
          <meta name="twitter:image:alt" content={blogHelper.getTitle()} />
          <script type="application/ld+json">
            {`{
              "@context":"https://schema.org",
              "@type":"WebSite",
              "@id":"#website",
              "url":"https://www.theportlandpour.com/",
              "name":"The Portland Pour",
              "potentialAction": {
                "@type":"SearchAction",
                "target":"https://www.theportlandpour.com/?s={search_term_string}",
                "query-input":"required name=search_term_string"
              }
            }`}
          </script>
        </Helmet>
        <Hero latestPosts={posts.slice(0,4)} />
        <PitchBlock />
        <FeatureBlock latestPosts={pages.slice(0,4)} />
        <NewsletterBlock />
        <AboutBlock />
        <PostsBlock posts={posts.slice(4, 10)} />
        <GettingStartedBlock />
        <PostsBlock posts={posts.slice(10, posts.length - 2)} />
        <Divider />
        <WorkWithUsBlock />
        <Divider />
        <Footer />
      </React.Fragment>
    );

  }

}

const mapStateToProps = state => {

  return state;

}

export default connect(mapStateToProps)(frontloadConnect(frontload, {onMount: true, onUpdate: false})(HomeView));
