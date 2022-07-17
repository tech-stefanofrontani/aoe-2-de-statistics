import { Route, Routes } from 'react-router-dom';
import React from 'react';
import StatisticsByTeam from './statistics/pages/StatisticsByTeam/StatisticsByTeam';

function AppRouter() {
  return (
    <div className="app">
      <Routes>
        <Route path={"/"} element={<StatisticsByTeam />} />
      </Routes>
    </div>
  );
}

export default AppRouter;
