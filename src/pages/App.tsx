import React from 'react'
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";
import { getSeedBySlug } from '../utils/helpers';
import { SeedProvider } from '../context/SeedContext';
import type { MainProps } from "../types/main";
import { Routes, Route, useParams, Outlet} from "react-router-dom";
import routes from "../routes";
import ErrorMessage from '../components/ErrorMessage';


const SeedLayout = () => {
  const { seedSlug } = useParams();
  const seed = getSeedBySlug(seedSlug);

  if (!seed) return <ErrorMessage message="Seed not found"/>;

  return (
    <SeedProvider seed={seed}>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </SeedProvider>
  );
};

const App: React.FC<MainProps> = () => {

  return (
    <Routes>
      {/* Root path fallback */}
      <Route path="/" element={<ErrorMessage message="You don't have a seed. You need a seed to use waiverlink." />} />

      {/* Seed-specific routes */}
      <Route path="/:seedSlug/*" element={<SeedLayout />}>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
