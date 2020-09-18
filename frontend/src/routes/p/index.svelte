<style>
label {
	@apply block pb-5 font-bold text-sm;
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

form > div {
	@apply flex justify-between;
}

@screen smMax {
	form > div {
		@apply block;
	}
}

@screen sm {
	.gaps > label:not(:last-child) {
		@apply mr-2;
	}
}
</style>

<script context="module">
export async function preload(page, session) {
	if (session.isAuthenticated !== true) {
		return this.redirect(301, '/login')
	}

	return {}
}
</script>

<script>
import { stores } from '@sapper/app'

import Button from '@/Button.svelte'

const { session } = stores()

$: userInfo = $session.user ? $session.user.info : {}

let draft

$: if (draft === undefined && userInfo !== undefined) {
	draft = { ...userInfo }
}

function handleSubmit() {}
</script>

<svelte:head>
	<title>My profile</title>
</svelte:head>

<form
	class="mx-auto flex flex-col"
	style="max-width: 500px"
	method="post"
	action="/p"
	on:submit={handleSubmit}
>
	<div>
		<label>
			Username <input bind:value={draft.nickname} name="username" required />
		</label>
		<label>
			Email <input bind:value={draft.email} type="email" name="email" required />
		</label>
	</div>
	<label>
		Fullname <input bind:value={draft.name} name="fullname" required />
	</label>
	<div class="gaps">
		<label>
			Country <input bind:value={draft.country} name="country" />
		</label>
		<label> City <input bind:value={draft.city} name="city" /> </label>
		<label>
			School <input bind:value={draft.school} name="school" />
		</label>
	</div>
	<label>
		Birthday <input bind:value={draft.birthday} type="date" name="birthday" />
	</label>
	<label> Bio <textarea bind:value={draft.bio} name="bio" /> </label>

	<Button value="Submit" formSubmit />
</form>
