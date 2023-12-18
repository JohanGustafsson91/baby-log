import { useSession } from "@/components/App/App.SessionProvider";
import { useSettings } from "@/components/App/App.SettingsProvider";
import { withProtectedRoute } from "@/components/App/App.withProtectedRoute";
import { Header } from "@/components/Header/Header";

const Settings = () => {
  const { logout, session } = useSession();
  const { children, selectedChild } = useSettings();

  return (
    <>
      <Header title="Inställningar" />
      <div className="content">
        <h3>{session.name}</h3>

        <h1>Barn</h1>

        <ul>
          {children.map((child) => (
            <li
              key={child.id}
              style={{ fontWeight: selectedChild?.id === child.id ? 800 : 400 }}
            >
              {child.name}
            </li>
          ))}
        </ul>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
};

export default withProtectedRoute(Settings);
