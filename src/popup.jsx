import '@fortawesome/fontawesome-free/js/all';
import './popup.scss';
import {cleanTabs} from './background-cleaner';

async function triggerClean() {
    try {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            active: true
        });
        await cleanTabs(tabs);
    } finally {
        document.body.querySelector('.fa-sync').classList.add('hidden');
        document.body.querySelector('.fa-check').classList.remove('hidden');
        document.body.querySelector('.description').textContent = 'Cleaned!';
    }
}

triggerClean().catch(e => console.error('The cleaning failed.', e));