import styles from '../../styles/Home.module.css';

export function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.heroCard}>
        <span className={styles.badge}>Systems Security Engineer</span>
        <h1 className={styles.title}>Creating Secure and Resilient Systems</h1>
        <p className={styles.description}>
          I focus on building secure and resilient systems, leveraging my expertise in Rust, Golang, C++, and Python to deliver high-quality solutions.
        </p>
        <div className={styles.actions}>
          <button className={styles.primaryBtn}>Contact Me</button>
        </div>
      </section>

      <section className={styles.secondaryCard}>
        <h2 className={styles.sectionTitle}>Main Stack</h2>
        <div className={styles.tags}>
          <span className={styles.tag}>Rust</span>
          <span className={styles.tag}>Golang</span>
          <span className={styles.tag}>C++</span>
          <span className={styles.tag}>Python</span>
        </div>
      </section>
    </main>
  );
}