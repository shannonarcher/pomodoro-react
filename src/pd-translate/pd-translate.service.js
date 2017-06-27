import React from 'react';

import Polyglot from 'node-polyglot';

import English from './en.json';
import Spanish from './es.json';
import Japanese from './ja.json';

const LANG = {
    EN: 'en',
    ES: 'es',
    JA: 'ja'
};

let polyglots = {
    en: new Polyglot({ phrases: English }),
    es: new Polyglot({ phrases: Spanish }),
    ja: new Polyglot({ phrases: Japanese })
};

let userLanguage = (navigator.language || navigator.userLanguage).split('-')[0];
if (userLanguage !== LANG.EN && userLanguage !== LANG.ES && userLanguage !== LANG.JA) { // non supported language
    userLanguage = LANG.EN;
}
const UserLanguage = userLanguage;

const translate = (InnerComponent, lang = UserLanguage) => {
    return class TranslateComponent extends React.Component {
        translate(...params) {
            return polyglots[lang].t(...params);
        }
        render() {
            return (
                <InnerComponent {...this.props} t={this.translate} />
            );
        }
    };
};

export { translate, LANG, UserLanguage };