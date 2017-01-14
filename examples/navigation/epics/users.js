import { Observable } from 'rxjs/Observable';
import { replace } from 'react-router-redux';
import * as actions from '../actions';
import { ajax } from 'rxjs/observable/dom/ajax';

export const searchUsers = (action$, store) =>
  action$.ofType(actions.SEARCH_USERS)
    .debounceTime(800)
    // switchMap has implicit cancellation, so if another
    // action reaches here before the previous ajax is finished
    // it will cancel and "switch" to starting the new one
    .switchMap(action =>
      ajax.getJSON(`https://api.github.com/search/users?q=${action.payload.query}`)
        // If CLEARED_SEARCH_RESULTS is dispatched before this
        // ajax finishes, this will cancel it
        .takeUntil(action$.ofType(actions.SEARCH_USERS_CANCELLED))
        // when our ajax response comes back
        .map(response => actions.searchUsersFulfilled(response.items))
        // Immediately emit the react-router-redux replace()
        // action to update the URL
        .startWith(replace(`?q=${action.payload.query}`))
    );
