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
    const quantity = useSelector(state=>state.cart.quantity)

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
            <h2>{quantity}</h2>
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
                <Link href={`/profile/${id}`} onClick={() => setOpen(false)}>
                  Profile
                </Link>

                <Link href="/cart" onClick={() => setOpen(false)}>
                  Cart ({quantity})
                </Link>

                <form action={handleLogout}>
                  <button onClick={() => setOpen(false)}>LogOut</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ProductIdLinks