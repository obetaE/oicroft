"use client"
import React from 'react'
import styles from "./secondnav.module.css"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { handleLogout } from '@/libs/Action/action';
import {useState} from "react";
import Link from 'next/link';

const SecondLinks = ({session}) => {

    const [open, setOpen] = useState(false);  

    const router = useRouter();

      const homepage = () => {
        router.push("/");
      };

       const support = () => {
         router.push("/support");
       };

       const order = () => {
         router.push("/order");
       };

       const profile = () =>{
        router.push(`/profile/${profile._id}`);
       }


  return (
    <>
      <div className={styles.container}>
        <div className={styles.right}>
          <button className={styles.links}>
            <Image
              alt="Profile icon"
              src="/Profile icon.png"
              className={styles.linkimage}
              width={50}
              height={50}
            />
          </button>

          <button onClick={support} className={styles.links}>
            <Image
              alt="Support icon"
              src="/Support.png"
              className={styles.linkimage}
              width={75}
              height={75}
            />
          </button>
        </div>
        <div className={styles.center}>
          <div className={styles.logocontainer}>
            <button onClick={homepage} className={styles.logo}>
              <Image
                src="/Oicroft logo.png"
                alt="Logo"
                className={styles.logoimg}
                fill
              />
            </button>
          </div>
        </div>
        <div className={styles.left}>
          <button onClick={order} className={styles.links}>
            <h2>2</h2>
            <Image
              alt="Order icon"
              src="/Shop icon.png"
              className={styles.linkimage}
              width={50}
              height={50}
            />
          </button>
          <form action={handleLogout}>
            <button onClick={homepage} className={styles.button}>
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className={styles.sidenavcontainer}>
        <div className={styles.header}>
          <div className={styles.logocontainer}>
            <Image
              alt="Oicroft Logo"
              src="/Oicroft logo.png"
              width={150}
              height={150}
            />
          </div>
          {!open ? (
            <div className={styles.hamburgerbg}>
              <div className={styles.imgcontainer}>
                <Image
                  className={styles.hamburger}
                  alt="hamburger icon"
                  src="/hamburger.png"
                  fill
                  objectFit="contain"
                  onClick={() => setOpen(true)}
                />
              </div>
            </div>
          ) : (
            <div className={styles.hamburgerbg}>
              <div className={styles.imgcontainer2}>
                <Image
                  className={styles.hamburger}
                  alt="hamburger icon"
                  src="/close.png"
                  fill
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        {open && (
          <div className={styles.navlinks}>
            <Link href="/" onClick={() => setOpen(false)}>
              HomePage
            </Link>
            {session ? (
              session.user?.isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )
            ) : (
              <div className="hidden"></div>
            )}
            <Link href="/support" onClick={() => setOpen(false)}>
              Support
            </Link>
            <Link href="/menu" onClick={() => setOpen(false)}>
              Order
            </Link>

            {!session ? (
              <Link href="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            ) : (
              <div>
                <Link
                  href={`/profile/${profile._id}`}
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <button onClick={() => setOpen(false)}>LogOut</button>
                <Link href="/cart" onClick={() => setOpen(false)}>
                  Cart
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SecondLinks