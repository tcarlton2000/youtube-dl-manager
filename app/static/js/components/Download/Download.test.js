import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render} from '@testing-library/react'
import Download from '../Download'

test('should render download name and status', () => {
    const {getByText} = render(
        <Download name={"Download Name"} status={"Download Status"} />
)

    expect(getByText("Download Name")).toBeInTheDocument()
    expect(getByText("Download Status")).toBeInTheDocument()
})
