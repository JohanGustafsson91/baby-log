import { useSession } from "@/components/SessionProvider/SessionProvider";
import { withProtectedRoute } from "@/components/SessionProvider/withProtectedRoute";
import { useSettings } from "@/components/SettingsProvider/SettingsProvider";

const Settings = () => {
  const { logout, session } = useSession();
  const { children, selectedChild } = useSettings();

  return (
    <main>
      <h3>Hello {session.name}</h3>
      <p>Children</p>

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
    </main>
  );
};

export default withProtectedRoute(Settings);