import { signOut } from "@/auth";

export default async function GoogleSignOut() {
  // const session = await auth()
  // console.log(session)
  // const user = session?.user
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Logout</button>
    </form>
  );
}
