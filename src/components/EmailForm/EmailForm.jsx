export default function EmailForm() {
  const [emailContent, setEmailContent] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/sendEmails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailContent }),
    });
    alert("Emails sent successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder="Type your message here"
      />
      <button type="submit">Send Email</button>
    </form>
  );
}
