import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
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
        const faSync = document.body.querySelector('.fa-sync');
        if (faSync) {
            faSync.classList.add('hidden');
        }

        const faCheck = document.body.querySelector('.fa-check');
        if (faCheck) {
            faCheck.classList.remove('hidden');
        }

        const description = document.body.querySelector('.description');
        if (description) {
            description.textContent = 'Cleaned!';
        }
    }
}

triggerClean().catch(e => console.error('The cleaning failed.', e));