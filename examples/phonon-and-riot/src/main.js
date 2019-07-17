import '@riotjs/hot-reload';
import * as riot from 'riot';
import App from './tags/app.riot';

// Phonon CSS
import 'phonon/dist/css/phonon.css';

const createApp = riot.component(App);
createApp(document.getElementById('app'));
