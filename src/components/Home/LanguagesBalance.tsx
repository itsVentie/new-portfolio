import { useState, useEffect } from 'preact/hooks';
import styles from '../../styles/Home/Home.module.css';
import languageStyles from '../../styles/Home/LanguagesBalance.module.css';

interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Rust: '#dea584',
  Elixir: '#6e4a7e',
  Julia: '#a270ba',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
};

const NON_PROGRAMMING_LANGS = new Set([
  'html', 'css', 'scss', 'less', 'sass', 'markdown', 'typescript',
  'json', 'yaml', 'toml', 'dockerfile', 'makefile', 'shell', 'bash', 'tex', 'plpgsql'
]);

export function LanguagesBalance() {
  const [languagesByBytes, setLanguagesByBytes] = useState<LanguageStat[]>([]);
  const [languagesByCommits, setLanguagesByCommits] = useState<LanguageStat[]>([]);
  const [activeTab, setActiveTab] = useState<'bytes' | 'commits'>('bytes');
  const [loading, setLoading] = useState<boolean>(true);

  const GITHUB_USERNAME = 'itsVentie';

  useEffect(() => {
    async function fetchGitHubStats() {
      const CACHE_KEY = 'github_stats_cache_v3';
      const CACHE_TIME_KEY = 'github_stats_time_v3';
      const CACHE_TTL = 6 * 60 * 60 * 1000;

      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL) {
        try {
          const parsed = JSON.parse(cachedData);
          setLanguagesByBytes(parsed.bytes);
          setLanguagesByCommits(parsed.commits);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      try {
        setLoading(true);

        const reposRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=50&sort=updated`
        );

        if (!reposRes.ok) throw new Error(`GitHub API Error: ${reposRes.status}`);

        const repos = (await reposRes.json()) as any[];
        const ownRepos = repos.filter((repo) => !repo.fork);

        const langTotalsBytes: Record<string, number> = {};
        const langTotalsCommits: Record<string, number> = {};
        let grandTotalBytes = 0;
        let grandTotalCommits = 0;

        const repoPromises = ownRepos.map(async (repo) => {
          try {
            const [langRes, commitRes] = await Promise.all([
              fetch(repo.languages_url).then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
              fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=1`)
                .then(async (r) => {
                  if (!r.ok) return 0;
                  const link = r.headers.get('Link');
                  if (link) {
                    const match = link.match(/page=(\d+)>; rel="last"/);
                    if (match) return parseInt(match[1], 10);
                  }
                  const data = await r.json();
                  return Array.isArray(data) && data.length > 0 ? 1 : 0;
                })
                .catch(() => 0),
            ]);

            return { langs: langRes as Record<string, number>, commits: commitRes as number };
          } catch {
            return { langs: {}, commits: 0 };
          }
        });

        const repoResults = await Promise.all(repoPromises);

        repoResults.forEach(({ langs, commits }) => {
          let repoBytesTotal = 0;
          Object.entries(langs).forEach(([lang, bytes]) => {
            if (NON_PROGRAMMING_LANGS.has(lang.toLowerCase())) return;
            repoBytesTotal += bytes;
          });

          Object.entries(langs).forEach(([lang, bytes]) => {
            if (NON_PROGRAMMING_LANGS.has(lang.toLowerCase())) return;

            langTotalsBytes[lang] = (langTotalsBytes[lang] || 0) + bytes;
            grandTotalBytes += bytes;

            if (repoBytesTotal > 0 && commits > 0) {
              const langShare = bytes / repoBytesTotal;
              const allocatedCommits = commits * langShare;
              langTotalsCommits[lang] = (langTotalsCommits[lang] || 0) + allocatedCommits;
              grandTotalCommits += allocatedCommits;
            }
          });
        });

        const sortedBytes: LanguageStat[] = Object.entries(langTotalsBytes)
          .map(([name, bytes]) => ({
            name,
            percentage: grandTotalBytes > 0 ? Number(((bytes / grandTotalBytes) * 100).toFixed(1)) : 0,
            color: LANGUAGE_COLORS[name] || '#6e7681',
          }))
          .filter((item) => item.percentage > 0)
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);

        const sortedCommits: LanguageStat[] = Object.entries(langTotalsCommits)
          .map(([name, count]) => ({
            name,
            percentage: grandTotalCommits > 0 ? Number(((count / grandTotalCommits) * 100).toFixed(1)) : 0,
            color: LANGUAGE_COLORS[name] || '#6e7681',
          }))
          .filter((item) => item.percentage > 0)
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);

        const payload = { bytes: sortedBytes, commits: sortedCommits };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

        setLanguagesByBytes(sortedBytes);
        setLanguagesByCommits(sortedCommits);
      } catch (err) {
        console.error('Error fetching language stats:', err);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setLanguagesByBytes(parsed.bytes);
          setLanguagesByCommits(parsed.commits);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubStats();
  }, [GITHUB_USERNAME]);

  const currentLanguages = activeTab === 'bytes' ? languagesByBytes : languagesByCommits;

  return (
    <section className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className={styles.cardTitle} style={{ margin: 0 }}>Code Distribution</h2>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px', borderRadius: '6px' }}>
          <button
            onClick={() => setActiveTab('bytes')}
            style={{
              background: activeTab === 'bytes' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: 'inherit',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: activeTab === 'bytes' ? '600' : '400',
            }}
          >
            By Volume
          </button>
          <button
            onClick={() => setActiveTab('commits')}
            style={{
              background: activeTab === 'commits' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: 'inherit',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: activeTab === 'commits' ? '600' : '400',
            }}
          >
            By Commits
          </button>
        </div>
      </div>

      {loading ? (
        <p className={styles.cardText}>Fetching GitHub telemetry...</p>
      ) : currentLanguages.length === 0 ? (
        <p className={styles.cardText}>No public language data available.</p>
      ) : (
        <div className={languageStyles.langBars}>
          {currentLanguages.map((lang) => (
            <div key={lang.name} className={languageStyles.langItem}>
              <div className={languageStyles.langInfo}>
                <span>{lang.name}</span>
                <span>{lang.percentage}%</span>
              </div>
              <div className={languageStyles.barTrack}>
                <div
                  className={languageStyles.barFill}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}