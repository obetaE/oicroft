"use client";
import React from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { handleLogout } from "@/libs/Action/action";
import { useState } from "react";
import Link from "next/link";

const Links = ({ session , id }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const homepage = () => {
    router.push("/");
  };

  const support = () => {
    router.push("/support");
  };


  const notification = () => {
    router.push("/notifications");
  };

  const order = () => {
    router.push("/order");
  };

  const admin = () => {
    router.push("/admin");
  };

  const handleUser = () => {
    if (session) {
        router.push(`/profile/${id}`);
      
    } else {
      router.push("/login");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.logocontainer}>
          <button onClick={homepage} className={styles.logo}>
            <Image
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053569/Oicroft_logo_gr0qpv.png"
              alt="Logo Icon"
              fill
            />
          </button>
        </div>

        {session ? (
          session.user?.isAdmin && (
            <div className={styles.admincontainer}>
              <button onClick={admin} className={styles.adminbutton}>
                {" "}
                Admin{" "}
              </button>
            </div>
          )
        ) : (
          <div className="hidden"></div>
        )}

        <div className={styles.linkscontainer}>
          <button onClick={support} className={styles.links}>
            <Image
              alt="Support icon"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053569/Support_rtcrq2.png"
              className={styles.linkimage}
              width={50}
              height={50}
            />
          </button>

          <button onClick={order} className={styles.links}>
            <Image
              alt="Order icon"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053568/Shop_icon_ulfhcd.png"
              className={styles.linkimage}
              width={40}
              height={40}
            />
          </button>
          <button onClick={handleUser} className={styles.links}>
            <Image
              alt="Profile icon"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053568/Profile_icon_mcjw7m.png"
              className={styles.linkimage}
              width={40}
              height={40}
            />
          </button>

          {session ? (
            <div className="flex">
              <button onClick={notification} className={styles.links}>
                <Image
                  alt="Notification Icon"
                  src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053568/notification_sb8sqk.png"
                  className={styles.linkimage}
                  width={40}
                  height={40}
                />
              </button>
              <form action={handleLogout}>
                <button className={styles.logout}>Logout</button>
              </form>
            </div>
          ) : (
            <div className="hidden"></div>
          )}
        </div>
      </div>
      {/* MOBILE VIEW */}
      <div className={styles.sidenavcontainer}>
        <div className={styles.header}>
          <div className={styles.logocontainer}>
            <Image
              alt="Oicroft Logo"
              src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053570/Website_Page_piux2z.png"
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
                  alt="hamburger icon"
                  src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053569/close_v01sqf.png"
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
            <Link href="/admin" onClick={() => setOpen(false)}>
              Admin
            </Link>
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
                  Cart
                </Link>

                <form action={handleLogout}>
                  <button>LogOut</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
