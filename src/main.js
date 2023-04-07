import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* FontAwesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faRightLeft, faCircleInfo, faClock, faArrowLeft, faArrowRight, faLocationDot, faMapPin } from "@fortawesome/free-solid-svg-icons";
library.add(faRightLeft, faCircleInfo, faClock, faArrowLeft, faArrowRight, faLocationDot, faMapPin);

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app')
