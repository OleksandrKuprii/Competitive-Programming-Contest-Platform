import * as React from 'react';

export type Language = string;

function iconSelector(language: Language) {
  if (language.startsWith('python')) {
    return <i className="devicon-python-plain colored" />;
  }

  if (language === 'c') {
    return <i className="devicon-c-plain-wordmark colored" />;
  }

  if (language === 'c++') {
    return <i className="devicon-cplusplus-plain-wordmark colored" />;
  }

  return false;
}

const LanguageIdentifier: React.FunctionComponent<{ language: Language; size: 'lg' | 'sm' }> = ({
  language,
  size,
}) => {
  const icon = iconSelector(language);

  const light = ['c', 'c++'].includes(language);

  let bgClass = 'rounded-circle ';

  if (size === 'lg') {
    bgClass += light ? 'bg-light' : 'bg-primary';
  }

  let iconElem;

  if (size === 'lg') {
    iconElem = (
      <div
        className={bgClass}
        style={
          size === 'lg'
            ? {
                padding: 6,
                width: 70,
                height: 70,
                overflow: 'hidden',
              }
            : {}
        }
      >
        {icon}
      </div>
    );
  } else {
    iconElem = <span>{icon}</span>;
  }

  if (icon) {
    return (
      <div className={size === 'lg' ? 'display-4 float-right' : ''}>
        {iconElem}{' '}
        {size === 'sm' ? (
          <>
            <span>{language}</span>
          </>
        ) : null}
      </div>
    );
  }

  return <></>;
};

export default LanguageIdentifier;
