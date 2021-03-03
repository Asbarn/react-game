import styles from "./Footer.module.css";
import SchoolLogoIcon from "./assets/images/rs_school_js.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <h2>{"© 2021 Checkers"}</h2>

          <div className={styles.list}>
            <a href="https://github.com/asbarn" className={styles.listItem}>
              {"Yaroslav Kobernyk"}
            </a>
          </div>

          <div className={styles.schoolLogo}>
            <a
              href="https://rs.school/js/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.schoolLogoLink}
            >
              <img
                src={SchoolLogoIcon}
                alt="School logo"
                className={styles.schoolLogoIcon}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
