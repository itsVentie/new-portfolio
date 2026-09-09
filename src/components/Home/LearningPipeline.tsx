import styles from '../../styles/Home/Home.module.css';

export function LearningPipeline() {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Up Next</h2>
      <div className={styles.pipelineSteps}>
        <div className={styles.step}>
          <span className={styles.stepNum}>01</span>
          <span>Advanced Formal Verification for Smart Contracts</span>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNum}>02</span>
          <span>Zero-Knowledge Proof Circuits (Noir / Circom)</span>
        </div>
      </div>
    </section>
  );
}