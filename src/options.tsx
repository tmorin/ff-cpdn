import Snabbdom from 'snabbdom-pragma';
import run, {Sinks, Sources} from '@cycle/run';
import {form, input, MainDOMSource, makeDOMDriver} from '@cycle/dom';
import xs, {Stream} from 'xstream';
import {VNode} from 'snabbdom/vnode';
import {adapt} from '@cycle/run/lib/adapt';
import {getOptions, Options, setOptions} from './storage';
import {formToObject} from '@tmorin/udom';

export class OptionsDriverSource {
    constructor(
        public readonly options$: Stream<Options>
    ) {
    }
}

export function makeOptionsDriver() {
    const changedOptions$: Stream<Options> = xs.create({
        async start(listener) {
            this.listener = async () => listener.next(await getOptions());
            browser.storage.onChanged.addListener(this.listener);
            try {
                listener.next(await getOptions());
            } catch (e) {
                console.warn('unable to get options', e)
            }
        },
        stop() {
            browser.storage.onChanged.removeListener(this.listener);
        }
    });
    return function OptionsDriver(newOptions$: Stream<Options>) {
        newOptions$.addListener({
            async next(options) {
                try {
                    await setOptions(options);
                } catch (e) {
                    console.warn('unable to store the options', e);
                }
            }
        });
        return new OptionsDriverSource(adapt(changedOptions$));
    }
}

function OptionsForm(options: Options) {
    return <form name="options">
        <fieldset name="scopes">
            <legend>Cleaning scope</legend>
            {Object.keys(options.scopes).map(name => FeatureCheckbox(name, options.scopes[name]))}
        </fieldset>
    </form>
}

function FeatureCheckbox(
    name: string,
    status: boolean
) {
    return <p>
        <label>
            <input type="checkbox" name={`scopes.${name}`} checked={status}/>
            clean <strong>{name}</strong>
        </label>
    </p>
}

export interface MainSources extends Sources<any> {
    options: OptionsDriverSource,
    DOM: MainDOMSource
}

export interface MainSinks extends Sinks<any> {
    options: Stream<Options>,
    DOM: Stream<VNode>
}

function main(sources: MainSources): MainSinks {

    const vDom$ = sources.options.options$.map(options => OptionsForm(options));
    const form$ = sources.DOM.select('form[name="options"]').element();

    const $scopesChanged = sources.DOM.select('fieldset[name=scopes]').events('change');

    const options$: Stream<Options> = xs.merge($scopesChanged)
        .mapTo(form$)
        .flatten()
        .map((form: HTMLFormElement) => formToObject(form) as Options)

    return {
        options: options$,
        DOM: vDom$
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    const drivers = {
        DOM: makeDOMDriver(document.body),
        options: makeOptionsDriver()
    };
    run(main, drivers);
});

