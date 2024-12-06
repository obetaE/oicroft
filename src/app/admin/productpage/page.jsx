import React from "react";
import styles from "./product.module.css";
import Image from "next/image";

export default function productpage() {
  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <div className={styles.section}>
          <div className={styles.item}>
            <h1>Products</h1>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Image
                      src="/flier1.png"
                      width={50}
                      height={50}
                      objectFit="cover"
                      alt="Product Image"
                    />
                  </td>
                  <td>Id</td>
                  <td>ProductTitle</td>
                  <td>$1000</td>
                  <td>Stock</td>
                  <td>
                    <button className={styles.button}>Edit</button>
                    <button className={styles.button}>Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
                  <td>{"094454444452243".slice(0,5)}...</td>
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
