import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import crypto from 'crypto-browserify'
import './App.css';
import './assets/card.css'
const API_PUBLIC = '298bab46381a6daaaee19aa5c8cafea5';
const API_PRIVATE = 'b0223681fced28de0fe97e6b9cd091dd36a5b71d';
const timestamp = new Date ().getTime () / 1000;
const hash = crypto.createHash ('md5').update(`${timestamp}${API_PRIVATE}${API_PUBLIC}`).digest('hex');

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: {},
            isDetails: '',
        }
    }

    componentWillMount() {
        const that = this;
        axios.get(`http://gateway.marvel.com:80/v1/public/characters?ts=${timestamp}&apikey=${API_PUBLIC}&hash=${hash}`).then(function (response) {
            console.log(response.data.data.results);
            that.setState({
                posts: response.data.data.results
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    detailsShow = (resourceURI) => {
        const that = this;
        axios.get(`${resourceURI}?ts=${timestamp}&apikey=${API_PUBLIC}&hash=${hash}`).then(function (response) {
            console.log(response.data.data.results[0]);
            that.setState({
                isDetails: response.data.data.results[0]
            })
        })
        .catch(function (error) {
            console.log(error);
        });

    }

    render() {
        const {posts, isDetails} = this.state;
        return (
            <div>
                {
                    isDetails ?
                        <div>
                            <div className="detail-image">
                                <span><img className="detail-image" width="30%" src={`${isDetails.thumbnail.path}.${isDetails.thumbnail.extension}`} /></span>
                            </div>
                            <div className="detail-content">
                                <div className="card-body">
                                    <div className="text-left"><b>{isDetails.name}</b></div>
                                    <div className="link"><b>{isDetails.description}</b></div>
                                </div>
                                {isDetails.comics && isDetails.comics.items &&
                                    <div>
                                        <label>Comics</label>
                                        {
                                            isDetails.comics.items.map((url) => {
                                                return(
                                                    <div>
                                                        <a className="link" key={url.name} href={url.resourceURI}>{url.name}</a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                                { isDetails.series && isDetails.series.items.length > 0 &&
                                    <div>
                                        <label>Series</label>
                                        {
                                            isDetails.series.items.map((url) => {
                                                return(
                                                    <div>
                                                        <a className="link" key={url.name} href={url.resourceURI}>{url.name}</a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                                {isDetails.stories && isDetails.stories.items &&
                                    <div>
                                        <label>Stories</label>
                                        {
                                            isDetails.stories.items.map((url) => {
                                                return(
                                                    <div>
                                                        <a className="link" key={url.name} href={url.resourceURI}>{url.name}</a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    :
                    <div>
                        <header className="app-header"/>
                        <div className="app-card-list" id="app-card-list">
                            {
                                Object
                                    .keys(posts)
                                    .map(key => <Card key={key} index={key} details={posts[key]} onClick={this.detailsShow} />)
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}


const CardHeader = ({ image, onClick, resourceURI }) =>{
    let style = {
        backgroundImage: `url(${image})`,
    };
    return (
        <header style={style} className="card-header" onClick={() => onClick(resourceURI)} />
    )
}


 const CardBody = ({details:{name, urls}}) => (
    <div className="card-body">
        <div className="text-left"><b>{name}</b></div>
        {
            urls.map((url) => {
                return(
                    <a className="link" key={url.type} href={url.url}>{url.type}</a>
                )
            })
        }
    </div>
)


const Card = ({details, onClick}) => (
    <article className="card">
        <CardHeader image={`${details.thumbnail.path}.${details.thumbnail.extension}`} onClick={onClick} resourceURI={details.resourceURI} />
        <CardBody details={details}/>
    </article>
)


ReactDOM.render(
    <App />,
    document.getElementById('root')
);

export default App;
