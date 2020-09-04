module.exports = {
	purge: [],
	theme: {
		extend: {
			colors: {
				gray: {
					100: '#f5f5f5',
					200: '#eeeeee',
					300: '#e0e0e0',
					400: '#bdbdbd',
					500: '#9e9e9e',
					600: '#757575',
					700: '#616161',
					800: '#424242',
					900: '#212121',
				},
				primary: {
					50: '#FFF9F6',
					100: '#FFF2EE',
					200: '#FFDFD3',
					300: '#FFCCB9',
					400: '#FFA585',
					500: '#FF7F50',
					600: '#E67248',
					700: '#994C30',
					800: '#733924',
					900: '#4D2618',
				},
			},
		},
		screens: {
			xl: { min: '1279px' },
			lg: { min: '1023px' },
			md: { min: '767px' },
			sm: { min: '639px' },
			xlMax: { max: '1279px' },
			lgMax: { max: '1023px' },
			mdMax: { max: '767px' },
			smMax: { max: '639px' },
		},
	},
	variants: {},
	plugins: [],
	future: {
		removeDeprecatedGapUtilities: true,
	},
}
