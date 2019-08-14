import React from 'react';
import ReactDOM from 'react-dom';
import Download from 'Components/Download'
import { Segment, Loader } from 'semantic-ui-react'


export class DownloadList extends React.Component {
    state = {
        downloads: null
    }

    componentDidMount() {
        fetch("http://172.17.0.2:5000/downloads")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    downloads: responseJson
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    render() {
        if (this.state.downloads !== null) {
            return (
                <Segment.Group raised>
                    {this.state.downloads.map(
                        item =>
                        <Download key={item.id} info={item} />
                        )
                    }
                </Segment.Group>
            )
        } else {
            return <Loader />
        }
    }
}
