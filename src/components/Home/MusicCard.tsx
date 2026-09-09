import { useState, useEffect } from 'preact/hooks';
import styles from '../../styles/Home.module.css';

interface TrackInfo {
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
}

export function MusicCard() {
  const [track, setTrack] = useState<TrackInfo | null>(null);

  const DISCORD_USER_ID = '939851605111631903';

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
        let cover = undefined;
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

    // HTTP Request
    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.success) {
          setTrack(parseLanyardData(res.data));
        }
      })
      .catch(() => setTrack(null));

    // WebSocket Connection
    const ws = new WebSocket('wss://api.lanyard.rest/socket');

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          op: 2,
          d: { subscribe_to_id: DISCORD_USER_ID },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
          setTrack(parseLanyardData(message.d));
        }
      } catch (err) {
        // Parsing error
      }
    };

    return () => ws.close();
  }, [DISCORD_USER_ID]);

  if (!track) return null;

  return (
    <section className={styles.card}>
      <span className={`${styles.boxBadge} ${styles.badgePeach}`}>On My Headphones</span>
      
      <div className={styles.musicHeader}>
        <h2 className={styles.cardTitle}>Listening To</h2>
        <span className={styles.liveIndicator}>
          <span className={styles.pulseDot}></span> Now Playing
        </span>
      </div>

      <div className={styles.musicBody}>
        {track.coverUrl && (
          <img 
            src={track.coverUrl} 
            alt={`${track.title} cover`} 
            className={styles.albumCover}
          />
        )}
        <div className={styles.trackDetails}>
          <span className={styles.trackTitle}>{track.title}</span>
          <span className={styles.trackArtist}>{track.artist}</span>
          {track.album && <span className={styles.trackAlbum}>{track.album}</span>}
        </div>
      </div>
    </section>
  );
}