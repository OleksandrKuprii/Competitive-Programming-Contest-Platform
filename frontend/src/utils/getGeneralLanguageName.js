
const generalLanguageNameData = {
    'python3': 'python',
    'python2': 'python',
    'c++': 'cpp'
};

function getGeneralLanguageName(name) {
    return generalLanguageNameData[name] || name;
}

export default getGeneralLanguageName;
