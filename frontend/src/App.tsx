import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { TeamListPage } from "./pages/TeamListPage";
import { TeamDetailPage } from "./pages/TeamDetailPage";
import { CreateTeamPage } from "./pages/CreateTeamPage";
import { TopNavBar } from "./components/TopNavBar";
import { CreatePlayerPage } from "./pages/CreatePlayerPage";
import { PlayerListPage } from "./pages/PlayerListPage";
import { PlayerDetailPage } from "./pages/PlayerDetailPage";
import { CoachListPage } from "./pages/CoachListPage";
import { CreateCoachPage } from "./pages/CreateCoachPage";
import { CoachDetailPage } from "./pages/CoachDetailPage";
import { AssignCoachPage } from "./pages/AssignCoachPage";
import { MatchesPage } from "./pages/MatchesPage";
import { MatchDetailsPage } from "./pages/MatchDetailsPage";
import { CreateMatchPage } from "./pages/CreateMatchPage";
import React from "react";
import { CssBaseline } from "@mui/material";
import {EditionDashboardPage} from "./pages/EditionDashboardPage.tsx";
import {CompetitionDetailsPage} from "./pages/CompetitionDetailsPage.tsx";
import {CompetitionListPage} from "./pages/CompetitionListPage.tsx";

function App() {
  return (
      <React.Fragment>
        <CssBaseline/>
        <TopNavBar/>
        <Routes>
          <Route path="/" element={<Navigate to="/teams"/>}/>
          <Route path="/teams" element={<TeamListPage/>}/>
          <Route path="/teams/:id" element={<TeamDetailPage/>}/>
          <Route path="/teams/create" element={<CreateTeamPage/>}/>
          <Route path="/teams/:id/assign-coach" element={<AssignCoachPage/>}/>

          <Route path="/players" element={<PlayerListPage/>}/>
          <Route path="/players/create" element={<CreatePlayerPage/>}/>
          <Route path="/players/:id" element={<PlayerDetailPage/>}/>

          <Route path="/coaches" element={<CoachListPage/>}/>
          <Route path="/coaches/create" element={<CreateCoachPage/>}/>
          <Route path="/coaches/:id" element={<CoachDetailPage/>}/>

          <Route path="/matches/" element={<MatchesPage/>}/>
          <Route path="/matches/:id" element={<MatchDetailsPage/>}/>
          <Route path="/matches/create" element={<CreateMatchPage/>}/>

          <Route path="/competitions" element={<CompetitionListPage/>}/>
          <Route path="/competitions/:id" element={<CompetitionDetailsPage/>}/>
          <Route path="/editions/:id/dashboard" element={<EditionDashboardPage/>}/>

          <Route
              path="/assign-coach-to-team"
              element={<AssignCoachPage/>}/>
        </Routes>
      </React.Fragment>
  );
}

export default App;

