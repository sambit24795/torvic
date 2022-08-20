import { Sidebar, Hero, Layout, AvatarList, Register } from "./components";
import { ConnectionProvider, FriendsProvider } from "./provider";

function App() {
  return (
    <ConnectionProvider>
      <Register />
      <Layout>
        <FriendsProvider>
          <Sidebar>
            <AvatarList />
          </Sidebar>
        </FriendsProvider>
        <Hero />
      </Layout>
    </ConnectionProvider>
  );
}

export default App;
