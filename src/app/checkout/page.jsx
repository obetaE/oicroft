import React from "react";
import styles from "./checkout.module.css";
import Image from 'next/image'
import Secondnav from "@/components/secondnav/Secondnav"

const checkout = () => {

  const status = 0;

  const statusClass = (index) =>{
    if (index - status < 1) return styles.done
    if (index - status === 1) return styles.inProgress
    if (index - status > 1) return styles.undone
  }

  return (
    <div className={styles.container}>
      <Secondnav />
      <div className={styles.checkoutbg}>
        <div className={styles.section}>
          <div className={styles.left}>
            <div className={styles.row}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tr}>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <span className={styles.id}>234563556643</span>
                    </td>
                    <td>
                      <span className={styles.name}> Diego Franchiso </span>
                    </td>
                    <td>
                      <span className={styles.address}>
                        {" "}
                        12 Oaks Morris Street
                      </span>
                    </td>
                    <td>
                      <span className={styles.total}> ₦12348.32</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.row}>
              <div className={statusClass(0)}>
                <Image
                  src="/paid.png"
                  alt="Progress Icon "
                  width={30}
                  height={30}
                />
                <span> Order Paid</span>
                <div className={styles.checkedIcon}>
                  <Image
                    className={styles.checked}
                    src="/checked.png"
                    alt="Progress Icon "
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className={statusClass(1)}>
                <Image
                  src="/bake.png"
                  alt="Progress Icon "
                  width={30}
                  height={30}
                />
                <span>Order Packaged</span>
                <div className={styles.checkedIcon}>
                  <Image
                    className={styles.checked}
                    src="/checked.png"
                    alt=" Progress Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className={statusClass(2)}>
                <Image
                  src="/truck-kun.png"
                  alt=" Progress Icon"
                  width={55}
                  height={55}
                />
                <span>Logistics</span>
                <div className={styles.checkedIcon}>
                  <Image
                    className={styles.checked}
                    src="/checked.png"
                    alt="Progress Icon "
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className={statusClass(3)}>
                <Image
                  src="/delivered.png"
                  alt="Progress Icon "
                  width={30}
                  height={30}
                />
                <span>Recieved</span>
                <div className={styles.checkedIcon}>
                  <Image
                    className={styles.checked}
                    src="/checked.png"
                    alt="Progress Icon "
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
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
                  Discount<b>$0.00</b>
                </div>
              </div>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  Total<b>$79.60</b>
                </div>
                <button disabled type="button" className={styles.button}>
                  PAID
                </button>
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

export default checkout;
