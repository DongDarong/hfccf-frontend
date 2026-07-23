-- Sport Module Demo Data Seeding Script
-- Medium dataset for testing and development
-- Generated: 2026-07-22

-- Disable foreign key checks during import
SET FOREIGN_KEY_CHECKS=0;

-- ============================================================================
-- INSERT DIVISIONS
-- ============================================================================
INSERT INTO `sport_divisions` (id, name, description, status, created_at, updated_at) VALUES
(1, 'U-12 Division', 'Under 12 years old', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
(2, 'U-15 Division', 'Under 15 years old', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
(3, 'U-18 Division', 'Under 18 years old', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
(4, 'Senior Division', 'Senior players', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00');

-- ============================================================================
-- INSERT PLAYING STYLES
-- ============================================================================
INSERT INTO `sport_playing_styles` (id, name, description, status, created_at, updated_at) VALUES
(1, 'Tiki-Taka', 'Possession-based passing game', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
(2, 'Counter Attack', 'Fast-paced counter-attacking', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
(3, 'Defensive', 'Defensive-focused strategy', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
(4, 'Attacking', 'High-pressure attacking', 'active', '2026-01-01 00:00:00', '2026-01-01 00:00:00');

-- ============================================================================
-- INSERT TEAMS
-- ============================================================================
INSERT INTO `sport_teams` (id, team_code, name, short_name, division_id, playing_style_id, coach_user_id, coach_display_name, captain_name, venue, status, players_count, matches_count, wins, draws, losses, points, created_at, updated_at) VALUES
(1, 'PHC001', 'Phnom Penh City FC', 'PPFC', 3, 1, 'coach001', 'Kong Sophea', 'Som Pich', 'Olympic Stadium', 'active', 8, 0, 0, 0, 0, 0, '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(2, 'SIH001', 'Sihanoukville United', 'SU', 3, 2, 'coach002', 'Thay Chandra', 'Seah David', 'Independence Stadium', 'active', 7, 0, 0, 0, 0, 0, '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(3, 'BT001', 'Battambang Tigers', 'BT', 3, 4, 'coach003', 'Nol Vibol', 'Oum Ratanak', 'Battambang Stadium', 'active', 7, 0, 0, 0, 0, 0, '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(4, 'KPT001', 'Kompong Thom Hawks', 'KTH', 3, 3, 'coach004', 'Sok Srey', 'Chim Rony', 'Kompong Thom Stadium', 'active', 6, 0, 0, 0, 0, 0, '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(5, 'SR001', 'Siem Reap Royals', 'SR', 2, 1, 'coach005', 'Sar Sophea', 'Tith Dara', 'Siem Reap Stadium', 'active', 9, 0, 0, 0, 0, 0, '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(6, 'PM001', 'Preah Sihanouk Mechanics', 'PSM', 2, 2, 'coach006', 'Peng Chamrong', 'Ry Piseth', 'Preah Sihanouk Stadium', 'active', 8, 0, 0, 0, 0, 0, '2026-01-15 00:00:00', '2026-01-15 00:00:00');

-- ============================================================================
-- INSERT PLAYERS (45 players across 6 teams)
-- ============================================================================
INSERT INTO `sport_players` (id, player_code, first_name, last_name, team_id, jersey_number, position, gender, date_of_birth, current_school, grade_year, primary_position, status, approval_status, roster_status, created_at, updated_at) VALUES
-- Team 1: Phnom Penh City FC (8 players)
(1, 'PLY001', 'Som', 'Pich', 1, 10, 'Forward', 'M', '2005-03-15', 'High School A', '12', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(2, 'PLY002', 'Penh', 'Sokhean', 1, 7, 'Midfielder', 'M', '2006-06-20', 'High School B', '11', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(3, 'PLY003', 'Chea', 'Visoth', 1, 1, 'Goalkeeper', 'M', '2004-01-10', 'High School C', '12', 'Goalkeeper', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(4, 'PLY004', 'Keo', 'Sophy', 1, 4, 'Defender', 'M', '2005-08-25', 'High School D', '11', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(5, 'PLY005', 'Oum', 'Bunhak', 1, 9, 'Forward', 'M', '2006-02-14', 'High School A', '10', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(6, 'PLY006', 'Pich', 'Sophea', 1, 6, 'Midfielder', 'M', '2005-11-03', 'High School E', '11', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(7, 'PLY007', 'Thay', 'Dara', 1, 3, 'Defender', 'M', '2004-09-18', 'High School F', '12', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(8, 'PLY008', 'Nol', 'Chamrong', 1, 5, 'Defender', 'M', '2005-05-22', 'High School G', '11', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),

-- Team 2: Sihanoukville United (7 players)
(9, 'PLY009', 'Seah', 'David', 2, 10, 'Forward', 'M', '2005-07-12', 'High School H', '11', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(10, 'PLY010', 'Pun', 'Kamaera', 2, 7, 'Midfielder', 'M', '2006-04-08', 'High School I', '10', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(11, 'PLY011', 'Seng', 'Malis', 2, 1, 'Goalkeeper', 'M', '2003-12-20', 'High School J', '12', 'Goalkeeper', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(12, 'PLY012', 'Tith', 'Rory', 2, 4, 'Defender', 'M', '2005-10-30', 'High School K', '11', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(13, 'PLY013', 'Chim', 'Vannak', 2, 9, 'Forward', 'M', '2006-01-17', 'High School L', '10', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(14, 'PLY014', 'Han', 'Samnang', 2, 6, 'Midfielder', 'M', '2005-09-05', 'High School M', '11', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(15, 'PLY015', 'Hy', 'Serey', 2, 3, 'Defender', 'M', '2004-08-28', 'High School N', '12', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),

-- Team 3: Battambang Tigers (7 players)
(16, 'PLY016', 'Oum', 'Ratanak', 3, 10, 'Forward', 'M', '2005-05-19', 'High School O', '11', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(17, 'PLY017', 'Prak', 'Chenda', 3, 7, 'Midfielder', 'M', '2006-03-02', 'High School P', '10', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(18, 'PLY018', 'Rin', 'Sreypov', 3, 1, 'Goalkeeper', 'M', '2004-02-11', 'High School Q', '12', 'Goalkeeper', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(19, 'PLY019', 'Sam', 'Piseth', 3, 4, 'Defender', 'M', '2005-12-07', 'High School R', '11', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(20, 'PLY020', 'Rith', 'Sovann', 3, 9, 'Forward', 'M', '2006-07-21', 'High School S', '10', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(21, 'PLY021', 'Phu', 'Sokhan', 3, 6, 'Midfielder', 'M', '2005-04-14', 'High School T', '11', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(22, 'PLY022', 'Kong', 'Vichet', 3, 2, 'Defender', 'M', '2004-11-26', 'High School U', '12', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),

-- Team 4: Kompong Thom Hawks (6 players)
(23, 'PLY023', 'Chim', 'Rony', 4, 10, 'Forward', 'M', '2005-06-13', 'High School V', '11', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(24, 'PLY024', 'Sar', 'Sompheap', 4, 7, 'Midfielder', 'M', '2006-08-24', 'High School W', '10', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(25, 'PLY025', 'Sok', 'Dara', 4, 1, 'Goalkeeper', 'M', '2003-10-09', 'High School X', '12', 'Goalkeeper', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(26, 'PLY026', 'Tum', 'Leakena', 4, 4, 'Defender', 'M', '2005-02-16', 'High School Y', '11', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(27, 'PLY027', 'Nav', 'Channara', 4, 9, 'Forward', 'M', '2006-09-01', 'High School Z', '10', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(28, 'PLY028', 'Vin', 'Pysara', 4, 5, 'Defender', 'M', '2004-07-31', 'High School AA', '12', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),

-- Team 5: Siem Reap Royals (9 players - U-15)
(29, 'PLY029', 'Tith', 'Dara', 5, 10, 'Forward', 'M', '2010-04-09', 'School SR1', '6', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(30, 'PLY030', 'Puth', 'Sophea', 5, 7, 'Midfielder', 'M', '2011-02-14', 'School SR2', '5', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(31, 'PLY031', 'Vin', 'Sokhem', 5, 1, 'Goalkeeper', 'M', '2009-06-28', 'School SR3', '7', 'Goalkeeper', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(32, 'PLY032', 'Ry', 'Sothea', 5, 4, 'Defender', 'M', '2010-11-05', 'School SR4', '6', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(33, 'PLY033', 'Phuong', 'Sophit', 5, 9, 'Forward', 'M', '2011-08-19', 'School SR5', '5', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(34, 'PLY034', 'Khom', 'Pisal', 5, 6, 'Midfielder', 'M', '2010-01-23', 'School SR6', '6', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(35, 'PLY035', 'Som', 'Theary', 5, 3, 'Defender', 'M', '2009-12-10', 'School SR7', '7', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(36, 'PLY036', 'Nit', 'Sarun', 5, 8, 'Midfielder', 'M', '2011-03-30', 'School SR8', '5', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(37, 'PLY037', 'Rach', 'Menha', 5, 11, 'Forward', 'M', '2011-07-12', 'School SR9', '5', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),

-- Team 6: Preah Sihanouk Mechanics (8 players - U-15)
(38, 'PLY038', 'Ry', 'Piseth', 6, 10, 'Forward', 'M', '2010-05-16', 'School PS1', '6', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(39, 'PLY039', 'Pou', 'Channy', 6, 7, 'Midfielder', 'M', '2011-09-22', 'School PS2', '5', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(40, 'PLY040', 'Tith', 'Mony', 6, 1, 'Goalkeeper', 'M', '2009-03-18', 'School PS3', '7', 'Goalkeeper', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(41, 'PLY041', 'Nob', 'Karell', 6, 4, 'Defender', 'M', '2010-10-04', 'School PS4', '6', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(42, 'PLY042', 'Sak', 'Chantha', 6, 9, 'Forward', 'M', '2011-04-08', 'School PS5', '5', 'Forward', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(43, 'PLY043', 'Men', 'Sophear', 6, 6, 'Midfielder', 'M', '2010-07-29', 'School PS6', '6', 'Midfielder', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(44, 'PLY044', 'Tey', 'Lyheng', 6, 2, 'Defender', 'M', '2009-08-14', 'School PS7', '7', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00'),
(45, 'PLY045', 'Hing', 'Vuthy', 6, 5, 'Defender', 'M', '2010-02-27', 'School PS8', '6', 'Defender', 'active', 'approved', 'active', '2026-01-20 00:00:00', '2026-01-20 00:00:00');

-- ============================================================================
-- INSERT TOURNAMENTS
-- ============================================================================
INSERT INTO `sport_tournaments` (id, tournament_code, slug, name, season, tournament_type, status, visibility, registration_open_at, registration_close_at, starts_at, ends_at, description, location, organizer, created_by_user_id, created_at, updated_at) VALUES
(1, 'TRNMNT001', 'national-league-2026', 'National Football League 2026', '2026', 'league', 'active', 'public', '2026-01-01 00:00:00', '2026-02-01 00:00:00', '2026-02-15 00:00:00', '2026-06-30 00:00:00', 'National Football League Season 2026', 'Cambodia', 'Cambodia Football Federation', 'admin001', '2026-01-01 00:00:00', '2026-01-01 00:00:00'),
(2, 'TRNMNT002', 'youth-cup-2026', 'Youth Football Cup 2026', '2026', 'cup', 'draft', 'private', '2026-03-01 00:00:00', '2026-04-01 00:00:00', '2026-04-15 00:00:00', '2026-05-31 00:00:00', 'Youth Football Cup for U-15 Division', 'Phnom Penh', 'Youth Sports Department', 'admin002', '2026-01-15 00:00:00', '2026-01-15 00:00:00');

-- ============================================================================
-- INSERT MATCHES
-- ============================================================================
INSERT INTO `sport_matches` (id, match_code, home_team_id, away_team_id, tournament_id, scheduled_at, venue, status, home_score, away_score, winner_team_id, created_at, updated_at) VALUES
(1, 'MTH001', 1, 2, 1, '2026-02-20 15:00:00', 'Olympic Stadium', 'completed', 2, 1, 1, '2026-02-20 00:00:00', '2026-02-20 18:00:00'),
(2, 'MTH002', 3, 4, 1, '2026-02-21 15:00:00', 'Battambang Stadium', 'completed', 1, 1, NULL, '2026-02-21 00:00:00', '2026-02-21 18:00:00'),
(3, 'MTH003', 5, 6, 1, '2026-02-22 15:00:00', 'Siem Reap Stadium', 'completed', 3, 0, 5, '2026-02-22 00:00:00', '2026-02-22 18:00:00'),
(4, 'MTH004', 2, 3, 1, '2026-03-01 15:00:00', 'Independence Stadium', 'completed', 0, 2, 3, '2026-03-01 00:00:00', '2026-03-01 18:00:00'),
(5, 'MTH005', 4, 1, 1, '2026-03-02 15:00:00', 'Kompong Thom Stadium', 'completed', 1, 3, 1, '2026-03-02 00:00:00', '2026-03-02 18:00:00'),
(6, 'MTH006', 6, 5, 1, '2026-03-03 15:00:00', 'Preah Sihanouk Stadium', 'scheduled', 0, 0, NULL, '2026-03-03 00:00:00', '2026-03-03 00:00:00'),
(7, 'MTH007', 1, 3, 1, '2026-03-10 15:00:00', 'Olympic Stadium', 'scheduled', 0, 0, NULL, '2026-03-10 00:00:00', '2026-03-10 00:00:00'),
(8, 'MTH008', 2, 4, 1, '2026-03-11 15:00:00', 'Independence Stadium', 'scheduled', 0, 0, NULL, '2026-03-11 00:00:00', '2026-03-11 00:00:00'),
(9, 'MTH009', 5, 1, 1, '2026-03-15 15:00:00', 'Siem Reap Stadium', 'scheduled', 0, 0, NULL, '2026-03-15 00:00:00', '2026-03-15 00:00:00'),
(10, 'MTH010', 6, 3, 1, '2026-03-16 15:00:00', 'Preah Sihanouk Stadium', 'scheduled', 0, 0, NULL, '2026-03-16 00:00:00', '2026-03-16 00:00:00');

-- ============================================================================
-- INSERT TRAINING SESSIONS
-- ============================================================================
INSERT INTO `sport_training_sessions` (id, session_code, team_id, coach_user_id, title, training_type, focus, venue, starts_at, ends_at, intensity, status, created_at, updated_at) VALUES
(1, 'TS001', 1, 'coach001', 'Technical Skills Training', 'technical', 'Ball control and passing', 'Olympic Stadium', '2026-02-18 14:00:00', '2026-02-18 16:00:00', 'high', 'completed', '2026-02-18 00:00:00', '2026-02-18 16:30:00'),
(2, 'TS002', 1, 'coach001', 'Tactical Formation Drills', 'tactical', '4-3-3 Formation', 'Olympic Stadium', '2026-02-19 14:00:00', '2026-02-19 16:00:00', 'medium', 'completed', '2026-02-19 00:00:00', '2026-02-19 16:30:00'),
(3, 'TS003', 2, 'coach002', 'Fitness and Conditioning', 'conditioning', 'Endurance training', 'Independence Stadium', '2026-02-20 15:00:00', '2026-02-20 17:00:00', 'high', 'completed', '2026-02-20 00:00:00', '2026-02-20 17:30:00'),
(4, 'TS004', 3, 'coach003', 'Set Piece Practice', 'technical', 'Corners and Free Kicks', 'Battambang Stadium', '2026-02-21 14:00:00', '2026-02-21 16:00:00', 'medium', 'completed', '2026-02-21 00:00:00', '2026-02-21 16:30:00'),
(5, 'TS005', 4, 'coach004', 'Defensive Drills', 'tactical', 'Man-to-man marking', 'Kompong Thom Stadium', '2026-02-23 14:00:00', '2026-02-23 16:00:00', 'medium', 'scheduled', '2026-02-23 00:00:00', '2026-02-23 00:00:00'),
(6, 'TS006', 5, 'coach005', 'Youth Development Training', 'technical', 'Basic skills and coordination', 'Siem Reap Stadium', '2026-02-24 15:00:00', '2026-02-24 16:30:00', 'low', 'scheduled', '2026-02-24 00:00:00', '2026-02-24 00:00:00'),
(7, 'TS007', 6, 'coach006', 'Match Preparation', 'tactical', 'Game strategy review', 'Preah Sihanouk Stadium', '2026-02-25 14:00:00', '2026-02-25 16:00:00', 'medium', 'scheduled', '2026-02-25 00:00:00', '2026-02-25 00:00:00'),
(8, 'TS008', 1, 'coach001', 'Recovery Session', 'conditioning', 'Stretching and recovery', 'Olympic Stadium', '2026-02-26 16:00:00', '2026-02-26 17:00:00', 'low', 'scheduled', '2026-02-26 00:00:00', '2026-02-26 00:00:00');

-- ============================================================================
-- INSERT EQUIPMENT ITEMS
-- ============================================================================
INSERT INTO `sport_equipment_items` (id, equipment_code, name, category, description, unit, total_quantity, available_quantity, minimum_stock_level, storage_location, status, created_at, updated_at) VALUES
(1, 'EQ001', 'Football', 'Balls', 'Official FIFA Soccer Balls', 'piece', 50, 45, 10, 'Storage Room A', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(2, 'EQ002', 'Training Cones', 'Training Aids', 'Multi-color training cones', 'pack', 30, 28, 5, 'Storage Room A', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(3, 'EQ003', 'Team Jersey', 'Apparel', 'Standard team jerseys', 'piece', 100, 85, 20, 'Storage Room B', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(4, 'EQ004', 'Training Bibs', 'Apparel', 'Reversible training bibs', 'piece', 80, 70, 15, 'Storage Room B', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(5, 'EQ005', 'Training Shin Guards', 'Safety', 'Protective shin guards', 'pair', 60, 55, 10, 'Storage Room C', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(6, 'EQ006', 'Training Gloves', 'Apparel', 'Goalkeeper training gloves', 'pair', 25, 20, 5, 'Storage Room C', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(7, 'EQ007', 'Training Ladder', 'Training Aids', 'Agility training ladder', 'piece', 10, 8, 2, 'Storage Room D', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(8, 'EQ008', 'Speed Parachute', 'Training Aids', 'Speed and resistance training parachute', 'piece', 15, 12, 3, 'Storage Room D', 'active', '2026-01-10 00:00:00', '2026-01-10 00:00:00');

-- ============================================================================
-- INSERT EQUIPMENT REQUESTS
-- ============================================================================
INSERT INTO `sport_equipment_requests` (id, request_code, equipment_item_id, coach_user_id, team_id, requested_quantity, approved_quantity, status, purpose, required_date, expected_return_date, reviewed_at, created_at, updated_at) VALUES
(1, 'EQREQ001', 1, 'coach001', 1, 10, 10, 'approved', 'Team training', '2026-02-20', '2026-03-20', '2026-02-15 10:00:00', '2026-02-14 00:00:00', '2026-02-15 10:00:00'),
(2, 'EQREQ002', 2, 'coach002', 2, 5, 5, 'approved', 'Cone training drills', '2026-02-21', '2026-03-21', '2026-02-16 10:00:00', '2026-02-15 00:00:00', '2026-02-16 10:00:00'),
(3, 'EQREQ003', 3, 'coach003', 3, 20, 20, 'approved', 'Match uniforms', '2026-02-25', '2026-03-25', '2026-02-17 10:00:00', '2026-02-16 00:00:00', '2026-02-17 10:00:00'),
(4, 'EQREQ004', 4, 'coach004', 4, 15, 15, 'approved', 'Training bibs for scrimmage', '2026-02-28', '2026-03-28', '2026-02-18 10:00:00', '2026-02-17 00:00:00', '2026-02-18 10:00:00'),
(5, 'EQREQ005', 5, 'coach005', 5, 12, 10, 'approved', 'Youth team protection', '2026-03-01', '2026-04-01', '2026-02-20 10:00:00', '2026-02-19 00:00:00', '2026-02-20 10:00:00'),
(6, 'EQREQ006', 1, 'coach006', 6, 8, NULL, 'pending', 'Youth training', '2026-03-10', '2026-04-10', NULL, '2026-02-21 00:00:00', '2026-02-21 00:00:00');

-- ============================================================================
-- INSERT ATTENDANCE RECORDS
-- ============================================================================
INSERT INTO `sport_attendance_records` (id, attendance_type, subject_key, team_id, player_id, attendance_date, status, note, created_at, updated_at) VALUES
-- Training attendance
(1, 'training', 'training_1', 1, 1, '2026-02-18', 'present', NULL, '2026-02-18 00:00:00', '2026-02-18 00:00:00'),
(2, 'training', 'training_1', 1, 2, '2026-02-18', 'present', NULL, '2026-02-18 00:00:00', '2026-02-18 00:00:00'),
(3, 'training', 'training_1', 1, 3, '2026-02-18', 'absent', 'Injury', '2026-02-18 00:00:00', '2026-02-18 00:00:00'),
(4, 'training', 'training_1', 1, 4, '2026-02-18', 'late', NULL, '2026-02-18 00:00:00', '2026-02-18 00:00:00'),
(5, 'training', 'training_1', 1, 5, '2026-02-18', 'present', NULL, '2026-02-18 00:00:00', '2026-02-18 00:00:00'),
(6, 'training', 'training_2', 2, 9, '2026-02-20', 'present', NULL, '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(7, 'training', 'training_2', 2, 10, '2026-02-20', 'present', NULL, '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(8, 'training', 'training_2', 2, 11, '2026-02-20', 'excused', 'Family commitment', '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(9, 'training', 'training_3', 3, 16, '2026-02-21', 'present', NULL, '2026-02-21 00:00:00', '2026-02-21 00:00:00'),
(10, 'training', 'training_3', 3, 17, '2026-02-21', 'present', NULL, '2026-02-21 00:00:00', '2026-02-21 00:00:00'),
-- Match attendance
(11, 'match', 'match_1', 1, 1, '2026-02-20', 'present', NULL, '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(12, 'match', 'match_1', 1, 2, '2026-02-20', 'present', NULL, '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(13, 'match', 'match_1', 1, 3, '2026-02-20', 'present', NULL, '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(14, 'match', 'match_1', 2, 9, '2026-02-20', 'present', NULL, '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(15, 'match', 'match_1', 2, 10, '2026-02-20', 'present', NULL, '2026-02-20 00:00:00', '2026-02-20 00:00:00'),
(16, 'match', 'match_2', 3, 16, '2026-02-21', 'present', NULL, '2026-02-21 00:00:00', '2026-02-21 00:00:00'),
(17, 'match', 'match_2', 3, 18, '2026-02-21', 'present', NULL, '2026-02-21 00:00:00', '2026-02-21 00:00:00'),
(18, 'match', 'match_2', 4, 23, '2026-02-21', 'present', NULL, '2026-02-21 00:00:00', '2026-02-21 00:00:00'),
(19, 'match', 'match_2', 4, 25, '2026-02-21', 'absent', NULL, '2026-02-21 00:00:00', '2026-02-21 00:00:00'),
(20, 'match', 'match_3', 5, 29, '2026-02-22', 'present', NULL, '2026-02-22 00:00:00', '2026-02-22 00:00:00');

-- ============================================================================
-- INSERT MATCH SQUADS
-- ============================================================================
INSERT INTO `sport_match_squads` (id, match_id, team_id, selected_by_user_id, status, submitted_at, approved_at, created_at, updated_at) VALUES
(1, 1, 1, 'coach001', 'approved', '2026-02-20 10:00:00', '2026-02-20 11:00:00', '2026-02-20 00:00:00', '2026-02-20 11:00:00'),
(2, 1, 2, 'coach002', 'approved', '2026-02-20 10:00:00', '2026-02-20 11:00:00', '2026-02-20 00:00:00', '2026-02-20 11:00:00'),
(3, 2, 3, 'coach003', 'approved', '2026-02-21 10:00:00', '2026-02-21 11:00:00', '2026-02-21 00:00:00', '2026-02-21 11:00:00'),
(4, 2, 4, 'coach004', 'approved', '2026-02-21 10:00:00', '2026-02-21 11:00:00', '2026-02-21 00:00:00', '2026-02-21 11:00:00');

-- ============================================================================
-- INSERT COACH TEAM ASSIGNMENTS
-- ============================================================================
INSERT INTO `coach_team_assignments` (id, coach_user_id, team_id, status, assigned_at, created_at, updated_at) VALUES
(1, 'coach001', 1, 'active', '2026-01-15 00:00:00', '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(2, 'coach002', 2, 'active', '2026-01-15 00:00:00', '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(3, 'coach003', 3, 'active', '2026-01-15 00:00:00', '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(4, 'coach004', 4, 'active', '2026-01-15 00:00:00', '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(5, 'coach005', 5, 'active', '2026-01-15 00:00:00', '2026-01-15 00:00:00', '2026-01-15 00:00:00'),
(6, 'coach006', 6, 'active', '2026-01-15 00:00:00', '2026-01-15 00:00:00', '2026-01-15 00:00:00');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
