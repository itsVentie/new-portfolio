import styles from '../../styles/Home.module.css';

export function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <span className={styles.tag}>Portfolio</span>
        <h1 className={styles.title}>Hello, I'm a Developer</h1>
        <p className={styles.subtitle}>
          Nothing unnecessary.
        </p>
      </div>
    </main>
  );
}