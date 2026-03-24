import { Avatar } from "../tailgrids/core/avatar";
import StatsBadge from "./stats-badge";
import { StatsDataType } from "./stats-details";

export default async function StatsSummary({ statsData, bestTeammate, worstOpponent }: { statsData: StatsDataType[], bestTeammate: StatsDataType | undefined, worstOpponent: StatsDataType | undefined }) {

    return (
        statsData.length > 0 ?
            <div className='flex flex-wrap gap-2 mx-auto'>

                <StatsBadge
                    title='Overall Win Percentage'
                    subtitle={`${statsData[0].wins} W / ${statsData[0].losses} L`}
                >
                    <p>{statsData[0].win_rate}%</p>
                </StatsBadge>

                <StatsBadge
                    title='Overall Score Difference'
                    subtitle={`${((statsData[0].score_diff) / (statsData[0].wins + statsData[0].losses)).toFixed(2)} per match`}
                >
                    <p>{statsData[0].score_diff > 0 ? `+${statsData[0].score_diff}` : `${statsData[0].score_diff}`}</p>
                </StatsBadge>

                {
                    bestTeammate &&
                    <StatsBadge
                        title='Best Teammate'
                        subtitle={`Win rate of ${bestTeammate.win_rate} %`}
                    >
                        <Avatar
                            src={bestTeammate.user.picture}
                            fallback={bestTeammate.user.name[0]}
                            size="md"
                            label={{ title: bestTeammate.user.name }}
                        />
                    </StatsBadge>
                }



                {
                    worstOpponent &&
                    <StatsBadge
                        title='Toughest Opponent'
                        subtitle={`Loss rate of ${100 - worstOpponent.win_rate} %`}
                    >
                        <div>
                            <Avatar
                                src={worstOpponent.user.picture}
                                fallback={worstOpponent.user.name[0]}
                                size="md"
                                label={{ title: worstOpponent.user.name }}
                            />
                        </div>
                    </StatsBadge>
                }




            </div> :
            <div className='text-center text-slate-500 dark:text-gray-500 text-sm'>
                No results
            </div>
    )
}