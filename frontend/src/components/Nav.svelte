<script>
    import { stores } from '@sapper/app'
    const { page } = stores()

    const { session } = stores()
</script>

<style>
    a {
        @apply block my-2 text-gray-500;
    }

    a.signout {
        @apply text-red-500;
    }

    a[aria-current] {
        @apply text-white font-bold;
    }

    @screen lg {
        a {
            @apply my-0;
        }
    }
</style>

<nav class="bg-gray-900 text-white shadow py-3 md:fixed top-0 left-0 w-full">
    <div class="container mx-auto flex flex-col md:flex-row items-center">
        <div class="text-xl font-black mr-5 flex items-center justify-center">
            <img src="/logo.png" class="h-10 mr-2" /> Toucan
        </div>

        <div class="mb-5 lg:mb-0"></div>

        <div
            class="w-full flex-col md:flex-row flex justify-around items-center
                md:max-w-xs"
        >
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
            {#if $session.user !== undefined && $session.user.registered === true}
                <p class="mr-2 text-sm">
                    Logged in as <strong>{$session.user.info.nickname}</strong>
                </p>
            {/if}

            <a href="/logout" class="signout"> Sign out </a>
        {/if}
    </div>
</nav>

<div class="md:h-16"></div>
