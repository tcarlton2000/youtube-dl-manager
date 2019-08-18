import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render, waitForElement} from '@testing-library/react'
import "isomorphic-fetch"
import DownloadList from '../DownloadList'
import Download from '../Download'

test('should fetch and render download list', async () => {
    const fakeDownloadList = [
        {
            id:0,
            name: "Download One",
            status: "In Progress"
        },
        {
            id:1,
            name: "Download Two",
            status: "Completed"
        }
    ]

    jest.spyOn(global, 'fetch').mockImplementation(() => {
        return Promise.resolve({
            json: () => Promise.resolve(fakeDownloadList)
        })
    })

    const { findByText } = render(<DownloadList />)

    const firstDownloadText = await findByText("Download One")
    expect(firstDownloadText).toBeInTheDocument()

    const secondDownloadText = await findByText("Download Two")
    expect(secondDownloadText).toBeInTheDocument()

    const firstDownloadStatus = await findByText("In Progress")
    expect(firstDownloadStatus).toBeInTheDocument()

    const secondDownloadStatus = await findByText("Completed")
    expect(secondDownloadStatus).toBeInTheDocument()
})
