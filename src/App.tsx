import React from "react";
import { Sidebar, Hero, Layout, AvatarList } from "./components";

function App() {
  return (
    <Layout>
      <Sidebar>
        <AvatarList />
      </Sidebar>
      <Hero />
    </Layout>
  );
}

export default App;
