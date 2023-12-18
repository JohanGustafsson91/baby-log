import { withProtectedRoute } from "@/components/App/App.withProtectedRoute";

const Login = () => {
  return (
    <div className="content">
      <h1>Baby Log</h1>
      <a href={"/api/login"}>Login</a>
    </div>
  );
};

export default withProtectedRoute(Login);
