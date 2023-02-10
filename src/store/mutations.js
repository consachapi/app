const mutations = {
  TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE(state, value) {
    state.isVerticalNavMenuActive = value
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.reduceButton = val
  },
  UPDATE_MAIN_LAYOUT_TYPE(state, val) {
    state.mainLayoutType = val
  },
  UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN(state, val) {
    state.verticalNavMenuItemsMin = val
  },
  UPDATE_VERTICAL_NAV_MENU_WIDTH(state, width) {
    state.verticalNavMenuWidth = width
  },

  UPDATE_STARRED_PAGE(state, payload) {

    const index = state.navbarSearchAndPinList["pages"].data.findIndex((item) => item.url == payload.url)
    state.navbarSearchAndPinList["pages"].data[index].is_bookmarked = payload.val
    if (payload.val) {
      state.starredPages.push(state.navbarSearchAndPinList["pages"].data[index])
    }
    else {
      const index = state.starredPages.findIndex((item) => item.url == payload.url)
      state.starredPages.splice(index, 1)
    }
  },

  ARRANGE_STARRED_PAGES_LIMITED(state, list) {
    const starredPagesMore = state.starredPages.slice(10)
    state.starredPages = list.concat(starredPagesMore)
  },
  ARRANGE_STARRED_PAGES_MORE(state, list) {
    let downToUp = false
    let lastItemInStarredLimited = state.starredPages[10]
    const starredPagesLimited = state.starredPages.slice(0, 10)
    state.starredPages = starredPagesLimited.concat(list)
    state.starredPages.slice(0, 10).map((i) => {
      if (list.indexOf(i) > -1) downToUp = true
    })
    if (!downToUp) {
      state.starredPages.splice(10, 0, lastItemInStarredLimited)
    }
  },

  TOGGLE_CONTENT_OVERLAY(state, val) { state.bodyOverlay = val },
  UPDATE_PRIMARY_COLOR(state, val) { state.themePrimaryColor = val },
  UPDATE_THEME(state, val) { state.theme = val },
  UPDATE_WINDOW_WIDTH(state, width) { state.windowWidth = width },
  UPDATE_WINDOW_SCROLL_Y(state, val) { state.scrollY = val },

}

export default mutations

