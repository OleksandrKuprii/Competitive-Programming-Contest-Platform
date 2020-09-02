<script context="module">
    export async function preload() {
        const response = await this.fetch('/s/all.json')
        const submissions = await response.json()

        return { submissions }
    }
</script>

<script>
    import { goto } from '@sapper/app'

    import Result from '../../components/Result.svelte'

    export let submissions
</script>

<svelte:head>
    <title>Submissions</title>
</svelte:head>

<table class="table-auto w-full">
    <thead>
        <tr>
            <th>Identifier</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        {#each submissions as submission (submission.id)}
            <tr
                class="hover:bg-gray-300 cursor-pointer"
                on:click="{() => goto(`/s/${submission.id}`)}"
            >
                <td>
                    {submission.id}
                    <span
                        class="font-bold text-sm text-gray-600"
                    >[{submission.name}]</span>
                </td>
                <td>
                    <Result
                        points="{submission.result.points}"
                        status="{submission.result.status}"
                    />
                </td>
            </tr>
        {/each}
    </tbody>
</table>
