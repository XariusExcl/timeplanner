import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Login from './Login';
import Register from './Register';

import 'alpinejs';
const axios = require('axios');

class Main {
    addDateTitle: HTMLInputElement;
    addDateStart: HTMLInputElement;
    addDateEnd: HTMLElement;
    addDateSubmit: HTMLElement;

    editDateTitle: HTMLInputElement;
    editDateStart: HTMLInputElement;
    editDateEnd: HTMLElement;
    editDateSubmit: HTMLElement;
    deleteDateSubmit: HTMLElement;
    editDateID: HTMLElement;
    editDatePopup: HTMLElement;


    constructor() {
        this.addDateTitle = document.querySelector('[data-ref="addDateTitle"]');
        this.addDateStart = document.querySelector('[data-ref="addDateStart"]');
        this.addDateEnd = document.querySelector('[data-ref="addDateEnd"]');
        this.addDateSubmit = document.querySelector('[data-ref="addDateSubmit"]');

        this.editDateTitle = document.querySelector('[data-ref="editDateTitle"]');
        this.editDateStart = document.querySelector('[data-ref="editDateStart"]');
        this.editDateEnd = document.querySelector('[data-ref="editDateEnd"]');
        this.editDateID = document.querySelector('[data-ref="editDateID"]');
        this.editDateSubmit = document.querySelector('[data-ref="editDateSubmit"]');
        this.deleteDateSubmit = document.querySelector('[data-ref="deleteDateSubmit"]');
        this.editDatePopup = document.querySelector('[data-ref="editDatePopup"]');
        let _this = this;
        this.init();
    }

    public init = async function () {
        this.eventListeners();
        let days = await this.getGouvDay();
        let myEvents = await this.getEvents();
        let events = days.concat(myEvents);
        this.renderCalendar(events);
    }

    public eventListeners() {
        this.addDateSubmit.addEventListener('click', async () => {
            let title = this.addDateTitle.value;
            let start = this.addDateStart.value;
            let end = this.addDateEnd.value;
            
            let response = await axios(
                {
                    method: 'post',
                    'Content-Type': 'application/json',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token')},
                    url: 'http://localhost:8888/index.php/api/userevents',   
                    data: {
                        "title": title,
                        "description": '',
                        "startDate": start,
                        "endDate": end,
                    }
                }
            )

            location.reload();
        });

        this.editDateSubmit.addEventListener('click', async () => {
            let title = this.editDateTitle.value;
            let start = this.editDateStart.value;
            let end = this.editDateEnd.value;
            let id = this.editDateID.value;

            let response = await axios(
                {
                    method: 'put',
                    'Content-Type': 'application/json',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token')},
                    url: `http://localhost:8888/index.php/api/userevents/${id}`,   
                    data: {
                        "title": title,
                        "description": '',
                        "startDate": start,
                        "endDate": end,
                    }
                }
            )

            location.reload();
        });

        this.deleteDateSubmit.addEventListener('click', async () => {
            let id = this.editDateID.value;

            let response = await axios(
                {
                    method: 'delete',
                    'Content-Type': 'application/json',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token')},
                    url: `http://localhost:8888/index.php/api/userevents/${id}`,   
                }
            )

            location.reload();
        });
    }

    async getGouvDay() {
        let events = [];

        try {
            let response = await axios.get('https://calendrier.api.gouv.fr/jours-feries/metropole.json');

            for (let i in response.data) {
                let object = {
                    title: response.data[i],
                    start: i,
                    classNames: ['pointer-events-none'],
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

        if(localStorage.getItem('token') != null) {
            try {
                let response = await axios({
                    method: 'get',
                    'Content-Type': 'application/json',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token')},
                    url: 'http://localhost:8888/index.php/api/userevents '
                });
                let data = JSON.parse(response.data).user.events;
                for (let i = 0; i < data.length; i++) {
                    let object = {
                        title: data[i].title,
                        start: data[i].startDate,
                        end: data[i].endDate,
                        id: data[i].id,
                    }
                    events.push(object);
                }
                return events;
            }
    
            catch(err) {
                localStorage.clear();
                location.reload();
            }
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
            },
            eventClick: function(info) {
                _this.editDateTitle.value = info.event.title;
                _this.editDateStart.value = info.event.start.getFullYear() + '-' + (info.event.start.getMonth() + 1) + '-' + info.event.start.getDate() + 'T' + info.event.start.getHours() + ':' + info.event.start.getMinutes();
                _this.editDateEnd.value = info.event.end.getFullYear() + '-' + (info.event.end.getMonth() + 1) + '-' + info.event.end.getDate() + 'T' + info.event.end.getHours() + ':' + info.event.end.getMinutes();
                _this.editDateID.value = info.event.id;
                _this.editDatePopup.style.display = 'block';
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