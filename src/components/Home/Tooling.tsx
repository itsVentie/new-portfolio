import styles from '../../styles/Home/Home.module.css';
import toolingStyles from '../../styles/Home/Tooling.module.css';

interface Tool {
  name: string;
  icon: string; 
}

const TOOLS: Tool[] = [
  {
    name: 'VS Code',
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/vscode.webp',
  },
  {
    name: 'Floorp',
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/floorp.webp',
  },
  {
    name: 'KeePassXC',
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/keepassxc.webp',
  },
  {
    name: 'OneCommander',
    icon: 'https://mloads.com/uploads/posts/2024-07/onecommander.webp',
  },
  {
    name: 'Alacritty',
    icon: 'https://user-images.githubusercontent.com/20866468/133163498-c82bb7e8-7fda-4203-994b-71e4222d9f02.png',
  },
  {
    name: 'Anytype',
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/anytype.webp',
  },
  {
    name: 'Vesktop',
    icon: 'https://vesktop.dev/_astro/vesktop.BBCX2DU9.svg',
  },
  {
    name: 'Telegram',
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/telegram.webp',
  },
];

export function ToolingEnvironment() {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Environment</h2>
      <div className={toolingStyles.iconGrid}>
        {TOOLS.map((tool) => (
          <div key={tool.name} className={toolingStyles.iconChip} title={tool.name}>
            <img 
              src={tool.icon} 
              alt={tool.name} 
              className={toolingStyles.toolIconImg} 
              width="24" 
              height="24"
            />
            <span className={toolingStyles.toolNameTooltip}>{tool.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}