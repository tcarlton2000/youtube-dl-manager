import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render} from '@testing-library/react'
import Download from '../Download'

test('should render download name and status', () => {
    const {getByText} = render(
        <Download
            name={"Download Name"}
            status={"Download Status"}
            percent={50.5}
            size={"23MiB"}
            speed={"1.23MiB/s"}
            time_remaining={"01:34"}
        />
)

    expect(getByText("Download Name")).toBeInTheDocument()
    expect(getByText("50%")).toBeInTheDocument()
    expect(getByText("23MiB")).toBeInTheDocument()
    expect(getByText("1.23MiB/s")).toBeInTheDocument()
    expect(getByText("01:34")).toBeInTheDocument()
})
