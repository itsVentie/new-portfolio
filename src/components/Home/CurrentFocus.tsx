import homeStyles from '../../styles/Home/Home.module.css';
import focusStyles from '../../styles/Home/FocusGrid.module.css';

export function CurrentFocus() {
  return (
    <section className={`${homeStyles.card} ${homeStyles.spanTwo}`}>
      <h2 className={homeStyles.cardTitle}>Active Research & Target Roles</h2>
      
      <div className={focusStyles.focusGrid}>
        <div className={focusStyles.focusItem}>
          <div className={focusStyles.focusHeader}>
            <span className={focusStyles.domainName}>Systems & Low-Level Sec</span>
          </div>
          <span className={focusStyles.targetRole}>Role: Systems Engineer</span>
          <p className={focusStyles.techList}>
            Linux Kernel & eBPF, Reverse Engineering, Binary Exploitation, Memory Safety (Rust), Bare-Metal OS
          </p>
        </div>

        <div className={focusStyles.focusItem}>
          <div className={focusStyles.focusHeader}>
            <span className={focusStyles.domainName}>Applied Cryptography</span>
          </div>
          <span className={focusStyles.targetRole}>Role: Applied Cryptographer</span>
          <p className={focusStyles.techList}>
            Post-Quantum (ML-KEM/Kyber), ZK-SNARKs, Lattice Standards, E2EE/QUIC Protocols, Formal Verification
          </p>
        </div>

        <div className={focusStyles.focusItem}>
          <div className={focusStyles.focusHeader}>
            <span className={focusStyles.domainName}>DFIR & Digital Forensics</span>
          </div>
          <span className={focusStyles.targetRole}>Role: DFIR / Cybercrime Analyst</span>
          <p className={focusStyles.techList}>
            Memory Forensics (Volatility 3), NTFS/EXT4 Artifact Carving, High-Perf Tooling (Rust/Go), Log Triage
          </p>
        </div>

        <div className={focusStyles.focusItem}>
          <div className={focusStyles.focusHeader}>
            <span className={focusStyles.domainName}>Mathematics & AI Safety</span>
          </div>
          <span className={focusStyles.targetRole}>Role: AI Safety Researcher</span>
          <p className={focusStyles.techList}>
            Mechanistic Interpretability, NN Theory, LLM Guardrails & Robustness, Adversarial Attacks, Agent Safety
          </p>
        </div>

        <div className={focusStyles.focusItem}>
          <div className={focusStyles.focusHeader}>
            <span className={focusStyles.domainName}>Cloud Native & DevSecOps</span>
          </div>
          <span className={focusStyles.targetRole}>Role: DevSecOps Engineer</span>
          <p className={focusStyles.techList}>
            Container Runtime Sec, K8s Policy Enforcement, CI/CD Hardening, eBPF Runtime Audit (Falco)
          </p>
        </div>

        <div className={focusStyles.focusItem}>
          <div className={focusStyles.focusHeader}>
            <span className={focusStyles.domainName}>Embedded & Hardware Sec</span>
          </div>
          <span className={focusStyles.targetRole}>Role: Embedded Security Engineer</span>
          <p className={focusStyles.techList}>
            ESP32 / RISC-V Firmware, Secure Boot & TEE, Side-Channel Analysis, Bare-Metal Exploitation
          </p>
        </div>
      </div>
    </section>
  );
}