

export default function(timestamp: number): string {
    const delta = new Date().getTime() - timestamp * 1000;

    const delta_minutes = Math.round(delta / 1000 / 60);

    console.log(delta_minutes)

    if (delta_minutes < 60) {
        return `${delta_minutes} minutes ago`;
    }

    const delta_hours = Math.round(delta_minutes / 60);

    if (delta_hours < 24) {
        return `${delta_hours} hours ago`;
    }

    const delta_days = Math.round(delta_hours / 24);

    if (delta_days < 365) {
        return `${delta_days} days ago`
    }

    const current_date = new Date(timestamp * 1000);
    
    const day = current_date.getDay();
    const month = current_date.getMonth();

    let dayString = day.toString()

    if (dayString.length == 1) {
        dayString = '0' + dayString
    }

    let monthString = month.toString()

    if (monthString.length == 1) {
        monthString = '0' + monthString
    }

    return `${dayString}.${monthString}.${current_date.getFullYear()}`;
}