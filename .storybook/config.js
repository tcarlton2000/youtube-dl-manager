import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from "@storybook/addon-knobs";
import 'semantic-ui-css/semantic.min.css'

addDecorator(withKnobs)

function loadStories() {
    require('../app/static/js/components/Download/Download.stories.js')
    require('../app/static/js/components/DownloadButton/DownloadButton.stories.js')
    require('../app/static/js/components/DownloadList/DownloadList.stories.js')
}

configure(loadStories, module);