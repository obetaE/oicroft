"use client"
import React from 'react'
import styles from "./secondnav.module.css"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { handleLogout } from '@/libs/Action/action';
import {useState} from "react";
import Link from 'next/link';
import {useSelector} from "react-redux";

const ProductIdLinks = ({session, id}) => {
    const distinctProducts = useSelector(
          (state) => state.cart.distinctProducts
        );

    const [open, setOpen] = useState(false);  

    const router = useRouter();

      const homepage = () => {
        router.push("/");
      };

       const support = () => {
         router.push("/support");
       };


       const cart = () => {
         router.push("/cart");
       };

       const profile = () =>{
        router.push(`/profile/${id}`);
       }


  return (
    <>
      <div className={styles.container}>
        <div className={styles.right}>
          <button onClick={profile} className={styles.links}>
            <Image
              alt="Profile icon"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053568/Profile_icon_mcjw7m.png"
              className={styles.linkimage}
              width={50}
              height={50}
            />
          </button>

          <button onClick={support} className={styles.links}>
            <Image
              alt="Support icon"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053569/Support_rtcrq2.png"
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
                src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053569/Oicroft_logo_gr0qpv.png"
                alt="Logo"
                className={styles.logoimg}
                fill
              />
            </button>
          </div>
        </div>
        <div className={styles.left}>
          <button onClick={cart} className={styles.links}>
            <h2>{distinctProducts}</h2>
            <Image
              alt="Order icon"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053568/Shop_icon_ulfhcd.png"
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
          <div className={styles.logocontainers}>
            <Image
              alt="Oicroft Logo"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053570/Website_Page_piux2z.png"
              width={50}
              height={50}
            />
          </div>
          {!open ? (
            <div className={styles.hamburgerbg}>
              <div className={styles.imgcontainer}>
                <Image
                  className={styles.hamburger}
                  alt="hamburger icon"
                  src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053568/hamburger_j7g5gz.png"
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
                  alt="close icon"
                  src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053569/close_v01sqf.png"
                  fill
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        {open && (
          <div className={styles.navblur} onClick={() => setOpen(false)}>
            <div
              className={styles.navlinks}
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${styles.link} ${
                    pathName === item.path ? styles.active : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              {!session ? (
                <Link
                  href="/login"
                  className={styles.link}
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div>
                  <div className={styles.column}>
                    <Link
                      href={`/profile/${id}`}
                      className={styles.link}
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/cart"
                      className={styles.link}
                      onClick={() => setOpen(false)}
                    >
                       Cart ({distinctProducts})
                    </Link>
                  </div>
                  <form action={handleLogout}>
                    <button className={styles.sidelogout}>LogOut</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductIdLinks