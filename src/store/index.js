import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// Modules
//import test from './modules/test';

let store = new Vuex.Store({
    state: {
        startDate: new Date(2020, 0, 1),
        currentMenuItem: 0,
        menuItems: [
            {
                title: 'Таблица'
            },
            {
                title: 'История'
            }
        ],
        currentUser: 0,
        userName: [
            'Галя', 'Катя'
        ]
    },
    getters: {
    },
    mutations: {},
    actions: {

    },
    modules: {
        //test
    }
});

export default store