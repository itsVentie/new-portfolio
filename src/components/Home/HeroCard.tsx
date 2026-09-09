import { useState, useEffect } from 'preact/hooks';
import profileStyles from '../../styles/components/ProfileHeader.module.css';
import styles from '../../styles/Home/HeroCard.module.css';

const DISCORD_ID = '939851605111631903'; 

const GIF_CATEGORIES = ['dance', 'hug', 'wink', 'wave', 'pat', 'cuddle', 'smile', 'sleep'];

interface ActivityDetails {
  name: string;
  details?: string;
  state?: string;
  type: number;
  timestamps?: { start?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
  };
  application_id?: string;
}

export function HeroCard() {
  const [discordStatus, setDiscordStatus] = useState<string>('offline');
  const [currentActivity, setCurrentActivity] = useState<ActivityDetails | null>(null);
  const [customStatus, setCustomStatus] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [randomGif, setRandomGif] = useState<string>('https://nekos.best/api/v2/dance/0001.gif');

  useEffect(() => {
    async function fetchRandomGif() {
      try {
        const randomCategory = GIF_CATEGORIES[Math.floor(Math.random() * GIF_CATEGORIES.length)];
        const res = await fetch(`https://nekos.best/api/v2/${randomCategory}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setRandomGif(data.results[0].url);
        }
      } catch (err) {
        console.error('Failed to fetch random anime gif:', err);
      }
    }

    fetchRandomGif();
  }, []);

  useEffect(() => {
    async function fetchLanyard() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();

        if (!json.success || !json.data) return;

        const data = json.data;
        setDiscordStatus(data.discord_status || 'offline');

        if (data.listening_to_spotify && data.spotify) {
          setCurrentActivity({
            name: data.spotify.song,
            details: `by ${data.spotify.artist}`,
            state: data.spotify.album,
            type: 2,
            assets: {
              large_image: data.spotify.album_art_url,
            },
            timestamps: data.spotify.timestamps,
          });
          setCustomStatus('');
          return;
        }

        if (data.activities && data.activities.length > 0) {
          const appActivity = data.activities.find((a: any) => a.type !== 4);
          if (appActivity) {
            let imageUrl = undefined;
            if (appActivity.assets?.large_image) {
              const imgId = appActivity.assets.large_image;
              if (imgId.startsWith('mp:')) {
                imageUrl = `https://media.discordapp.net/${imgId.replace('mp:', '')}`;
              } else if (appActivity.application_id) {
                imageUrl = `https://cdn.discordapp.com/app-assets/${appActivity.application_id}/${imgId}.png`;
              }
            }

            setCurrentActivity({
              name: appActivity.name,
              details: appActivity.details,
              state: appActivity.state,
              type: appActivity.type,
              timestamps: appActivity.timestamps,
              assets: { large_image: imageUrl, large_text: appActivity.assets?.large_text },
            });
          } else {
            setCurrentActivity(null);
          }

          const custom = data.activities.find((a: any) => a.type === 4);
          if (custom && custom.state) {
            setCustomStatus(custom.state.replace(/`/g, ''));
          } else {
            setCustomStatus('');
          }
        } else {
          setCurrentActivity(null);
          setCustomStatus('');
        }

      } catch (err) {
        console.error('Lanyard error:', err);
      }
    }

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentActivity?.timestamps?.start) {
      setElapsedTime('');
      return;
    }

    const startTime = currentActivity.timestamps.start;

    const updateTimer = () => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (hours > 0) {
        setElapsedTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} elapsed`);
      } else {
        setElapsedTime(`${minutes}:${seconds.toString().padStart(2, '0')} elapsed`);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [currentActivity]);

  return (
    <section className={`${profileStyles.card} ${styles.heroCard}`}>
      <div className={styles.splitGrid}>
        <div className={styles.visualCard}>
          <img 
            src={randomGif} 
            alt="Anime GIF" 
            className={styles.bgGif}
          />
        </div>

        <div className={styles.infoContent}>
          <div className={styles.statusBlock}>
            <div className={styles.headerRow}>
              <span className={styles.label}>Discord Activity</span>
              <div className={styles.statusIndicator}>
                <span className={`${styles.pulseDot} ${styles[discordStatus]}`} />
                <span className={styles.statusText}>{discordStatus.toUpperCase()}</span>
              </div>
            </div>

            {currentActivity ? (
              <div className={styles.activityCard}>
                {currentActivity.assets?.large_image && (
                  <img 
                    src={currentActivity.assets.large_image} 
                    alt="Activity App" 
                    className={styles.activityImage} 
                  />
                )}
                <div className={styles.activityInfo}>
                  <div className={styles.activityTitle}>{currentActivity.name}</div>
                  {currentActivity.details && <div className={styles.activityText}>{currentActivity.details}</div>}
                  {currentActivity.state && <div className={styles.activityText}>{currentActivity.state}</div>}
                  {elapsedTime && <div className={styles.activityTimer}>{elapsedTime}</div>}
                </div>
              </div>
            ) : (
              <div className={styles.fallbackStatus}>
                {customStatus ? `💬 ${customStatus}` : 'No active game or app right now'}
              </div>
            )}
          </div>

          <div className={styles.socialBlock}>
            <span className={styles.label}>SOCIALS & PLATFORMS</span>
            <div className={styles.socialGrid}>
              <a href="https://t.me/ventie" target="_blank" rel="noreferrer" className={styles.socialCard}>
                Telegram
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.socialCard}>
                GitHub
              </a>
              <a href="https://steamcommunity.com" target="_blank" rel="noreferrer" className={styles.socialCard}>
                Steam
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}