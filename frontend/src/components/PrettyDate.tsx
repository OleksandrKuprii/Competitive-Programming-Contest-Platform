import * as React from 'react';

const PrettyDate = ({ timestamp }: { timestamp?: Date }) => {
  if (!timestamp) {
    return <></>;
  }

  const now = new Date();

  const delta = +now - +timestamp;

  const deltaMinutes = Math.round(delta / 1000 / 60);

  if (deltaMinutes < 1) {
    return <>Recently</>;
  }

  if (deltaMinutes < 60) {
    return (
      <>
        {deltaMinutes}
        {' '}
        minutes ago
      </>
    );
  }

  const deltaHours = Math.round(deltaMinutes / 60);

  if (deltaHours < 24) {
    return (
      <>
        {deltaHours}
        {' '}
        hours ago
      </>
    );
  }

  const deltaDays = Math.round(deltaHours / 24);

  if (deltaDays < 365) {
    return (
      <>
        {deltaDays}
        {' '}
        days ago
      </>
    );
  }

  const currentDate = new Date(timestamp);

  const day = currentDate.getDay();
  const month = currentDate.getMonth();

  let dayString = day.toString();

  if (dayString.length === 1) {
    dayString = `0${dayString}`;
  }

  let monthString = month.toString();

  if (monthString.length === 1) {
    monthString = `0${monthString}`;
  }

  return (
    <span>
      {dayString}
      .
      {monthString}
      .
      {currentDate.getFullYear()}
    </span>
  );
};

export default PrettyDate;
