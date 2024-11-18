import { getUsers } from "@/libs/Action/data"
import { deleteUser } from "@/libs/Action/action"
import React from "react"
import styles from "./AdminUser.module.css"
import Image from "next/image"

const AdminUsers = async () =>{


    const users = await getUsers();


    return(
        <div>
          <h1>Users</h1>
      {users.map((user)=>(
        <div className={styles.user} key={user.id} >
            <div className={styles.details} >
                <Image
                src={user.image || "/noAvatar.png" }
                alt='Profile Image'
                width={50}
                height={50}
                />
                <span>{user.username}</span>
                <p>{user.email}</p>
            </div>
            <form action={deleteUser} >
              < input type="hidden" name="id" value={user.id}/>
              <button className={styles.delete} >Delete</button>
            </form>
        </div>
      ))}
        </div>
    )
}

export default AdminUsers