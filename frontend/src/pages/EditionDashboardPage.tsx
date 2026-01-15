import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEditionDashboard } from '../services/EditionService';
import type { EditionDashboardDto } from '../dto/EditionDashboardDto';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Card, CardContent, Typography } from '@mui/material';

export const EditionDashboardPage = () => {
    const { id } = useParams<{ id: string }>();
    const [dashboard, setDashboard] = useState<EditionDashboardDto | null>(null);

    useEffect(() => {
        if (id) {
            getEditionDashboard(id).then(setDashboard).catch(console.error);
        }
    }, [id]);

    if (!dashboard) return <div>Loading Dashboard...</div>;

    const hasStandings = dashboard.table && dashboard.table.length > 0;

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                {dashboard.competitionName}: {dashboard.editionName}
            </Typography>

            {hasStandings && (
                <Paper style={{ marginBottom: '30px', padding: '10px' }}>
                    <Typography variant="h5" style={{ padding: '10px' }}>League Table</Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell align="right">Played</TableCell>
                                <TableCell align="right">W</TableCell>
                                <TableCell align="right">D</TableCell>
                                <TableCell align="right">L</TableCell>
                                <TableCell align="right">GF</TableCell>
                                <TableCell align="right">GA</TableCell>
                                <TableCell align="right">GD</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dashboard.table.map((row, index) => (
                                <TableRow key={row.teamId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Link to={`/teams/${row.teamId}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                                            {row.teamName}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{row.played}</TableCell>
                                    <TableCell align="right">{row.wins}</TableCell>
                                    <TableCell align="right">{row.draws}</TableCell>
                                    <TableCell align="right">{row.losses}</TableCell>
                                    <TableCell align="right">{row.goalsFor}</TableCell>
                                    <TableCell align="right">{row.goalsAgainst}</TableCell>
                                    <TableCell align="right">{row.goalDifference}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{row.points}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {/* Matches / Rounds */}
            <Typography variant="h5" gutterBottom>Matches</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {dashboard.rounds.map((roundMatches, index) => (
                    <Card key={index}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Matchday {index + 1}</Typography>
                            <Table size="small">
                                <TableBody>
                                    {roundMatches.map(match => (
                                        <TableRow key={match.id}>
                                            <TableCell>{new Date(match.matchDate).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/teams/TODO_get_id_from_match`} style={{ textDecoration: 'none', color: 'black' }}>
                                                    {match.homeTeamName}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                                {match.status === 'FINISHED' ? `${match.homeScore} - ${match.awayScore}` : 'v'}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Link to={`/teams/TODO_get_id_from_match`} style={{ textDecoration: 'none', color: 'black' }}>
                                                    {match.awayTeamName}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{match.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};