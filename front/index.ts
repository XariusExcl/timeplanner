import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Login from './Login';
import Register from './Register';

import 'alpinejs';
const axios = require('axios');

class Main {
    constructor() {
        this.init();
    }

    public init = async function () {
        let days = await this.getGouvDay();
        let myEvents = await this.getEvents();
        console.log(myEvents);
        let events = days.concat(myEvents);
        this.renderCalendar(events);
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

    async getEvents() {
        let events = [];

        try {
            let response = await axios({
                method: 'get',
                'Content-Type': 'application/json',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token')},
                url: 'http://localhost:8888/index.php/api/events '
            });
            for (let i = 0; i < response.data["hydra:member"].length; i++) {
                let object = {
                    title: response.data["hydra:member"][i].title,
                    start: response.data["hydra:member"][i].startDate,
                }
                events.push(object);
            }
            return events;
        }

        catch(err) {
            throw err;
        }
    }

    public renderCalendar = (days) => {
        let oldCase: HTMLElement;
        let calendarEl: HTMLElement = document.querySelector('[data-ref="calendar"]');
        let calendarSmallEl: HTMLElement = document.querySelector('[data-ref="calendarSmall"]');
        let calendar = new Calendar(calendarEl, {
            locale: 'fr',
            dayHeaderFormat: {
                weekday: 'long'
            },
            initialView: 'dayGridMonth',
            events: days,
            plugins: [dayGridPlugin, interactionPlugin],
            dateClick: function(info) {
                if(!oldCase) {
                    calendarSmall.gotoDate(info.dateStr);
                    info.dayEl.style.backgroundColor = '#F2F7FF';
                    oldCase = info.dayEl;
                } else {
                    oldCase.style.backgroundColor = 'white';
                    calendarSmall.gotoDate(info.dateStr);
                    info.dayEl.style.backgroundColor = '#F2F7FF';
                    oldCase = info.dayEl;
                }
              }
        });
        calendar.render();
        let calendarSmall = new Calendar(calendarSmallEl, {
            locale: 'fr',
            dayHeaderFormat: {
                weekday: 'long'
            },
            initialView: 'dayGridDay',
            events: days,
            plugins: [dayGridPlugin]
        });
        calendarSmall.render();
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
let login = new Login()
let register = new Register()