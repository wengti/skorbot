import StatsHome from "@/components/stats-home/stats-home"

export default async function StatsPage({ params }: { params: Promise<{ playerId: string }> }) {

    const { playerId } = await params

    return (
        <StatsHome playerId={playerId} />
    )
}
