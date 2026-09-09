import { useState, useEffect } from 'preact/hooks';
import musicStyles from '../../styles/Home/Music.module.css';
import homeStyles from '../../styles/Home/Home.module.css';

interface TrackInfo {
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
}

const DISCORD_USER_ID = '939851605111631903';

export function MusicCard() {
  const [track, setTrack] = useState<TrackInfo | null>(null);

  const parseLanyardData = (data: any): TrackInfo | null => {
    if (!data) return null;

    if (data.spotify) {
      return {
        title: data.spotify.song,
        artist: data.spotify.artist,
        album: data.spotify.album,
        coverUrl: data.spotify.album_art_url,
      };
    }

    if (data.activities && Array.isArray(data.activities)) {
      const ytmActivity = data.activities.find(
        (act: any) =>
          act.name === 'YouTube Music' || act.assets?.large_text === 'YouTube Music'
      );

      if (ytmActivity) {
        let cover: string | undefined = undefined;
        if (ytmActivity.assets?.large_image) {
          if (ytmActivity.assets.large_image.startsWith('mp:external/')) {
            cover = 'https://media.discordapp.net/' + ytmActivity.assets.large_image.replace('mp:', '');
          }
        }

        return {
          title: ytmActivity.details || 'Unknown Title',
          artist: ytmActivity.state || 'YouTube Music',
          album: ytmActivity.assets?.large_text || 'YouTube Music',
          coverUrl: cover,
        };
      }
    }

    return null;
  };

  useEffect(() => {
    if (!DISCORD_USER_ID) return;

    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.success) {
          setTrack(parseLanyardData(res.data));
        }
      })
      .catch(() => setTrack(null));

    const ws = new WebSocket('wss://api.lanyard.rest/socket');

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.op === 1) {
          const interval = message.d.heartbeat_interval;
          heartbeatTimer = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, interval);

          ws.send(
            JSON.stringify({
              op: 2,
              d: { subscribe_to_id: DISCORD_USER_ID },
            })
          );
        }

        if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
          setTrack(parseLanyardData(message.d));
        }
      } catch (err) {

      }
    };

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  if (!track) return null;

  return (
    <section className={homeStyles.card}>
      <div className={musicStyles.musicHeader}>
        <h2 className={homeStyles.cardTitle}>Listening To</h2>
        <span className={musicStyles.liveIndicator}>
          <span className={musicStyles.pulseDot}></span> Now Playing
        </span>
      </div>

      <div className={musicStyles.musicBody}>
        {track.coverUrl && (
          <img 
            src={track.coverUrl} 
            alt={`${track.title} cover`} 
            className={musicStyles.albumCover}
          />
        )}
        <div className={musicStyles.trackDetails}>
          <span className={musicStyles.trackTitle}>{track.title}</span>
          <span className={musicStyles.trackArtist}>{track.artist}</span>
          {track.album && <span className={musicStyles.trackAlbum}>{track.album}</span>}
        </div>
      </div>
    </section>
  );
}