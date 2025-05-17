import React from 'react';
import styles from './notFound.module.scss';

const NotFound = () => {
    return (
        <div className={styles.container}>
            <div className={styles.mars}></div>
            <img src="https://assets.codepen.io/1538474/404.svg" alt="" className={styles.logo404}/>
            <img src="https://assets.codepen.io/1538474/meteor.svg" alt="" className={styles.meteor}/>
            <p className={styles.title}>Oh no!!</p>
            <p className={styles.subtitle}>
                You’re either misspelling the URL <br /> or requesting a page that's no longer here.
            </p>
            <div style={{textAlign: "center"}} >
                <a className={styles.btnBack} href="/account-management">Back to previous page</a>
            </div>
            <img src="https://assets.codepen.io/1538474/astronaut.svg" alt="" className={styles.astronaut}/>
            <img src="https://assets.codepen.io/1538474/spaceship.svg" alt="" className={styles.spaceship}/>
        </div>
    )
}

export default NotFound;