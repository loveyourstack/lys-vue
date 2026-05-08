import AdjustColsList from './components/AdjustColsList.vue';
export { AdjustColsList };
//export * from './utils'
//export * from './types'
const plugin = {
    install(app) {
        app.component('AdjustColsList', AdjustColsList);
    },
};
export default plugin;
