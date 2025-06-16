export const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};
fetch("/api/habits", {
  headers: {
    "Content-Type": "application/json",
    ...authHeader(),
  },
});