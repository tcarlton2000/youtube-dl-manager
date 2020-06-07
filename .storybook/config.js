import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from "@storybook/addon-knobs";
import 'antd/dist/antd.css';
addDecorator(withKnobs)

function loadStories() {
    require('../app/client/components/Download/Download.stories.js');
    require('../app/client/components/DownloadModal/DownloadModal.stories.js');
    require('../app/client/components/DownloadList/DownloadList.stories.js');
    require('../app/client/components/SettingsPage/SettingsPage.stories');
}

configure(loadStories, module);