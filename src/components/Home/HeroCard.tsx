import { useState, useEffect } from 'preact/hooks';
import profileStyles from '../../styles/components/ProfileHeader.module.css';
import styles from '../../styles/Home/HeroCard.module.css';

const DISCORD_ID = '939851605111631903';
const GITHUB_USERNAME = 'itsVentie';

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

interface CommitStat {
  repoName: string;
  message: string;
  date: string;
  url: string;
}

export function HeroCard() {
  const [discordStatus, setDiscordStatus] = useState<string>('offline');
  const [currentActivity, setCurrentActivity] = useState<ActivityDetails | null>(null);
  const [customStatus, setCustomStatus] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [randomGif, setRandomGif] = useState<string>('https://nekos.best/api/v2/dance/0001.gif');
  const [recentCommits, setRecentCommits] = useState<CommitStat[]>([]);
  const [commitsLoading, setCommitsLoading] = useState<boolean>(true);

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
    async function fetchRecentCommits() {
      const CACHE_KEY = 'github_recent_commits_v3';
      const CACHE_TIME_KEY = 'github_recent_commits_time_v3';
      const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL) {
        try {
          setRecentCommits(JSON.parse(cachedData));
          setCommitsLoading(false);
          return;
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      try {
        setCommitsLoading(true);
        // Используем Events API — всего 1 запрос вместо N запросов по репозиториям
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
        if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);

        const events = await res.json();
        const pushEvents = events.filter((e: any) => e.type === 'PushEvent');

        const commits: CommitStat[] = [];
        for (const event of pushEvents) {
          const repoFullName = event.repo.name; // формат "owner/repo"
          const repoName = repoFullName.includes('/') ? repoFullName.split('/')[1] : repoFullName;
          const date = event.created_at;

          if (event.payload && event.payload.commits) {
            for (const commit of event.payload.commits) {
              commits.push({
                repoName,
                message: commit.message.split('\n')[0],
                date,
                url: `https://github.com/${repoFullName}/commit/${commit.sha}`,
              });
            }
          }
        }

        const sortedCommits = commits
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

        localStorage.setItem(CACHE_KEY, JSON.stringify(sortedCommits));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

        setRecentCommits(sortedCommits);
      } catch (err) {
        console.error('Error fetching recent commits:', err);
        if (cachedData) {
          setRecentCommits(JSON.parse(cachedData));
        }
      } finally {
        setCommitsLoading(false);
      }
    }

    fetchRecentCommits();
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

  const formatTimeAgo = (dateString: string) => {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return 'just now';
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

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
            <span className={styles.label}>Recent Commits</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              {commitsLoading ? (
                <div style={{ fontSize: '12px', opacity: 0.6 }}>Loading recent commits...</div>
              ) : recentCommits.length === 0 ? (
                <div style={{ fontSize: '12px', opacity: 0.6 }}>No recent commits found.</div>
              ) : (
                recentCommits.map((commit, index) => (
                  <a
                    key={index}
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'inherit',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>{commit.repoName}</span>
                      <span style={{ fontSize: '10px', opacity: 0.5 }}>{formatTimeAgo(commit.date)}</span>
                    </div>
                    <span style={{ fontSize: '11px', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {commit.message}
                    </span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}