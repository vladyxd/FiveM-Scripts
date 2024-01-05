import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import './MusicPlayer.css'; // Import your CSS file for styling
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingSong, setPlayingSong] = useState({}); // {name: 'song', artist: 'artist', album: 'album', duration: '3:00', image: 'image', youtubeUrl: 'youtube_url'}
    const [searchResults, setSearchResults] = useState([]); // [ {name: 'song', artist: 'artist', album: 'album', duration: '3:00', image: 'image', youtubeUrl: 'youtube_url'}, ...
    const audioRef = useRef(null);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const stop = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    };

    const extractVideoId = (url) => {
        if (!url) return null;
    
        const match = url.match(/[?&]v=([^#&?]+)/);
        return match ? match[1] : null;
    };
    
const playSong = (song) => {
    if (!song || !song.url) {
        console.error('Invalid YouTube URL:', song.url);
        return;
    }

    setPlayingSong(song);
    const videoId = extractVideoId(song.url);

    if (!videoId) {
        console.error('Invalid YouTube URL:', song.url);
        return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    audioRef.current.src = embedUrl;
    audioRef.current.play();
    setIsPlaying(true);
};

    async function search() {
        let search = document.querySelector('.search-bar input').value;
        let data = await fetch('http://localhost:2912/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: search })
        });
        data = await data.json();
        setSearchResults(data);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            search();
        }
    });

    return (
        <div className="music-player-container">
            {/* SEARCH BAR */}
            <div className="search-bar">
                <input type="text" placeholder="Search for a song" />
                <button onClick={search}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
            {/* SONG LIST */}
            <div className="song-list">
                {searchResults.map((song, index) => (
                    <div key={index} onClick={() => playSong(song)} className="song">
                        {/* Display song details in the list */}
                        <img className='songImage' src={song?.thumbnail?.url} alt="song" />
                        <div className="song-info">
                            <div className="top-info">
                                <span className='song-name'>{song.title}</span>
                                <span className='artist'>{song.artist}</span>
                            </div>
                            {song.album !== 'none' && <span className='album'>&bull; {song.album}</span>}
                        </div>
                        <span className='duration'>{song.duration}</span>
                    </div>
                ))}
            </div>
            {/* PLAYER */}
            <div className="player">
                <div className='player-info'>
                    <YouTube
                        videoId={extractVideoId(playingSong.youtubeUrl)}
                        opts={{ width: '32px', height: '32px' }}
                    />
                    <div className="song-info">
                        <div className="top-info">
                            <span className='song-name'>{playingSong.name || "Nu se redă"}</span>
                            <span className='artist'>{playingSong.artist}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* AUDIO ELEMENT (if needed) */}
            <audio ref={audioRef} onEnded={stop} />
        </div>
    );
};

export default MusicPlayer;
