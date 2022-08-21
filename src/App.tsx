import { Sidebar, Hero, Layout, Register } from "./components";
import { ConnectionProvider, FriendsProvider } from "./provider";

function App() {
  return (
    <ConnectionProvider>
      <Register />
      <Layout>
        <FriendsProvider>
          <Sidebar />
        </FriendsProvider>
        <Hero />
      </Layout>
    </ConnectionProvider>
  );
}

export default App;
