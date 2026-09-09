import { useState, useEffect } from 'preact/hooks';
import profileStyles from '../../styles/components/ProfileHeader.module.css';
import styles from '../../styles/Home/HeroCard.module.css';

const DISCORD_ID = '939851605111631903';
const GITHUB_USERNAME = 'itsVentie';
const GITHUB_TOKEN = (import.meta as any).env?.VITE_GITHUB_TOKEN || '';

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
  const [commitError, setCommitError] = useState<boolean>(false);

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
      const CACHE_KEY = 'github_api_commits_v2';
      const CACHE_TIME_KEY = 'github_api_commits_time_v2';
      const CACHE_TTL = 15 * 60 * 1000;

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
        setCommitError(false);

        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github+json',
        };
        if (GITHUB_TOKEN) {
          headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
        }

        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`, { headers });
        
        if (!reposRes.ok) {
          throw new Error(`GitHub API Error: ${reposRes.status}`);
        }

        const repos = await reposRes.json();
        if (!Array.isArray(repos)) {
          throw new Error('Invalid response from GitHub');
        }

        let allCommits: CommitStat[] = [];

        for (const repo of repos) {
          try {
            const commitsRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=3`, { headers });
            if (commitsRes.ok) {
              const repoCommits = await commitsRes.json();
              if (Array.isArray(repoCommits)) {
                for (const commit of repoCommits) {
                  allCommits.push({
                    repoName: repo.name,
                    message: commit.commit.message.split('\n')[0],
                    date: commit.commit.author?.date || commit.commit.committer?.date || new Date().toISOString(),
                    url: commit.html_url,
                  });
                }
              }
            }
          } catch {}
        }

        const sortedCommits = allCommits
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

        if (sortedCommits.length > 0) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(sortedCommits));
          localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
          setRecentCommits(sortedCommits);
        } else {
          setRecentCommits([]);
        }
      } catch (err) {
        console.error('Error fetching commits:', err);
        setCommitError(true);
        if (cachedData) {
          try {
            setRecentCommits(JSON.parse(cachedData));
            setCommitError(false);
          } catch {}
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
        </div>

        <div className={styles.socialBlock}>
          <div>
            <span className={styles.label}>Recent Commits</span>
            <div className={styles.commitsList}>
              {commitsLoading ? (
                <div className={styles.commitState}>Loading recent commits...</div>
              ) : commitError && recentCommits.length === 0 ? (
                <div className={styles.commitState} style={{ color: '#ef4444' }}>Failed to load commits</div>
              ) : recentCommits.length === 0 ? (
                <div className={styles.commitState}>No recent commits found.</div>
              ) : (
                recentCommits.map((commit, index) => (
                  <a
                    key={index}
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.commitItem}
                  >
                    <div className={styles.commitHeader}>
                      <span className={styles.commitRepo}>{commit.repoName}</span>
                      <span className={styles.commitDate}>{formatTimeAgo(commit.date)}</span>
                    </div>
                    <span className={styles.commitMessage}>
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