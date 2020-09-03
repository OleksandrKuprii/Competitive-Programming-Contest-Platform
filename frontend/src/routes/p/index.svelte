<script context="module">
	export async function preload(page, session) {
		if (session.isAuthenticated !== true) {
			return this.redirect(301, '/login')
		}

		return {}
	}
</script>

<script>
	import { onMount } from 'svelte'
	import { stores } from '@sapper/app'
	import { setCookie, getCookie } from '../../utils/cookie'

	const { session } = stores()

	$: userInfo = $session.user ? $session.user.info : {}

	let draft

	$: if (draft === undefined && userInfo !== undefined) {
		draft = { ...userInfo }
	}

	function handleSubmit() {}
</script>

<style>
	label {
		@apply block pb-5 font-bold text-sm;
	}

	.birthdaySelect label:not(:last-child) {
		@apply mr-5;
	}

	input,
	textarea {
		@apply block shadow px-5 py-2 rounded border mt-1;
	}

	input:not([type='submit']),
	textarea {
		@apply w-full;
	}

	input:invalid {
		@apply border-red-500 border-2;
	}
</style>

<svelte:head>
	<title>My profile</title>
</svelte:head>
<form class="xl:w-3/5 lg:w-3/4 mx-auto" method="post" action="/p" on:submit="{handleSubmit}">
	<div class="lg:flex lg:justify-between lg:flex-wrap w-full">
		<label> Username <input bind:value="{draft.nickname}" name="username" required /> </label>
		<label> Email <input bind:value="{draft.email}" type="email" name="email" required /> </label>
		<label> Fullname <input bind:value="{draft.name}" name="fullname" required /> </label>
		<label> Country <input bind:value="{draft.country}" name="country" /> </label>
		<label> City <input bind:value="{draft.city}" name="city" /> </label>
		<label> School <input bind:value="{draft.school}" name="school" /> </label>
		<label> Birthday <input bind:value="{draft.birthday}" type="date" name="birthday" /> </label>
	</div>
	<label> Bio <textarea bind:value="{draft.bio}" name="bio"></textarea> </label>

	<input type="submit" value="Submit" />
</form>
