import React from "react";
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";
import { getSeedBySlug } from "../utils/helpers";
import { SeedProvider } from "../context/SeedContext";
import type { AppRoute } from "../types/main";
import { Routes, Route, useParams, Outlet } from "react-router-dom";
import publicRoutes from "../routes/publicRoutes";
import adminRoutes from "../routes/adminRoutes";
import ErrorMessage from "../components/ErrorMessage";
import type { ReactElement } from "react";
import { SignerProvider } from "../context/SignerContext";

const SeedLayout = () => {
  const { seedSlug } = useParams();
  const seed = getSeedBySlug(seedSlug);

  if (!seed) return <ErrorMessage message="Seed not found" />;

  return (
    <SeedProvider seed={seed}>
      <SignerProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Sticky-style Header */}
          <div className="sticky bg-gray border-b-[2px] border-gray-400 px-2">
            <Header />
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto">
            <PageContainer>
              <Outlet />
            </PageContainer>
          </div>
        </div>
      </SignerProvider>
    </SeedProvider>
  );
};

const App: React.FC = () => {
  const renderRoutes = (routes: AppRoute[]): ReactElement[] => {
    return routes.map(({ path, component: Component, children }) => (
      <Route key={path} path={path} element={<Component />}>
        {children && renderRoutes(children)}
      </Route>
    ));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ErrorMessage message="You don't have a seed. You need a seed to use waiverlink." />
        }
      />

      <Route path="/:seedSlug/*" element={<SeedLayout />}>
        {renderRoutes(publicRoutes)}
      </Route>

      <Route path="/admin/:seedSlug/*" element={<SeedLayout />}>
        {renderRoutes(adminRoutes)}
      </Route>
    </Routes>
  );
};

export default App;
