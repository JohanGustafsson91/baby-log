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
        <div className="mb-32">
          <h3>Konto</h3>
          <p>{session.name}</p>
          <p>{session.email}</p>
        </div>

        <h3>Barn</h3>

        <ul className="mb-32">
          {children.map((child) => (
            <li
              key={child.id}
              style={{ fontWeight: selectedChild?.id === child.id ? 800 : 400 }}
            >
              {child.name}
            </li>
          ))}
        </ul>
        <button onClick={logout}>Logga ut</button>
      </div>
    </>
  );
};

export default withProtectedRoute(Settings);
