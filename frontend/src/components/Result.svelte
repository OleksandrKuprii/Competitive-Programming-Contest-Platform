<script>
	export let points
	export let status

	$: isDefined = Number.isInteger(points) && status !== undefined

	$: totalStatus = isDefined ? points + ' ' + (Array.isArray(status) ? status.join(' ') : status) : ''

	let totalStatusColor = ''

	$: if (isDefined) {
		if (points < 100 && points > 0) {
			totalStatusColor = 'text-orange-500'
		} else if (points === 100) {
			totalStatusColor = 'text-green-500'
		} else if (points === 0) {
			totalStatusColor = 'text-red-500'
		} else {
			totalStatusColor = ''
		}
	} else {
		totalStatusColor = ''
	}
</script>

<span class="{totalStatusColor}">{totalStatus}</span>
