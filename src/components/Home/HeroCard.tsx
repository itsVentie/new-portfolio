import styles from '../../styles/Home/Home.module.css';

export function HeroCard() {
  return (
    <section className={styles.heroCard}>
      <span className={styles.badge}>Systems & Security</span>
      <h1 className={styles.title}>Building Resilient Infrastructure & Security Tools</h1>
      <p className={styles.description}>
        Focused on low-level systems engineering, EVM node monitoring, fault-tolerant architectures, and digital forensics.
      </p>
      <div className={styles.actions}>
        <a href="https://t.me/ventie" target="_blank" rel="noreferrer" className={styles.primaryBtn}>
          Get in Touch
        </a>
      </div>
    </section>
  );
}