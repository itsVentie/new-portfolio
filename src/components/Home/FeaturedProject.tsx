import { useState, useEffect } from 'preact/hooks';
import projectsStyles from '../../styles/Home/Projects.module.css';
import homeStyles from '../../styles/Home/Home.module.css';
import modalStyles from '../../styles/Home/Modal.module.css';

interface ProjectConfig {
  id: string;
  repo: string; 
  status: 'Active' | 'Completed' | 'In Progress' | 'Archived';
  fallbackDescription?: string; 
  fallbackLanguage?: string;
  demoUrl?: string;
}

interface GitHubData {
  title: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  tags: string[];
  htmlUrl: string;
}

const PROJECTS_CONFIG: ProjectConfig[] = [
  {
    id: 'Marrow',
    repo: 'itsVentie/Marrow',
    status: 'Active',
    fallbackDescription: 'High-performance, post-quantum resilient messenger built with Rust, Tauri v2, Preact, and QUIC. Features hybrid ML-KEM-768 E2EE and Double Ratchet forward secrecy.',
    fallbackLanguage: 'Rust',
  },
  {
    id: 'Saccade',
    repo: 'itsVentie/Saccade',
    status: 'Active',
    fallbackDescription: 'Desktop application designed for real-time video stream manipulation and face swapping. Built with a systems-first approach, it decouples the native GUI and processing pipeline from the heavy machine-learning inference engine.',
    fallbackLanguage: 'Rust',
  },
  {
    id: 'Latch',
    repo: 'itsVentie/Latch',
    status: 'Active',
    fallbackDescription: 'Lightweight hybrid post-quantum proxy tunneling legacy traffic using X25519 and ML-KEM-768 (FIPS 203).',
    fallbackLanguage: 'Go',
  },
];

const CACHE_KEY = 'github_data_cache_v1';
const CACHE_TTL = 1000 * 60 * 60; 

export function FeaturedProject() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [githubDataMap, setGithubDataMap] = useState<Record<string, GitHubData>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGitHubData() {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        try {
          const { timestamp, data } = JSON.parse(cachedRaw);
          if (Date.now() - timestamp < CACHE_TTL) {
            setGithubDataMap(data);
            setLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      const results: Record<string, GitHubData> = {};

      await Promise.all(
        PROJECTS_CONFIG.map(async (project) => {
          const fallbackTitle = project.repo.split('/')[1] || project.repo;
          try {
            const res = await fetch(`https://api.github.com/repos/${project.repo}`, {
              headers: {
                Accept: 'application/vnd.github.v3+json',
              },
            });

            if (!res.ok) {
              throw new Error(`GitHub API HTTP ${res.status}`);
            }

            const data = await res.json();

            results[project.id] = {
              title: data.name || fallbackTitle,
              description: data.description || project.fallbackDescription || 'No description provided.',
              stars: data.stargazers_count ?? 0,
              forks: data.forks_count ?? 0,
              language: data.language || project.fallbackLanguage || '',
              tags: Array.isArray(data.topics) ? data.topics : [],
              htmlUrl: data.html_url || `https://github.com/${project.repo}`,
            };
          } catch (error) {
            console.warn(`Fallback active for ${project.repo}:`, error);

            results[project.id] = {
              title: fallbackTitle,
              description: project.fallbackDescription || 'Open-source security and computing project.',
              stars: 0,
              forks: 0,
              language: project.fallbackLanguage || '',
              tags: [],
              htmlUrl: `https://github.com/${project.repo}`,
            };
          }
        })
      );

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: results })
      );

      setGithubDataMap(results);
      setLoading(false);
    }

    fetchGitHubData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (selectedProjectId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProjectId]);

  const openModal = (id: string) => {
    setSelectedProjectId(id);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProjectId(null);
    document.body.style.overflow = 'auto';
  };

  const selectedProjectConfig = PROJECTS_CONFIG.find((p) => p.id === selectedProjectId);
  const selectedGithubData = selectedProjectId ? githubDataMap[selectedProjectId] : null;

  return (
    <section className={`${homeStyles.card} ${homeStyles.spanTwo}`}>
      <h2 className={homeStyles.cardTitle}>Featured Projects</h2>
      <p className={homeStyles.description}>
        Open-source security tooling, distributed systems, and scientific computing models.
      </p>

      <div className={projectsStyles.projectsGrid}>
        {PROJECTS_CONFIG.map((project) => {
          const ghData = githubDataMap[project.id];
          const projectTitle = ghData?.title || project.repo.split('/')[1];
          const displayDescription = ghData?.description || project.fallbackDescription || 'Loading project details...';

          return (
            <div
              key={project.id}
              className={projectsStyles.projectCube}
              onClick={() => openModal(project.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(project.id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className={projectsStyles.projectHeader}>
                <h3 className={projectsStyles.cardTitle}>{projectTitle}</h3>
                <span className={projectsStyles.statusPill}>{project.status}</span>
              </div>

              <p className={projectsStyles.cardText}>{displayDescription}</p>

              <div className={projectsStyles.cardMeta}>
                {ghData?.language && (
                  <span className={projectsStyles.metaItem}>
                    <span className={projectsStyles.langDot} /> {ghData.language}
                  </span>
                )}
                <span className={projectsStyles.metaItem}>
                  ★ {loading ? '...' : ghData?.stars ?? 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProjectConfig && selectedGithubData && (
        <div className={modalStyles.modalOverlay} onClick={closeModal}>
          <div
            className={modalStyles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={modalStyles.modalCloseBtn}
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className={projectsStyles.projectHeader}>
              <h2 className={modalStyles.modalTitle}>{selectedGithubData.title}</h2>
              <span className={projectsStyles.statusPill}>
                {selectedProjectConfig.status}
              </span>
            </div>

            <p className={modalStyles.modalDescription}>
              {selectedGithubData.description}
            </p>

            <div className={projectsStyles.statsRow}>
              <div className={projectsStyles.statBox}>
                <span className={projectsStyles.statValue}>★ {selectedGithubData.stars}</span>
                <span className={projectsStyles.statLabel}>Stars</span>
              </div>
              <div className={projectsStyles.statBox}>
                <span className={projectsStyles.statValue}>⑂ {selectedGithubData.forks}</span>
                <span className={projectsStyles.statLabel}>Forks</span>
              </div>
              {selectedGithubData.language && (
                <div className={projectsStyles.statBox}>
                  <span className={projectsStyles.statValue}>{selectedGithubData.language}</span>
                  <span className={projectsStyles.statLabel}>Language</span>
                </div>
              )}
            </div>

            {selectedGithubData.tags.length > 0 && (
              <div className={projectsStyles.cardTags}>
                {selectedGithubData.tags.map((tag) => (
                  <span key={tag} className={projectsStyles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className={modalStyles.modalActions}>
              <a
                href={selectedGithubData.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={modalStyles.primaryBtn}
              >
                View on GitHub
              </a>
              {selectedProjectConfig.demoUrl && (
                <a
                  href={selectedProjectConfig.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={modalStyles.secondaryBtn}
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}