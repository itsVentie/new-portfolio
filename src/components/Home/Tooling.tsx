import styles from '../../styles/Home/Home.module.css';

export function ToolingEnvironment() {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Daily Drivers</h2>
      <div className={styles.gridTags}>
        <div className={styles.toolChip}><strong>OS:</strong> Kali / Arch Linux</div>
        <div className={styles.toolChip}><strong>Editor:</strong> Neovim / VS Code</div>
        <div className={styles.toolChip}><strong>Shell:</strong> Zsh + Tmux</div>
        <div className={styles.toolChip}><strong>Forensics:</strong> Wireshark, Volatility, Ghidra</div>
      </div>
    </section>
  );
}