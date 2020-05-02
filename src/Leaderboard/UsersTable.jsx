import React from 'react';



const useSortableData = (users, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedUsers = React.useMemo(() => {
        // console.log("Sorting users with config", sortConfig);
        let sortedUsers = [...users];
        if (sortConfig !== null) {
            sortedUsers.sort((a, b) => {
                // console.log(a,b)
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            // console.log("Sorted users: ", sortedUsers);

        }
        return sortedUsers;
    }, [users, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    return {users: sortedUsers, requestSort, sortConfig};
};


export default function UsersTable(props) {
    const {users, requestSort, sortConfig} = useSortableData(props.users);
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    return (
        <table className="leaderboardTable">
            <thead>
            <tr>
                <th className="leaderboardRank">Rank</th>
                <th className="leaderboardName">Player</th>
                <th className="leaderboardSmall">
                    <span type="button"
                          onClick={() => requestSort('winLossRatio')}
                          className={getClassNamesFor('winLossRatio')}
                    >
                            Win Percentage
                    </span>
                </th>
                <th className="leaderboardSmall">
                    <span type="button"
                          onClick={() => requestSort('totalWins')}
                          className={getClassNamesFor('totalWins')}
                    >
                            Total Wins
                    </span>
                </th>
                <th className="leaderboardSmall">
                    <span type="button"
                          onClick={() => requestSort('totalGamesPlayed')}
                          className={getClassNamesFor('totalGamesPlayed')}
                    >
                            Total Games
                    </span>
                </th>
            </tr>
            </thead>
            <tbody>

            {users.map((user, index) => {
                    const {username, totalWins, totalGamesPlayed, email, winLossRatio} = user;

                    return (
                        <tr key={email}>
                            <td>{index + 1}</td>
                            <td>{username}</td>
                            <td>{winLossRatio}</td>
                            <td>{totalWins}</td>
                            <td>{totalGamesPlayed}</td>
                        </tr>
                    )
                }
            )}

            </tbody>
        </table>
    );
}