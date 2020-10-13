import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        num:0,
        name:"jeck",
    },
    getters:{
       
    },
    mutations:{
        inn(state,payload){
            return state.num+=payload?payload:1;
        },
        des(state){
            return state.num--;
        }
    },

})

export default store