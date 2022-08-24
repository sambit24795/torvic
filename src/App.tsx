import { Sidebar, Hero, Layout, Register, Profilebar } from "./components";
import { ConnectionProvider, FriendsProvider } from "./provider";

function App() {
  return (
    <ConnectionProvider>
      <Register />
      <Layout>
        <FriendsProvider>
          <Profilebar />
          <Sidebar />
          <Hero />
        </FriendsProvider>
      </Layout>
    </ConnectionProvider>
  );
}

export default App;
