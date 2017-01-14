import { combineReducers } from 'redux';
import * as actions from '../actions';

export const selectUserByLogin = (state, login) =>
  state.users.byLogin[login];

/**
 * The `logins` aka usernames from the search results are
 * stored in `users.searchResults`, but the real models for
 * each of those users are stored in `users.byLogin`.
 * This is done for consistency and performance, assuming
 * this app would also allow you to view the profile of
 * a particular user from the results
 */
export const selectUserSearchResults = (state, query) => {
  const { users } = state;
  const logins = users.searchResults[query] || [];
  return logins.map(login => users.byLogin[login]);
};

/**
 * User models, index by `login` property, which is
 * what the GitHub API calls the username
 */
export const byLogin = (state = {}, action) => {
  switch (action.type) {
    case actions.SEARCH_USERS_FULFILLED:
      return action.payload.users.reduce((state, user) => {
        state[user.login] = user;
        return state;
      }, state);

    default:
      return state;
  }
};

/**
 * Search results are indexed by search query term.
 * Only the `login` property is stored here, the results
 * themselves are index in `users.byLogin`
 */
export const searchResults = (state = {}, action) => {
  switch (action.type) {
    case actions.SEARCH_USERS_FULFILLED:
      const { query, users } = action;

      return {
        ...state,
        [query]: users.map(user => user.login)
      };

    default:
      return state;
  }
};

export default combineReducers({
  byLogin,
  searchResults
});
