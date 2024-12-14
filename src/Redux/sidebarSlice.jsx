import {createSlice} from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        sideBarClass: '',
        menus: [],
        loading: false,
    },
    reducers: {
        toggleSidebar: (state) => {
            state.sideBarClass = state.sideBarClass === '' ? 'mini-sidebar' : '';
        },
        setSidebarClass: (state, action) => {
            state.sideBarClass = action.payload;
        },
        setMenus: (state, action) => {
            state.menus = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarClass,
    setMenus,
    setLoading,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
