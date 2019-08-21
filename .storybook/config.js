import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from "@storybook/addon-knobs";
import 'semantic-ui-css/semantic.min.css'
import '../app/client/Compact.css'

addDecorator(withKnobs)

function loadStories() {
    require('../app/client/components/Download/Download.stories.js')
    require('../app/client/components/DownloadButton/DownloadButton.stories.js')
    require('../app/client/components/DownloadList/DownloadList.stories.js')
}

configure(loadStories, module);