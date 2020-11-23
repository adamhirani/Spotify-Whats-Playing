import React, { Component, useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' }
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    if (this.state.loggedIn){
      spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        try {
          this.setState({
            nowPlaying: { 
                name: response.item.name, 
                albumArt: response.item.album.images[0].url
              }
          });
        } catch (e){
          this.setState({
            nowPlaying: { 
                name: 'Nothing', 
                albumArt: null
              }
          });
        }
      })
    }
  }


  
  render() {
    return (
      <div className="App" >
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div style={{color: 'white'}}>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 250 }}/>
        </div>
        { this.state.loggedIn &&
          <Button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </Button>
        }
      </div>
    );
  }
}

export default App;