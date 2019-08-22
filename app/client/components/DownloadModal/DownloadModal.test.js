import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import "isomorphic-fetch"
import DownloadModal from '../DownloadModal'

test('should open DownloadModal on button click', () => {
    const { getByText } = render(<DownloadModal />)
    fireEvent.click(getByText("New Download..."))
    expect(getByText("URL")).toBeInTheDocument()
    expect(getByText("Directory")).toBeInTheDocument()
})

test('should POST and close modal on Download click', () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => {
        return Promise.resolve({})
    })

    const { getByText, queryByText } = render(<DownloadModal />)
    fireEvent.click(getByText("New Download..."))
    fireEvent.click(getByText("Download"))

    expect(queryByText("URL")).not.toBeInTheDocument()
    expect(queryByText("Directory")).not.toBeInTheDocument()

    expect(global.fetch).toHaveBeenCalledTimes(1)
})

test('should close on Cancel click', () => {
    const { getByText, queryByText } = render(<DownloadModal />)
    fireEvent.click(getByText("New Download..."))
    fireEvent.click(getByText("Cancel"))
    expect(queryByText("URL")).not.toBeInTheDocument()
    expect(queryByText("Directory")).not.toBeInTheDocument()
})