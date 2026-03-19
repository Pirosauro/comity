export const UserProfile = () => {
  return (
    <div style={{ padding: "20px", border: "2px solid blue", borderRadius: "8px" }}>
      <h2>User profile</h2>
      <p>
        <strong>Name:</strong> John Doe
      </p>
      <p>
        <strong>Email:</strong> user@example.com
      </p>
      <p>
        <em>Loaded after 10 seconds!</em>
      </p>
    </div>
  );
};

export default UserProfile;
