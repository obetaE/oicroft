"use client";
import { useState } from "react";
import React from "react";
import styles from "./SupportContent.module.css";
import Image from "next/image";

export default function SupportContent({ supports }) {
  const [openId, setOpenId] = useState(null); // Track which support item is open

  return (
    <div className={styles.container}>
      {supports.map((support) => (
        <div className={styles.support} key={support.id}>
          <div className={styles.details}>
            <div
              className={styles.open}
              onClick={() =>
                setOpenId(openId === support.id ? null : support.id)
              }
            >
              <Image src="/open.png" alt="Open Button" width={20} height={20} />
              {support.title}
            </div>
            {openId === support.id && <div className={styles.desc} >{support.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
