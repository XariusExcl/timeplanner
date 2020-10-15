import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'alpinejs';
const axios = require('axios');

class Main {
    constructor() {
        this.init();
    }

    public init = async function () {
        let days = await this.getGouvDay();
        this.renderCalendar(days);
    }

    async getGouvDay() {
        let events = [];

        try {
            let response = await axios.get('https://calendrier.api.gouv.fr/jours-feries/metropole.json');

            for (let i in response.data) {
                let object = {
                    title: response.data[i],
                    start: i
                }

                events.push(object);
            }
        }

        catch (err) {
            console.warn(err);
        }

        return events;
    }

    public renderCalendar = (days) => {
        let calendarEl: HTMLElement = document.querySelector('[data-ref="calendar"]');
        let calendar = new Calendar(calendarEl, {
            locale: 'fr',
            dayHeaderFormat: {
                weekday: 'long'
            },
            initialView: window.innerWidth >= 768 ? 'dayGridMonth' : 'dayGridDay',
            events: days,
            plugins: [dayGridPlugin]
        });
        
        calendar.render();
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1000 ) {
                calendar.changeView('dayGridMonth');
                calendar.render();
            } else {
                calendar.changeView('dayGridDay')
                calendar.render();
            }
        })
    }
}

let main = new Main();