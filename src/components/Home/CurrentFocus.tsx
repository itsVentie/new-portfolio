import styles from '../../styles/Home.module.css';

export function CurrentFocus() {
  return (
    <section className={`${styles.card} ${styles.spanTwo}`}>
      <span className={`${styles.boxBadge} ${styles.badgeSky}`}>Focus Areas & R&D</span>
      <h2 className={styles.cardTitle}>Active Research & Target Roles</h2>
      
      <div className={styles.focusGrid}>
        <div className={styles.focusItem}>
          <div className={styles.focusHeader}>
            <span className={styles.domainName}>Systems & Low-Level Sec</span>
            <span className={`${styles.statusBadge} ${styles.statusCore}`}>Core Focus</span>
          </div>
          <span className={styles.targetRole}>Role: Systems Engineer</span>
          <p className={styles.techList}>
            Linux Kernel & eBPF, Reverse Engineering, Binary Exploitation, Memory Safety (Rust), Bare-Metal OS
          </p>
        </div>
        <div className={styles.focusItem}>
          <div className={styles.focusHeader}>
            <span className={styles.domainName}>Applied Cryptography</span>
            <span className={`${styles.statusBadge} ${styles.statusActive}`}>Active R&D</span>
          </div>
          <span className={styles.targetRole}>Role: Applied Cryptographer</span>
          <p className={styles.techList}>
            Post-Quantum (ML-KEM/Kyber), ZK-SNARKs, Lattice Standards, E2EE/QUIC Protocols, Formal Verification
          </p>
        </div>

        <div className={styles.focusItem}>
          <div className={styles.focusHeader}>
            <span className={styles.domainName}>DFIR & Digital Forensics</span>
            <span className={`${styles.statusBadge} ${styles.statusTarget}`}>Career Target</span>
          </div>
          <span className={styles.targetRole}>Role: DFIR / Cybercrime Analyst</span>
          <p className={styles.techList}>
            Memory Forensics (Volatility 3), NTFS/EXT4 Artifact Carving, High-Perf Tooling (Rust/Go), Log Triage
          </p>
        </div>
        <div className={styles.focusItem}>
          <div className={styles.focusHeader}>
            <span className={styles.domainName}>Mathematics & AI Safety</span>
            <span className={`${styles.statusBadge} ${styles.statusProgress}`}>In Progress</span>
          </div>
          <span className={styles.targetRole}>Role: AI Safety Researcher</span>
          <p className={styles.techList}>
            Mechanistic Interpretability, NN Theory, LLM Guardrails & Robustness, Adversarial Attacks, Agent Safety
          </p>
        </div>

        <div className={styles.focusItem}>
          <div className={styles.focusHeader}>
            <span className={styles.domainName}>Cloud Native & DevSecOps</span>
            <span className={`${styles.statusBadge} ${styles.statusExpanding}`}>Expanding</span>
          </div>
          <span className={styles.targetRole}>Role: DevSecOps Engineer</span>
          <p className={styles.techList}>
            Container Runtime Sec, K8s Policy Enforcement, CI/CD Hardening, eBPF Runtime Audit (Falco)
          </p>
        </div>

        <div className={styles.focusItem}>
          <div className={styles.focusHeader}>
            <span className={styles.domainName}>Embedded & Hardware Sec</span>
            <span className={`${styles.statusBadge} ${styles.statusExploratory}`}>Exploratory</span>
          </div>
          <span className={styles.targetRole}>Role: Embedded Security Engineer</span>
          <p className={styles.techList}>
            ESP32 / RISC-V Firmware, Secure Boot & TEE, Side-Channel Analysis, Bare-Metal Exploitation
          </p>
        </div>
      </div>
    </section>
  );
}