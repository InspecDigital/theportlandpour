/**
 * @file blog actions
 * @description Helper methods for blog stuff
 * @author tm
 * @copyright Inspec Digital, LLC
 */

import blogConstants from '../constants/blogConstants';
import blogHelper from '../helpers/blogHelper';
import searchHelper from '../helpers/searchHelper';
import API from '../services/API';

const request = (type) => { return { type: type }; }

const success = (type, data) => { return { type: type, data: data }};

const fail = error => { return { type: blogConstants.ERROR, error: error }};

//const message = message => { return { type: blogConstants.MESSAGE, message: message }};

const clearPostDetail = () => {

  return dispatch => { dispatch(success(blogConstants.CLEAR_POST_DETAIL, null)); }

}

const fetchUsers = (opts={}) => {

  const options = Object.assign({}, { limit: 'all' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('users', queryString);

  return new Promise((resolve, reject) => {

    API.get(endpoint)
      .then(
        users => {
          users.authors.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if(nameA > nameB) {
              return 1;
            }
            else if (nameA < nameB) {
              return -1;
            }
            else {
              return 0;
            }
          });
          resolve(success(blogConstants.GET_USERS, users.authors.reverse()));
        },
        error => {
          reject(fail(error));
        }
      );

  });

}

const getPostBySlug = (slug, opts={}) => {

  const options = Object.assign({}, { formats: 'html', include: 'authors,tags', filter: 'page[true,false]' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('postBySlug', queryString, slug);

  return dispatch => {

    dispatch(request(blogConstants.WAITING_POST));

    API.get(endpoint)
      .then(
        posts => {
          dispatch(success(blogConstants.GET_POST, posts.posts[0]));
        },
        error => {
          dispatch(fail(error));
        }
      );

  }

}

const fetchPostBySlug = (slug, opts={}) => {

  const options = Object.assign({}, { formats: 'html', include: 'authors,tags' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('postBySlug', queryString, slug);

  return new Promise((resolve, reject) => {

    API.get(endpoint)
      .then(
        posts => {
          resolve(success(blogConstants.GET_POST, posts.posts[0]));
        },
        error => {
          reject(fail(error));
        }
      );

  });

}

const getFeaturedPosts = (opts = {}) => {

  const options = Object.assign({}, { filter: 'featured:true', include: 'authors,tags', limit: 6, order: 'published_at%20DESC' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('posts', queryString);

  return dispatch => {

    dispatch(request(blogConstants.WAITING_POST));

    API.get(endpoint)
      .then(
        featuredPosts => {
          dispatch(success(blogConstants.GET_FEATURED_POSTS, featuredPosts));
        },
        error => {
          dispatch(fail(error));
        }
      );

  }

}

const getLatestPosts = (opts = {}) => {

  const options = Object.assign({}, { include: 'authors,tags', limit: 6, order: 'published_at%20DESC' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('posts', queryString);

  return dispatch => {

    dispatch(request(blogConstants.WAITING_POST));

    API.get(endpoint)
      .then(
        latestPosts => {
          dispatch(success(blogConstants.GET_LATEST_POSTS, latestPosts));
        },
        error => {
          dispatch(fail(error));
        }
      );

  }

}

const fetchPages = (opts = {}) => {

  const options = Object.assign({}, { include: 'authors,tags', limit: 18, order: 'published_at%20DESC' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('pages', queryString);

  return  new Promise((resolve, reject) => {

    API.get(endpoint)
      .then(
        pages => {
          resolve(success(blogConstants.GET_PAGES, pages));
        },
        error => {
          reject(fail(error));
        }
      );

  });

}

const fetchPosts = (opts = {}) => {

  const options = Object.assign({}, { filter: 'featured:false', include: 'authors,tags', limit: 9, order: 'published_at%20DESC' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('posts', queryString);

  return  new Promise((resolve, reject) => {

    API.get(endpoint)
      .then(
        posts => {
          resolve(success(blogConstants.GET_POSTS, posts));
        },
        error => {
          reject(fail(error));
        }
      );

  });

}

const getPages = (opts = {}) => {

  const options = Object.assign({}, { include: 'authors,tags', limit: 18, order: 'published_at%20DESC' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('pages', queryString);

  return dispatch => {

    dispatch(request(blogConstants.WAITING_PAGES));

    API.get(endpoint)
      .then(
        pages => {
          dispatch(success(blogConstants.GET_PAGES, pages));
        },
        error => {
          dispatch(fail(error));
        }
      );

  }

}

const getPosts = (opts = {}) => {

  const options = Object.assign({}, { filter: 'featured:false', include: 'authors,tags', limit: 18, order: 'published_at%20DESC' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('posts', queryString);

  return dispatch => {

    dispatch(request(blogConstants.WAITING_POSTS));

    API.get(endpoint)
      .then(
        posts => {
          dispatch(success(blogConstants.GET_POSTS, posts));
        },
        error => {
          dispatch(fail(error));
        }
      );

  }

}

const getTags = (opts={}) => {

  const options = Object.assign({}, { fields: 'name,slug', limit: 'all', order: 'name' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('tags', queryString);

  return dispatch => {

    dispatch(request(blogConstants.WAITING_POST));

    API.get(endpoint)
      .then(
        tags => {
          dispatch(success(blogConstants.GET_TAGS, tags.tags));
        },
        error => {
          dispatch(fail(error));
        }
      );

  }

}

const getUsers = (opts={}) => {

  const options = Object.assign({}, { limit: 'all' }, opts);
  const queryString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const endpoint = blogHelper.getEndpoint('users', queryString);

  return dispatch => {

    dispatch(request(blogConstants.WAITING_USERS));

    API.get(endpoint)
      .then(
        users => {
          users.authors.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if(nameA > nameB) {
              return 1;
            }
            else if (nameA < nameB) {
              return -1;
            }
            else {
              return 0;
            }
          });
          dispatch(success(blogConstants.GET_USERS, users.authors.reverse()));
        },
        error => {
          dispatch(fail(error));
        }
      );

  }

}

const search = (q) => {


  const endpoint = searchHelper.getEndpoint(q);

  return new Promise((resolve, reject) => {

    API.get(endpoint)
      .then(
        search => {
          const data = {};
          data.raw = search;
          data.q = search.queries.request[0].searchTerms;
          data.slugs = search.items ? search.items.filter(item => {
            return item.link.includes('post');
          }).map(item => {
            return item.link.split('/').pop();
          }) : [];
          resolve(success(blogConstants.SEARCH, data));
        },
        error => {
          reject(fail(error));
        }
      );

  });

}

const setSelectedMixers = selectedMixers => {

  return dispatch => {

    dispatch(success(blogConstants.SET_SELECTED_MIXERS, selectedMixers));

  }

}

const setSelectedSpirits = selectedSpirits => {

  return dispatch => {

    dispatch(success(blogConstants.SET_SELECTED_SPIRITS, selectedSpirits));

  }

}

const addToMailChimp = (fields) => {

  const endpoint = blogHelper.getMailChimpEndpoint();

  return dispatch => {

    dispatch(request(blogConstants.WAITING_MAILCHIMP));

    API.jsonPost(endpoint, fields)
      .then(
        result => {
          if(result.result === 'success') {
            dispatch(success(blogConstants.MAILCHIMP, result));
          }
          else {
            dispatch(fail(result));
          }
        },
        error => {
          console.log(error);
          dispatch(fail(error));
        }
      );

  }

}

const waiting = () => {

  return dispatch => {
    dispatch(success(blogConstants.WAITING_POSTS));
  };

}

const clearMessaging = () => {

  return dispatch => {
    dispatch(success(blogConstants.CLEAR_MESSAGING));
  };

}

const clearPosts = () => {

  return dispatch => {
    dispatch(success(blogConstants.CLEAR_POSTS));
  }

}

const blogActions = {
  clearMessaging,
  clearPosts,
  clearPostDetail,
  addToMailChimp,
  fetchPages,
  fetchPostBySlug,
  fetchPosts,
  fetchUsers,
  getFeaturedPosts,
  getPages,
  getLatestPosts,
  getPostBySlug,
  getPosts,
  getTags,
  getUsers,
  request,
  search,
  setSelectedMixers,
  setSelectedSpirits,
  waiting
};

export default blogActions;
