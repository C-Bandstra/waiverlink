// import { useState } from 'react'
import WaiverScreen from "./WaiverScreen";
import Header from "../components/Header";

function Home() {

  return (
    <div className="py-4 text-center text-blue-600">
      <Header />
      <div className="px-4">
        <WaiverScreen />
      </div>
    </div>
  );
}

export default Home;
