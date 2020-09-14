/**
 * 描述
 * @date 2020-09-12
 * @param {number} min
 * @param {number} max
 * @param {'min' | 'max'} prefer
 * @returns {any}
 */
function minMaxValidator(min, max, prefer) {
	if (min > max) {
		switch (prefer) {
			case 'min':
				max = min
				break
			case 'max':
				min = max
				break
		}
	}
}

export default minMaxValidator
