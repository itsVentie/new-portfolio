import { useState, useEffect } from 'preact/hooks';
import musicStyles from '../../styles/Home/Music.module.css';
import homeStyles from '../../styles/Home/Home.module.css';

interface TrackInfo {
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  timestamps?: {
    start: number;
    end: number;
  };
}

const DISCORD_USER_ID = '939851605111631903';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function MusicCard() {
  const [track, setTrack] = useState<TrackInfo | null>(null);
  const [progress, setProgress] = useState<{ current: number; duration: number } | null>(null);

  const parseLanyardData = (data: any): TrackInfo | null => {
    if (!data) return null;

    if (data.spotify) {
      return {
        title: data.spotify.song,
        artist: data.spotify.artist,
        album: data.spotify.album,
        coverUrl: data.spotify.album_art_url,
        timestamps: data.spotify.timestamps,
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
          timestamps: ytmActivity.timestamps,
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
      } catch (err) {}
    };

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!track?.timestamps) {
      setProgress(null);
      return;
    }

    const updateProgress = () => {
      const now = Date.now();
      const { start, end } = track.timestamps!;
      const current = Math.max(0, now - start);
      const duration = Math.max(0, end - start);

      if (current > duration) {
        setProgress({ current: duration, duration });
      } else {
        setProgress({ current, duration });
      }
    };

    updateProgress();
    const timer = setInterval(updateProgress, 1000);

    return () => clearInterval(timer);
  }, [track]);

  if (!track) return null;

  const progressPercent = progress && progress.duration > 0 
    ? Math.min(100, (progress.current / progress.duration) * 100) 
    : 0;

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

          {progress && (
            <div className={musicStyles.progressContainer}>
              <div className={musicStyles.progressBar}>
                <div 
                  className={musicStyles.progressFill} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className={musicStyles.timeInfo}>
                <span>{formatTime(progress.current)}</span>
                <span>{formatTime(progress.duration)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}