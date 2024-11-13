import { auth, signIn, signOut } from "@/auth";

export default async function GoogleSignIn() {
  // const session = await auth()
  // console.log(session)
  // const user = session?.user

  // return user ? (
  //   <div className={styles.container}>
  //     <h1>Welcome {user.name}</h1>
  //     <GoogleSignOut />
  //   </div>
  // ) : (
  //   <div className={styles.container}>
  //     <h1>Please Sign In</h1>
  //     <GoogleSignIn />
  //   </div>
  // );

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
