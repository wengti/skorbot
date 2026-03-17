import { Combination, Permutation } from 'js-combinatorics';

// uneven player count

export default function arrangeMatchups(team_config = 'two') {

    const players = ['a', 'b', 'c', 'd', 'e']
    const num_of_rounds = 1
    const length = 'short'



    /* 1 v 1 */
    if (team_config === 'one') {

        const evenPlayers = [...players]
        if (evenPlayers.length % 2 !== 0) {
            evenPlayers.push('temp')
        }

        /* Groups hold all the combination */
        const groups = [[...evenPlayers]]

        /* Rotate all player except the first player */
        const playersSlice = evenPlayers.slice(1)
        for (let round = 0; round < (evenPlayers.length - 2); round++) {
            const removed = playersSlice.splice((playersSlice.length - 1), 1) /* Remove the last player */
            playersSlice.splice(0, 0, removed[0]) /* Add the last player to the first player */
            groups.push([evenPlayers[0], ...playersSlice]) /* Merge back with the unrotated first player */
        }

        /* Make the firstmost and lastmost as opponent */
        /* Each round with a different starting point to space repetition */
        const matches = []
        let groupIdx = 0
        for (let group of groups) {
            const halfGroupLength = group.length / 2
            for (let i = groupIdx; i < (groupIdx + halfGroupLength); i += 1) {
                const tempGroup = [...group]
                const matchIdx = i >= halfGroupLength ? i % halfGroupLength : i
                matches.push([tempGroup[matchIdx], tempGroup[group.length - 1 - matchIdx]])
            }
            groupIdx += 1
        }

        /* Filter out placeholder - temp */
        const filteredMatches = matches.filter(match => !match.includes('temp'))

        /* Log and Return result */
        console.log('===Result===')
        console.log(filteredMatches.length)

        return filteredMatches.map((match) => {
            return {
                player_a1: match[0],
                player_b1: match[1]
            }
        })
    }
    /* 2 v 2 */
    else if (team_config === 'two') {

        const combos = Array.from(new Combination(players, 4))
        const tempCombos = combos.map(combo => [...combo])

        let topDown = false
        for(let idx = 0 ; idx < combos.length ; idx++){

            if(idx%4 === 0) topDown = !topDown

            if(topDown) console.log(tempCombos.splice(0, 1)[0])
            else console.log(tempCombos.splice(tempCombos.length-1, 1)[0])
            
            
        }


    }

}

arrangeMatchups()




function getGreedyCombo(combos: string[][]) {
    
    if (combos.length === 0) return [];

    const result = [combos[0]];
    const remaining = new Set(combos.slice(1).map((_, i) => i + 1));

    while (remaining.size > 0) {
        const last = new Set(result[result.length - 1]);

        // find the combo with fewest shared elements with the last picked
        let bestIdx:number = null!;
        let bestOverlap = Infinity;

        for (const idx of remaining) {
            const overlap = combos[idx].filter(x => last.has(x)).length;
            if (overlap < bestOverlap) {
                bestOverlap = overlap;
                bestIdx = idx;
            }
        }

        result.push(combos[bestIdx]);
        remaining.delete(bestIdx);
    }

    return result;
}
