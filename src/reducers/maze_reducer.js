import * as types from '../actions/action_types';

const initialState = {
  connected: false
};

export default function list_reducer(state = initialState, action = {}) {
  switch (action.type) {
    // case types.REQUEST_POSTS:
    //   // console.log("REQUEST ")
    //     action.api_options.coordinates = state.api_options.coordinates;
    //   return Object.assign({}, state, {
    //     reset_posts: action.reset_posts,
    //     posts: action.reset_posts ? [] : state.posts,
    //     pageEndReached: action.reset_posts ? false : state.pageEndReached,
    //     isFetching: true,
    //     api_options: Object.assign({}, state.api_options, action.api_options),
    // })
    default:
      return state
  }
}
