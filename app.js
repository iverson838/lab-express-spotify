require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artist-search', (req, res) => {
  const term = req.query.term;
  spotifyApi
    .searchArtists(term)
    .then((data) => {
      const artists = data.body.artists.items;

      res.render('artist-search-results', { artists });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log(data.body);
      const albums = data.body.items;
      res.render('albums', { albums });
    })
    .catch((err) => {
      console.log('there was an error', err);
    });
});

app.get('/album/:albumId', (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log(data.body);
      const tracks = data.body.items;
      res.render('track-list', { tracks });
    })
    .catch((error) => {
      console.log('there was an error');
    });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
