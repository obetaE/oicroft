import React from "react";
import Secondnav from "@/components/secondnav/Secondnav";
import styles from "./cart.module.css";
import Image from "next/image";

const cart = () => {
  return (
    <div className={styles.container}>
      <Secondnav />
      <div className={styles.cartbg}>
        <div className={styles.section}>
          <div className={styles.left}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tr}>
                  <td>Name</td>
                  <td>Product</td>
                  <td>Price</td>
                  <td>Quantity</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.td}>
                  <td>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Iusto, natus! Aut dignissimos earum nihil eligendi
                    cupiditate dolores itaque, natus inventore nulla expedita
                    assumenda, numquam fugiat hic tenetur rerum nam maxime nobis
                    esse. Ipsam quisquam molestias, temporibus beatae qui,
                    architecto animi optio atque recusandae, mollitia cupiditate
                    illum enim soluta excepturi laudantium?
                  </td>
                  <td>Product</td>
                  <td>Price</td>
                  <td>Quantity</td>
                  <td>Total</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.right}>
            <div className={styles.wrapper}>
              <h2 className={styles.title}>CART TOTAL</h2>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  SubTotal:<b>$79.60</b>
                </div>
              </div>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  Discount:<b>$0.00</b>
                </div>
              </div>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  Logistics:<b>$0.00</b>
                </div>
              </div>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  Total:<b>$79.60</b>
                </div>
                <div className={styles.checkout}>
                  <button disabled type="button" className={styles.button}>
                    CHECKOUT NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.imgContainer}>
          <Image
            src="/Farm logo.png"
            alt="Farm Icon"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default cart;
