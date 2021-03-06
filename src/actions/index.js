// TODO: relegate these URLs entirely to environment variables
const EVENT_DATA_URL = `${process.env.SERVER_ROOT}${process.env.EVENT_EXT}`;
const CATEGORY_URL = `${process.env.SERVER_ROOT}${process.env.CATEGORY_EXT}`;
const TAG_TREE_URL = `${process.env.SERVER_ROOT}${process.env.TAG_TREE_EXT}`;
const SITES_URL = `${process.env.SERVER_ROOT}${process.env.SITES_EXT}`;
const eventUrlMap = (event) => `${process.env.SERVER_ROOT}${process.env.EVENT_DESC_ROOT}/${(event.id) ? event.id : event}`

/*
* Create an error notification object
* Types: ['error', 'warning', 'good', 'neural']
*/
function makeError(type, id, message) {
  return {
    type: 'error',
    id,
    message: `${type} ${id}: ${message}`
  }
}

export function fetchDomain() {
    let events = [];
    let categories = [];
    let sites = [];
    let notifications = [];
    let tags = {};

    function makeError(domainType) {
      notifications.push({
        message: `Something went wrong fetching ${domainType}. Check the URL or try disabling them in the config file.`,
        type: 'error'
      });
    }

    return dispatch => {
        dispatch(toggleFetchingDomain());
        const promises = [];

        const eventPromise = fetch(EVENT_DATA_URL)
            .then(response => response.json())
            .then(jsonEv => { events = jsonEv; })
            .catch(err => { makeError('events')});
        promises.push(eventPromise);

        const catPromise = fetch(CATEGORY_URL)
            .then(response => response.json())
            .then(jsonCat => { categories = jsonCat; })
            .catch(err => { makeError('categories')});
        promises.push(catPromise);

        if (process.env.features.USE_SITES) {
          const sitesPromise = fetch(SITES_URL)
              .then(response => response.json())
              .then(jsonSites => { sites = jsonSites; })
              .catch(err => { makeError('sites')});
          promises.push(sitesPromise);
        }

        if (process.env.features.USE_TAGS) {
          const tagTreePromise = fetch(TAG_TREE_URL)
              .then(response => response.json())
              .then(jsonTagTree => { tags = jsonTagTree; })
              .catch(err => { makeError('tags')});
          promises.push(tagTreePromise);
        }

        return Promise.all(promises)
          .then(reponse => {
            dispatch(toggleFetchingDomain());
            return { events, categories, sites, tags, notifications };
          })
          .catch(err => {
            dispatch(fetchError(err.message))
            dispatch(toggleFetchingDomain());
          })
    };
}

export const FETCH_ERROR = 'FETCH_ERROR';
export function fetchError(message) {
  return {
    type: FETCH_ERROR,
    message,
  }
}

export const UPDATE_DOMAIN = 'UPDATE_DOMAIN';
export function updateDomain(domain) {
    return {
        type: UPDATE_DOMAIN,
        domain: {
          events: domain.events,
          categories: domain.categories,
          tags: domain.tags,
          sites: domain.sites,
          notifications: domain.notifications
        }
    };
}

export function fetchEvents(events) {
    return dispatch => {
        dispatch(toggleFetchingEvents());
        const urls = events.map(eventUrlMap);
        return Promise.all(urls.map(url => fetch(url)
            .then(response => response.json())
          )
        )
        .then(json => {
            dispatch(toggleFetchingEvents());
            return json;
        });
    };
}

export const UPDATE_HIGHLIGHTED = 'UPDATE_HIGHLIGHTED';
export function updateHighlighted(highlighted) {
    return {
        type: UPDATE_HIGHLIGHTED,
        highlighted: highlighted
    };
}

export const UPDATE_SELECTED = 'UPDATE_SELECTED';
export function updateSelected(selected) {
    return {
        type: UPDATE_SELECTED,
        selected: selected
    };
}

export const UPDATE_DISTRICT = 'UPDATE_DISTRICT';
export function updateDistrict(district) {
    return {
        type: UPDATE_DISTRICT,
        district
    };
}

export const UPDATE_FILTERS = 'UPDATE_FILTERS';
export function updateFilters(filters) {
    return {
        type: UPDATE_FILTERS,
        filters: filters
    };
}

export const UPDATE_TIMERANGE = 'UPDATE_TIMERANGE';
export function updateTimeRange(range) {
    return {
        type: UPDATE_TIMERANGE,
        range
    };
}

export const RESET_ALLFILTERS = 'RESET_ALLFILTERS';
export function resetAllFilters() {
    return {
        type: RESET_ALLFILTERS
    };
}

// UI

export const TOGGLE_FETCHING_DOMAIN = 'TOGGLE_FETCHING_DOMAIN';
export function toggleFetchingDomain() {
    return {
        type: TOGGLE_FETCHING_DOMAIN
    };
}

export const TOGGLE_FETCHING_EVENTS = 'TOGGLE_FETCHING_EVENTS';
export function toggleFetchingEvents() {
    return {
        type: TOGGLE_FETCHING_EVENTS
    };
}

export const TOGGLE_VIEW = 'TOGGLE_VIEW';
export function toggleView() {
    return {
        type: TOGGLE_VIEW
    };
}

export const TOGGLE_TIMELINE = 'TOGGLE_TIMELINE';
export function toggleTimeline() {
    return {
        type: TOGGLE_TIMELINE
    };
}

export const TOGGLE_LANGUAGE = 'TOGGLE_LANGUAGE';
export function toggleLanguage(language) {
    return {
        type: TOGGLE_LANGUAGE,
        language,
    }
}

export const OPEN_TOOLBAR = 'OPEN_TOOLBAR';
export function openToolbar(toolbarTab = 0) {
    return {
        type: OPEN_TOOLBAR,
        toolbarTab: toolbarTab,
    };
}

export const CLOSE_TOOLBAR = 'CLOSE_TOOLBAR';
export function closeToolbar() {
    return {
        type: CLOSE_TOOLBAR
    };
}

export const OPEN_CABINET = 'OPEN_CABINET';
export function openCabinet(tabNum) {
    return {
        type: OPEN_CABINET,
        tabNum: tabNum,
    };
}

export const CLOSE_CABINET = 'CLOSE_CABINET';
export function closeCabinet() {
    return {
        type: CLOSE_CABINET
    };
}

export const TOGGLE_INFOPOPUP = 'TOGGLE_INFOPOPUP';
export function toggleInfoPopup() {
    return {
        type: TOGGLE_INFOPOPUP
    };
}

export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS';
export function toggleNotifications() {
    return {
        type: TOGGLE_NOTIFICATIONS
    };
}
