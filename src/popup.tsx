import './popup.scss';
import {cleanTabs} from './background-cleaner';

async function triggerClean() {
    const description = document.body.querySelector('.description');
    if (description) {
        description.textContent = 'In progress ...';
    }
    try {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            active: true
        });
        await cleanTabs(tabs);
    } finally {
        if (description) {
            description.textContent = 'Cleaned!';
        }
    }
}

triggerClean().catch(e => console.error('The cleaning failed.', e));
