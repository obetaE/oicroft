"use client"
import React from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import Image from 'next/image'


const Footer = () => {
  //oicroftco@gmail.com

  return (
    <div className={styles.container}>
      {/* Beginning of the container */}
      <div className={styles.textbox}>
        <Link href="/support" className={styles.text}>
          FAQs
        </Link>
        <Link href="/termsandconditions" className={styles.text}>
          Terms & Conditions
        </Link>
        <Link href="/termsandconditions" className={styles.text}>
          Privacy Policy
        </Link>
        <div className={styles.text}>© 2024 Oicroft </div>
      </div>

      <div className={styles.linkbox}>
        <button
          onClick={() => (window.location.href = "mailto:oicroftco@gmail.com")}
          className={styles.links}
        >
          <Image
            src="/Email.png"
            className={styles.linksimg}
            alt="Social Media"
            fill
          />
        </button>

        <Link
          href="https://www.facebook.com/profile.php?id=61558022143571"
          className={styles.links}
        >
          <Image
            src="/Facebook.png"
            className={styles.linksimg}
            alt="Social Media"
            fill
          />
        </Link>

        <Link
          href="https://x.com/Oicroft?t=xAfAW9Gz0kkdsk7pzjOcxQ&s=09"
          className={styles.twitterlinks}
        >
          <Image
            src="/Twitter.png"
            className={styles.linksimg}
            alt="Social Media"
            fill
          />
        </Link>

        <Link
          href="https://www.instagram.com/oicroft?igsh=MWY5a3Z2emt3eXBuZQ=="
          className={styles.links}
        >
          <Image
            src="/Instagram.png"
            className={styles.linksimg}
            alt="Social Media"
            fill
          />
        </Link>
      </div>

      {/* End of the container */}
    </div>
  );
}

export default Footer
