import React from "react"
import Image from "next/image";
import styles from "./orders.module.css"

export default function order(){
    return (
      <div className={styles.container}>
        <div className={styles.adminbg}>
          <div className={styles.section}>
            <div className={styles.item}>
              <h1>Orders</h1>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>OrderId</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Code</th>
                    <th>Total Price</th>
                    <th>Delivery Method</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"094454444452243".slice(0, 5)}...</td>
                    <td>Chukwuka Obeta</td>
                    <td>Obetachukwuka1@gmail.Customer</td>
                    <td>443567</td>
                    <td>$56900</td>
                    <td>Delivery</td>
                    <td>Preparing</td>

                    <td>
                      <button>Next Stage</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
}

