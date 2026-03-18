import { Combination } from 'js-combinatorics';


export default function arrangeMatchups(players: string[] = [], team_config = 'one', length = 'short', num_of_rounds = 1, inputMaxLength = Infinity, verbose = true) {

    if (players.length <= 1) {
        return {}
    }

    const maxLength = inputMaxLength === 0 ? Infinity : inputMaxLength


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

        /* Replicate the matchup if more than one round is input */
        let repetition = 0
        const fullResult = []
        while (repetition < num_of_rounds) {
            const result = filteredMatches.map((match) => {
                return {
                    player_a1: match[0],
                    player_b1: match[1]
                }
            })
            fullResult.push(result)
            repetition += 1
        }

        /* Preparing to return result */
        const flatFullResult: Record<string, string>[] = fullResult.flat()

        /* Preparing to return game profile for each player */
        const profile = getScheduleProfile(players, flatFullResult, team_config)

        /* Console log the results */
        if (verbose) {
            console.log('===Result===')
            console.log('Number of matchup: ', flatFullResult.length)
            console.log(flatFullResult)
            console.log('===Profile===')
            console.log(profile)
        }

        /* Return results */
        return { flatFullResult, profile }
    }


    /* 2 v 2 */
    else if (team_config === 'two') {

        /* Get all the possible combinations i.e. 8C4 */
        const combos = Array.from(new Combination(players, 4))

        const result = [] /* Result to store temporary result */
        const fullResult = [] /* Full Result store the pre-flat result to be returned */
        let maxLengthHitFlag = false /* Checked whether it hits the maximum length */

        /* Determining how many repetition of rounds based on given length */
        let gameRounds = 1
        if (length === 'medium') gameRounds = 2
        else if (length === 'long') gameRounds = 3



        for (let round = 0; round < gameRounds; round++) {
            const tempCombos = combos.map(combo => [...combo]) /* Get a deep copy of the combos */
            let topDown = false /* A flag that decides getting a combo from the beginning or the end of the tempCombos */
            let permutationFlag = round /* Every round it has a different starting position, so if length = long it will cover having everyone in the combination as your teammate */

            for (let idx = 0; idx < combos.length; idx++) {

                if (idx % 4 === 0) topDown = !topDown /* Every 4 combo, the flag flips */

                const target = topDown ? tempCombos.splice(0, 1)[0] : tempCombos.splice(tempCombos.length - 1, 1)[0] /* Whether taking from beginning or the end */

                /* Figuring out your teammate */
                if (permutationFlag === 0) {
                    result.push({
                        player_a1: target[0],
                        player_b1: target[1],
                        player_b2: target[2],
                        player_a2: target[3]
                    })
                }
                else if (permutationFlag === 1) {
                    result.push({
                        player_a1: target[0],
                        player_b1: target[1],
                        player_b2: target[3],
                        player_a2: target[2]
                    })
                }
                else if (permutationFlag === 2) {
                    result.push({
                        player_a1: target[0],
                        player_b1: target[2],
                        player_b2: target[3],
                        player_a2: target[1]
                    })
                }

                /* Reset permutation flag to 0 if necessary */
                permutationFlag++
                if (permutationFlag > 2) permutationFlag = 0

                /* Check whether maxLength aka max number of matches have been reached */
                if (result.length >= maxLength && !maxLengthHitFlag) {
                    maxLengthHitFlag = true
                    fullResult.push([...result]) /* Returning a deep copy is CRUCIAL */
                    break
                }
            }
        }

        /* If one full round does not reach maxLength */
        if (!maxLengthHitFlag) {
            let repetition = 0
            while (repetition < num_of_rounds && fullResult.flat().length < maxLength) {
                const numNeeded: number = (maxLength - fullResult.flat().length) > result.length ? result.length : maxLength - fullResult.flat().length /* Push just enough repetitive results until maxLength is obtained */
                fullResult.push(JSON.parse(JSON.stringify(result)).splice(0, numNeeded))
                repetition++
            }
        }

        /* Preparing to return result */
        const flatFullResult: Record<string, string>[] = fullResult.flat()

        /* Preparing to get the profile of each schedule */
        const profile = getScheduleProfile(players, flatFullResult, team_config)

        /* Log results */
        if (verbose) {
            console.log('===Original Combo===')
            console.log(combos)
            console.log('===Result===')
            console.log('Number of matchup: ', flatFullResult.length)
            console.log(flatFullResult)
            console.log('===Profile===')
            console.log(profile)
        }


        return { flatFullResult, profile }

    }

}


export type ProfileType = Record<string, {
    'schedule': string[],
    'curStreak': number,
    'longestStreak': number
    'numMatchesPlayed': number
    'teammate': Record<string, number>
    'opponent': Record<string, number>
}>


function getScheduleProfile(players: string[], flatFullResult: Record<string, string>[], team_config: 'one' | 'two') {
    /* Profiling the Schedule */

    /* Create the initial profile */
    const profile: ProfileType = {}
    for (const curPlayer of players) {
        if (team_config === 'two') {

            const initTeammate: Record<string, number> = {}
            const initOpponent: Record<string, number> = {}
            players.forEach(otherPlayer => {
                if (otherPlayer !== curPlayer) {
                    initTeammate[otherPlayer] = 0
                    initOpponent[otherPlayer] = 0
                }
            })

            profile[curPlayer] = {
                schedule: [],
                curStreak: 0,
                longestStreak: 0,
                numMatchesPlayed: 0,
                teammate: initTeammate,
                opponent: initOpponent
            }
        }
        else if (team_config === 'one') {
            const initOpponent: Record<string, number> = {}
            players.forEach(otherPlayer => {
                if (otherPlayer !== curPlayer) {
                    initOpponent[otherPlayer] = 0
                }
            })

            profile[curPlayer] = {
                schedule: [],
                curStreak: 0,
                longestStreak: 0,
                numMatchesPlayed: 0,
                teammate: {},
                opponent: initOpponent
            }
        }


    }

    /* Iterate through each combination */
    /* flatFullResult = [{player_a1: xxx, player_b1: xxx}, ....] */
    /* entry = [player_a1, player_b1, player_b2, player_a1] */
    for (const entry of flatFullResult) {

        let remaining = [...players] /* remaining - used to keep track of who is not involved in the match for setting schedule */

        /* Iterate through the key */
        for (const key of Object.keys(entry)) {

            const curPlayerId = entry[key]

            /* Handling streak and schedule */
            if (profile[curPlayerId].schedule.at(-1) === 'x' || profile[curPlayerId].schedule.length === 0) {
                profile[curPlayerId].curStreak = 1
            }
            else {
                profile[curPlayerId].curStreak += 1
            }

            if (profile[curPlayerId].curStreak > profile[curPlayerId].longestStreak) {
                profile[curPlayerId].longestStreak = profile[curPlayerId].curStreak
            }

            profile[curPlayerId].schedule.push('o')
            profile[curPlayerId].numMatchesPlayed += 1

            /* Handling teammate and opponent */
            if (team_config === 'two') {
                if (key === 'player_a1') {
                    profile[curPlayerId].teammate[entry['player_a2']] += 1
                    profile[curPlayerId].opponent[entry['player_b1']] += 1
                    profile[curPlayerId].opponent[entry['player_b2']] += 1
                }
                else if (key === 'player_a2') {
                    profile[curPlayerId].teammate[entry['player_a1']] += 1
                    profile[curPlayerId].opponent[entry['player_b1']] += 1
                    profile[curPlayerId].opponent[entry['player_b2']] += 1
                }
                else if (key === 'player_b1') {
                    profile[curPlayerId].teammate[entry['player_b2']] += 1
                    profile[curPlayerId].opponent[entry['player_a1']] += 1
                    profile[curPlayerId].opponent[entry['player_a2']] += 1
                }
                else if (key === 'player_b2') {
                    profile[curPlayerId].teammate[entry['player_b1']] += 1
                    profile[curPlayerId].opponent[entry['player_a1']] += 1
                    profile[curPlayerId].opponent[entry['player_a2']] += 1
                }
            }
            else if (team_config === 'one') {
                if (key === 'player_a1') {
                    profile[curPlayerId].opponent[entry['player_b1']] += 1
                }
                else if (key === 'player_b1') {
                    profile[curPlayerId].opponent[entry['player_a1']] += 1
                }
            }


            /* Removing already accounted player */
            remaining = remaining.filter(person => person !== curPlayerId)
        }

        /* Handling streak and schedule for remaining player */
        for (const remPlayer of remaining) {
            profile[remPlayer].schedule.push('x')
            profile[remPlayer].curStreak = 0
        }
    }

    return profile
}


// const players=['a', 'b', 'c','d','e']
// const team_config = 'two'
// const length = 'short'
// const num_of_rounds = 1
// const maxLength = 10
// const verbose = true
// arrangeMatchups(players, team_config, length, num_of_rounds, maxLength, verbose)





