
# Skorbot

<div align='center'>
    <img src='/public/images/skorbot_logo.png' width='60%' align='center'/>
</div>

A web application for:
- arranging matchups
- tracking score and stats 
- as well as monitoring payment for game / sports sessions among friends. 

It is powerered by **NextJS**, **Supabase**, **TailwindCSS** as well as **Tailgrids**.

Vist the implementation: https://skorbot.vercel.app/
Watch a demo video: https://youtu.be/lUbW93Q5HW0

<div align='center'>
    <img src='/demo/desktop/1.jpg' width='80%' align='center'/>
</div>
_
<div align='center'>
    <img src='/demo/desktop/2.jpg' width='80%' align='center'/>
</div>
_
<div align='center'>
    <img src='/demo/desktop/3.jpg' width='80%' align='center'/>
</div>
_
<div align='center'>
    <img src='/demo/desktop/4.jpg' width='80%' align='center'/>
</div>
_
<div align='center'>
    <img src='/demo/desktop/5.jpg' width='80%' align='center'/>
</div>

## Key takeaway from the implementation
- Additional notes from learning NextJS:
    * Notes: https://github.com/wengti/nextjs-note
    * Playgrounds: https://github.com/wengti/nextjs-playground and https://github.com/wengti/nextjs-playground-cache_components

1. `router.refresh()` 
    - started as soon as the code starts executing the scope where it is in.

2. `useEffect` and `router.push()`
    - in `useEffect`, we may do some state setting then followed up with some navigation using `router.push()`.
    - However, the navigation may happen during the rendering as a consequence followed by the state settting, which can lead to collapsed rendering.
    - Therefore, a trick to resolve this is:
        `setTimeout(()=>{router.push('/...')}, 0) `
    - 0 as the second parameter indicates to only do it after the rendering completes.

3. As long as a component does not change position in the DOM tree, its state does not get reset.
    - To make a component remount on every navigation onto it, make use of `key=pathname`

4. More clarification of `router.refresh()`
    - causes the entire page to be re-rendered
    - but the state will be retained.

5. `Debounce Timer` - useful for restricting the number of times sending requests to a database as user is giving input.
    ```js
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    async function handleScoreChange(event: ChangeEvent<HTMLInputElement>, team: string, scoreState: number, setScore: Dispatch<SetStateAction<number>>) {
        const oldScore = scoreState
        const newScore = Number(event.currentTarget.value)
        setScore(newScore) // update UI immediately

        // Cancel the previous pending update
        if (debounceTimer.current) clearTimeout(debounceTimer.current)

        // Only fire DB update after user stops typing for 500ms
        debounceTimer.current = setTimeout(async () => {
            let entry = {}
            if (team === 'teamA') entry = { score_a: newScore }
            else if (team === 'teamB') entry = { score_b: newScore }

            const supabase = createClient()
            const { error: changeScoreError } = await supabase
                .from(tableName)
                .update(entry)
                .eq('id', resultData.id)

            if (changeScoreError) {
                setScore(oldScore)
                setError(new Error(changeScoreError.message))
            } else {
                setError(null)
            }
        }, 500)
    }
    ```

6. PosgresQL - `using` vs `with check` in the policy for `UPDATE`
    - `using` - check before the database action
    - `with check` - check after the database action
    - if no `with check` is given, `using` statemtent will be run again as `with check` in `UPDATE`

7. Supabase - realtime subscription
    - You are always using OLD.id to build the topic name
    - but on `INSERT`, there is no previous record, which can lead to a topic name of `null`
