import { useState, useEffect } from 'preact/hooks';
import styles from '../../styles/Home/Home.module.css';

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
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const GITHUB_USERNAME = 'itsVentie';

  useEffect(() => {
    async function fetchGitHubLanguages() {
      const CACHE_KEY = 'github_lang_stats_cache';
      const CACHE_TIME_KEY = 'github_lang_stats_time';
      const CACHE_TTL = 6 * 60 * 60 * 1000;

      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL) {
        try {
          setLanguages(JSON.parse(cachedData));
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      try {
        setLoading(true);

        const reposRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
        );

        if (!reposRes.ok) throw new Error(`GitHub API Error: ${reposRes.status}`);

        const repos = (await reposRes.json()) as any[];
        const ownRepos = repos.filter((repo) => !repo.fork);

        const langTotals: Record<string, number> = {};
        let grandTotalBytes = 0;

        const langPromises = ownRepos.map((repo) =>
          fetch(repo.languages_url)
            .then((res) => (res.ok ? res.json() : {}))
            .catch(() => ({}))
        );

        const langResults = (await Promise.all(langPromises)) as Record<string, number>[];

        langResults.forEach((repoLangs) => {
          Object.entries(repoLangs).forEach(([lang, bytes]) => {
            if (NON_PROGRAMMING_LANGS.has(lang.toLowerCase())) return;

            langTotals[lang] = (langTotals[lang] || 0) + bytes;
            grandTotalBytes += bytes;
          });
        });

        if (grandTotalBytes === 0) {
          setLoading(false);
          return;
        }

        const sortedLangs: LanguageStat[] = Object.entries(langTotals)
          .map(([name, bytes]) => ({
            name,
            percentage: Math.round((bytes / grandTotalBytes) * 100),
            color: LANGUAGE_COLORS[name] || '#6e7681',
          }))
          .filter((item) => item.percentage > 0)
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);

        localStorage.setItem(CACHE_KEY, JSON.stringify(sortedLangs));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

        setLanguages(sortedLangs);
      } catch (err) {
        console.error('Error fetching languages:', err);

        if (cachedData) {
          setLanguages(JSON.parse(cachedData));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubLanguages();
  }, [GITHUB_USERNAME]);

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Code Distribution</h2>

      {loading ? (
        <p className={styles.cardText}>Fetching GitHub telemetry...</p>
      ) : languages.length === 0 ? (
        <p className={styles.cardText}>No public language data available.</p>
      ) : (
        <div className={styles.langBars}>
          {languages.map((lang) => (
            <div key={lang.name} className={styles.langItem}>
              <div className={styles.langInfo}>
                <span>{lang.name}</span>
                <span>{lang.percentage}%</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
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