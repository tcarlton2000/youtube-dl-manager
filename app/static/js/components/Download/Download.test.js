import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render} from '@testing-library/react'
import Download from '../Download'

test('should render download name and status', () => {
    const downloadJson = {
        name: "Download Name",
        status: "Download Status"
    }
    const {getByText} = render(
        <Download info={downloadJson} />
)

    expect(getByText(downloadJson.name)).toBeInTheDocument()
    expect(getByText(downloadJson.status)).toBeInTheDocument()
})
