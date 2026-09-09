import { useState, useEffect } from 'preact/hooks';
import styles from '../../styles/Home/Home.module.css';
import pipelineStyles from '../../styles/Home/LearningPipeline.module.css';

const GITHUB_USERNAME = 'itsVentie';
const REPO_NAME = 'roadmap';

interface Task {
  id: number;
  title: string;
  isMain: boolean;
  completed: boolean;
  phase: string;
  htmlUrl: string;
}

export function LearningPipeline() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubIssues() {
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues?state=all&per_page=100`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        });

        if (!res.ok) throw new Error('Failed to fetch issues');

        const issues = await res.json();

        if (Array.isArray(issues)) {
          const parsedTasks: Task[] = issues
            .filter((issue: any) => !issue.pull_request)
            .map((issue: any) => {
              const labels = issue.labels.map((l: any) => l.name);
              const isMain = labels.includes('main');
              const phaseLabel = labels.find((l: string) => l.startsWith('phase:')) || 'General';
              
              return {
                id: issue.id,
                title: issue.title,
                isMain,
                completed: issue.state === 'closed',
                phase: phaseLabel.replace('phase:', '').trim(),
                htmlUrl: issue.html_url 
              };
            });

          setTasks(parsedTasks);
        }
      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubIssues();
  }, []);

  const mainTasks = tasks.filter(t => t.isMain && !t.completed).slice(0, 3);

  return (
    <>
      <section className={styles.card}>
        <div className={pipelineStyles.headerRow}>
          <h2 className={styles.cardTitle}>Roadmap</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={pipelineStyles.viewAllBtn}
          >
            {loading ? 'Loading...' : `View All (${tasks.length})`}
          </button>
        </div>

        <div className={pipelineStyles.pipelineSteps}>
          {loading ? (
            <div style={{ color: '#8b949e', fontSize: '0.85rem', padding: '8px 0' }}>Loading roadmap...</div>
          ) : mainTasks.length === 0 ? (
            <div style={{ color: '#8b949e', fontSize: '0.85rem', padding: '8px 0' }}>No active tasks in roadmap.</div>
          ) : (
            mainTasks.map((task, index) => (
              <a 
                key={task.id} 
                href={task.htmlUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={pipelineStyles.step}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className={pipelineStyles.stepNum}>0{index + 1}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{task.title}</span>
              </a>
            ))
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className={pipelineStyles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={pipelineStyles.modalContent} onClick={e => e.stopPropagation()}>
            
            <div className={pipelineStyles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#e6edf3' }}>Full Roadmap</h3>
              <button onClick={() => setIsModalOpen(false)} className={pipelineStyles.closeBtn}>✕</button>
            </div>

            <div className={pipelineStyles.modalBody}>
              {tasks.length === 0 ? (
                <div style={{ color: '#8b949e', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                  No issues found in {GITHUB_USERNAME}/{REPO_NAME}.
                </div>
              ) : (
                tasks.map(task => (
                  <a 
                    key={task.id} 
                    href={task.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pipelineStyles.taskItem}
                    style={{ textDecoration: 'none' }}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      disabled 
                      className={pipelineStyles.taskCheckbox} 
                    />
                    <div className={`${pipelineStyles.taskTitle} ${task.completed ? pipelineStyles.taskTitleCompleted : ''}`}>
                      {task.title}
                    </div>
                    <span className={pipelineStyles.phaseBadge}>{task.phase}</span>
                  </a>
                ))
              )}
            </div>

            <div className={pipelineStyles.modalFooter}>
              Synced from github.com/{GITHUB_USERNAME}/{REPO_NAME} &bull; Read-only view
            </div>

          </div>
        </div>
      )}
    </>
  );
}