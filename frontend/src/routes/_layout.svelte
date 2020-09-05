<script>
	import { stores } from '@sapper/app'
	const { session } = stores()

	import Nav from '@/Nav.svelte'

	$: showAlert =
		$session.isAuthenticated === true &&
		$session.user !== undefined &&
		$session.user.registered === false
</script>

<Nav />

<main class="container mx-auto mb-32 overflow-x-hidden px-5" id="main">
	<div class="mb-5"></div>

	{#if showAlert}
		<a
			href="/p"
			class="flex items-center w-full bg-red-700 hover:bg-red-900
				hover:shadow text-white text-lg rounded px-10 py-2"
		>
			Please continue the registration to get access to all the features
			of Toucan.
			<div
				class="ml-2 px-2 border font-bold text-base rounded w-auto
					uppercase"
			>
				Click to proceed
			</div>
		</a>
	{/if}

	<div class="mb-5"></div>

	<slot />
</main>
