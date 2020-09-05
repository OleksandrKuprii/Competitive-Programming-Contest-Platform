<script>
	import { stores } from '@sapper/app'
	const { page } = stores()

	const { session } = stores()
</script>

<style>
	* {
		white-space: nowrap;
	}

	a {
		@apply block text-gray-500 py-3;
	}

	a.sign-out {
		@apply text-red-500;
	}

	a[aria-current] {
		@apply text-primary-500 font-bold;
	}

	@screen md {
		a {
			@apply h-16 flex items-center px-5 pb-0 pt-1 border-b-4 border-gray-800 m-0;
		}

		a:hover {
			@apply text-primary-600 border-primary-600;
		}

		a.sign-out {
			@apply border-red-700;
		}

		a.sign-out:hover {
			@apply text-white bg-red-700;
		}

		a[aria-current] {
			@apply border-primary-500;
		}
	}
</style>

<nav class="bg-gray-900 text-white shadow md:fixed top-0 left-0 w-full">
	<div class="container mx-auto flex flex-col md:flex-row items-center px-5">
		<div
			class="text-xl font-black mr-5 flex items-center justify-center
				cursor-default mdMax:pt-5"
		>
			<img src="/logo.png" alt="Logo" class="h-10 mr-2" /> Toucan
		</div>

		<div class="mb-5 lg:mb-0"></div>

		<div class="flex-col md:flex-row flex items-center md:pl-10">
			<a
				rel="prefetch"
				href="/"
				aria-current="{'/' === $page.path ? 'page' : undefined}"
			>
				Tasks
			</a>

			<a
				rel="prefetch"
				href="/s/all"
				aria-current="{'/s/all' === $page.path ? 'page' : undefined}"
			>
				Submissions
			</a>

			<a
				rel="prefetch"
				href="/p"
				aria-current="{'/p' === $page.path ? 'page' : undefined}"
			>
				Profile
			</a>
		</div>

		<div class="md:mr-auto"></div>

		{#if $session.isAuthenticated === false}
			<a href="/login"> Sign in </a>
		{:else if $session.isAuthenticated === true}
			<div class="flex items-center">
				{#if $session.user !== undefined && $session.user.registered === true}
					<p class="mr-2 md:mr-5 text-sm lgMax:hidden">
						Logged in as <strong>{$session.user.info.nickname}</strong>
					</p>
				{/if}

				<a href="/logout" class="sign-out">Sign out</a>
			</div>
		{/if}
	</div>
</nav>

<div class="md:h-16"></div>
