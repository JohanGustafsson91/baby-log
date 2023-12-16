import { withProtectedRoute } from "@/components/SessionProvider/withProtectedRoute";

const Login = () => {
  return (
    <main>
      <h1>Baby Log</h1>
      <a href={"/api/login"}>Login</a>
    </main>
  );
};

export default withProtectedRoute(Login);
