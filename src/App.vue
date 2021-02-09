<template>
    <div id="app">
        <div class="ui big secondary pointing menu">
            <a class="item" :class="{ active: currentMenuItem == index }" @click="currentMenuItem = index" v-for="(item, index) in menuItems" :key="index">
                {{ item.title }}
            </a>
            <div class="right menu">
                <div style="display: flex; align-items: center;">
                    <a class="ui large label">
                        <div class="detail">Дима</div>
                        {{ casses[0] }}
                    </a>
                    <a class="ui large label">
                        <div class="detail">Юра</div>
                        {{ casses[1] }}
                    </a>
                </div>
            </div>
        </div>
        
        <div class="layout ui segment" :class="{ loading: (dataLoaded == 0) }">
        
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column" v-if="currentMenuItem == 2">
                <div class="report" v-for="(rep, index) in reports" :key="rep.date">
                    <div class="report__title">
                        Отчёт №{{ index+1 }}
                    </div>
                    <div class="report__author">Автор: {{ userName[rep.user] }}</div>
                    <div class="report__time">Создан: {{ toReadableTime(new Date(rep.date)) }}</div>
                    <div class="report__author">Период: от {{ toReadable(toWorldDate(rep.std)) }} до {{ toReadable(toWorldDate(rep.end)) }}</div>
                    <div class="history__content">
                        {{ s2+'report.php?id='+index }}<br>
                        Перейдите по ссылке выше в браузере и нажмите Ctrl+P, чтобы начать печать
                        <!-- <a class="ui button" :href="s2+'report.php?id='+index" target="_blank">Печать</a> -->
                    </div>
                </div>
            </div>
            <div style="width: 100%; height: 100%;" v-if="currentMenuItem == 0">
                <input type="date" v-model="startDate"> -
                <input type="date" v-model="endDate">
                <button style="margin-left: 10px; margin-bottom: 15px;" @click="setSort">Сортировать по {{ sortName[sort] }}</button>
                <button style="margin-left: 10px; margin-bottom: 15px;" @click="makeReport">Создать отчёт за выбранный период</button>
                <div style="height: 100%; overflow-y: auto">
                    <table class="ui celled table center aligned">
                    <thead>
                        <tr>
                            <th class="two wide">Дата</th>
                            <th>Выручка</th>
                            <th>Затраты</th>
                            <th>Касса</th>
                            <th>[Б] Выручка</th>
                            <th>[Б] Затраты</th>
                            <th>Касса</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in dayArr" :key="item">
                            <td :style="{ textDecoration: (items[item].we == 0) ? 'none' : 'line-through', backgroundColor: (items[item].cassUsr[0] == 0) ? '#ffb4b4':'#b5deff' }">
                                <button v-show="items[item].we == 0" @click="setWeekEnd(item, 1)" class="ui small button">X</button>
                                <button v-show="items[item].we == 1" @click="setWeekEnd(item, 0)" class="ui small button"></button>
                                {{ toReadable(toWorldDate(item)) }}
                            </td>
                            <td :style="{ textDecoration: (items[item].we == 0) ? 'none' : 'line-through', backgroundColor: (items[item].cassUsr[0] == 0) ? '#ffb4b4':'#b5deff' }">
                                <p>{{ items[item].profit[0] }}</p>
                                <div class="ui input mini"><input v-model="profitInputs[item]" @keyup.enter="setProfit(item, 0)" type="text"></div>
                            </td>
                            <td :style="{ textDecoration: (items[item].we == 0) ? 'none' : 'line-through', backgroundColor: (items[item].cassUsr[0] == 0) ? '#ffb4b4':'#b5deff' }">
                                <div class="ui circular labels">
                                    <a class="ui label" v-for="(min, minIndex) in items[item].minus[0]" :key="min.reason">
                                        {{ min.amount }}({{ min.reason }})
                                        <i class="icon close" @click="destroyMinus(item, 0, minIndex)"></i>
                                    </a>
                                </div>
                                <div class="ui input mini"><input v-model="minusInputs[item]" @keyup.enter="addMinusType(item, 0)" type="text" placeholder="Например: 'З/П,10'"></div>
                            </td>
                            <td :style="{ textDecoration: (items[item].we == 0) ? 'none' : 'line-through', backgroundColor: (items[item].cassUsr[0] == 0) ? '#ffb4b4':'#b5deff' }">
                                {{ items[item].cass[0] }} {{ userName[items[item].cassUsr[0]] }}
                            </td>
                            <td :style="{ textDecoration: (items[item].we == 0) ? 'none' : 'line-through', backgroundColor: (items[item].cassUsr[1] == 0) ? '#ffb4b4':'#b5deff' }">
                                <p>{{ items[item].profit[1] }}</p>
                                <div class="ui input mini"><input v-model="profitInputs2[item]" @keyup.enter="setProfit(item, 1)" type="text"></div>                                
                            </td>
                            <td :style="{ textDecoration: (items[item].we == 0) ? 'none' : 'line-through', backgroundColor: (items[item].cassUsr[1] == 0) ? '#ffb4b4':'#b5deff' }">
                                <div class="ui circular labels">
                                    <a class="ui label" v-for="(min, minIndex) in items[item].minus[1]" :key="min.reason">
                                        {{ min.amount }}({{ min.reason }})
                                        <i class="icon close" @click="destroyMinus(item, 1, minIndex)"></i>
                                    </a>
                                </div>
                                <div class="ui input mini"><input v-model="minusInputs2[item]" @keyup.enter="addMinusType(item, 1)" type="text" placeholder="Например: 'З/П,10'"></div>                                
                            </td>
                            <td :style="{ textDecoration: (items[item].we == 0) ? 'none' : 'line-through', backgroundColor: (items[item].cassUsr[1] == 0) ? '#ffb4b4':'#b5deff' }">
                                {{ items[item].cass[1] }} {{ userName[items[item].cassUsr[1]] }}
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
// import io from 'socket.io-client';

/*
const socket = io('http://a0477854.xsph.ru/', {  
    transports: ['polling'],
    transportOptions: {
        polling: {
            extraHeaders: {
                'Set-Cookie': 'SameSite=None; Secure'
            }
        }
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
    
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5
});*/
/*
socket.on('connect', () => {
    console.log('Socket connected');
});

socket.on('reconnect_attempt', () => {
    //location.reload();
});

socket.on('reconnect', () => {
    console.log('reconnect successfully');
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});
*/
const axios = require('axios');

const $ = require('jquery');
var app = undefined;

export default {
    name: 'App',
    data() {
        return {
            // s: 'http://a0477854.xsph.ru/',
            s2: 'http://q29108tu.beget.tech/',
            menuItems: [
                {
                    title: 'Таблица'
                },
                {
                    title: 'История'
                },
                {
                    title: 'Отчёты'
                }
            ],
            history: [],
            currentMenuItem: 0,
            dataLoaded: 0,
            socketSended: 0,
            startDate: '',
            endDate: '',
            startDay: 0,
            endDay: -1,
            sort: 0,
            currentUser: 1,
            casses: [],
            minusInputs: [],
            minusInputs2: [],
            profitInputs: [],
            profitInputs2: [],
            items: [],
            reports: [],
            userName: ['Галя','Катя'],
            vehName: ['Спринтера', 'Богдана'],
            sortName: [
                'убыванию',
                'возрастанию',
            ],
            months: [
                'января',
                'февраля',
                'марта',
                'апреля',
                'мая',
                'июня',
                'июля',
                'августа',
                'сентября',
                'октября',
                'ноября',
                'декабря'
            ]
        }
    },
    computed: {
        dayArr() {
            var arr = [];
            if(this.sort == 0)
            {
                for(let i = this.startDay; i <= this.endDay; i++)
                {
                    arr.push(i);
                }
            }
            else
            {
                for(let i = this.endDay; i >= this.startDay; i--)
                {
                    arr.push(i);
                }
            }
            return arr;
        },
        histArr() {
            var arr = [];
            for(let i = this.history.length-1; i >= 0; i--)
            {
                arr.push(this.history[i]);
            }    
            return arr;
        }
    },
    watch: {
        startDate: function (val) {
            var date = Date.parse(val);
            this.startDay = this.toDayID(date);
        },
        endDate: function (val) {
            var date = Date.parse(val);
            this.endDay = this.toDayID(date);
        }
    },
    components: {
        Header
    },
    methods: {
        makeReport() {
            const items = [];
            const dayNames = [];
            for(let i = this.startDay; i <= this.endDay; i++) 
            {
                items.push(this.items[i]);
                dayNames.push(this.toReadable(this.toWorldDate(i)));
            }

            this.reports.push({
                user: this.currentUser,
                date: Date.now(),
                std: this.startDay,
                end: this.endDay,
                dayNames,
                items
            });
            this.saveReports();
        },
        /*
        historyConent(hist) {
            return this.userName[hist.u]+' '+hist.t;
        },
        saveHistory() {
            axios.post(app.s+'history', {
                histories: this.history
            })
            .then((response) => {
                
            })
            .catch((error) => {
                console.log(error);
            });
        },
        insertHistory(object) {
            this.history.push(object);
            return this.saveHistory();
        },*/
        saveReports() {
            this.dataLoaded = 0;
            axios.post(app.s2+'save_reports.php', JSON.stringify(this.reports))
            .then((response) => {
                // console.log('Save_data', response.data);
                this.dataLoaded = 1;
            })
            .catch(function (error) {
                console.log(error);
            });            
        },
        setWeekEnd(item, status) {
            this.items[item].we = status;
            this.saveItems(item);
        },
        saveItems(item) {
            this.dataLoaded = 0;
            axios.post(app.s2+'save_data/index.php', JSON.stringify(this.items))
            .then((response) => {
                // console.log('Save_data', response.data);
                this.dataLoaded = 1;
            })
            .catch(function (error) {
                console.log(error);
            });
            // socket.emit('item-change', { id: item, item: this.items[item], user: this.currentUser });
            return 1;
        },
        recalcTotalCass() {
            this.casses[this.currentUser] = 0;
            this.items.forEach((item, i) => {
                if(item.cassUsr[0] == this.currentUser)
                {
                    this.casses[this.currentUser] += item.cass[0];
                }
                if(item.cassUsr[1] == this.currentUser)
                {
                    this.casses[this.currentUser] += item.cass[1];
                }
            });
            return this.casses[this.currentUser];
        },
        recalcAnotherCass() {
            var user = -1;
            if(this.currentUser == 0) user = 1;
            else user = 0;

            this.casses[user] = 0;
            this.items.forEach((item, i) => {
                if(item.cassUsr[0] == user)
                {
                    this.casses[user] += item.cass[0];
                }
                if(item.cassUsr[1] == user)
                {
                    this.casses[user] += item.cass[1];
                }
            });
            return this.casses[user];
        },
        updateCass(item, vehicle) {
            console.log(this.items[item].minus);
            var profit = this.items[item].profit[vehicle];
            var minus = 0.0;
            for (let i = 0; i < this.items[item].minus[vehicle].length; i++) {
                if(!isNaN(this.items[item].minus[vehicle][i].amount))
                {
                    minus += this.items[item].minus[vehicle][i].amount;
                }
            }
            this.items[item].cass[vehicle] = profit-minus;
            this.saveItems(item);
            this.recalcTotalCass();
            this.recalcAnotherCass();
        },
        setProfit(item, vehicle) {
            var value = 0;
            if(vehicle == 0) value = parseFloat(parseFloat(this.profitInputs[item]).toFixed(2));
            else value = parseFloat(parseFloat(this.profitInputs2[item]).toFixed(2));
            if(!isNaN(value))
            {
                /*
                this.insertHistory({
                    u: this.currentUser,
                    d: new Date().getTime(),
                    t: 'установила выручку '+this.vehName[vehicle]+' за '+this.toReadable(this.toWorldDate(item))+' на '+value+' руб.'
                });*/
                this.$set(this.items[item].profit, vehicle, value);
                this.$set(this.items[item].cassUsr, vehicle, this.currentUser);
                this.profitInputs[item] = '';
                this.updateCass(item, vehicle);
            }
            this.saveItems(item);
        },
        /*
        onTextChanged(item, vehicle) {
            var text = this.minusInputs[item];
            for (let i = 0; i < this.items[item].minus[vehicle].length; i++) {
                if(text.indexOf(this.items[item].minus[vehicle].reason.splice(0, this.items[item].minus[vehicle].reason.length/2)) != -1)
                {
                    this.minusInputs[item] = this.items[item].minus[vehicle].reason;
                }
            }
        },  */
        destroyMinus(item, vehicle, i) {
            this.items[item].minus[vehicle].splice(i, 1);
            this.updateCass(item, vehicle);
            this.saveItems(item);
        },
        addMinusType(item, vehicle) {
            var text = '';
            if(vehicle == 0) text = this.minusInputs[item];
            else text = this.minusInputs2[item];
            var arr = text.split(',');

            if(vehicle == 0) this.minusInputs[item] = '';
            else this.minusInputs2[item] = '';

            if(text.length <= 1) return ;
            if(arr[0].length < 1) return ;
            var minusAmount = parseFloat(parseFloat(arr[1]).toFixed(2));

            if(!isNaN(minusAmount))
            {
                for (let i = 0; i < this.items[item].minus[vehicle].length; i++) {
                    if(this.items[item].minus[vehicle][i].reason == arr[0])
                    {
                        this.items[item].minus[vehicle][i].amount += minusAmount;
                        if(this.items[item].minus[vehicle][i].amount <= 0)
                        {
                            this.items[item].minus[vehicle].splice(i, 1);
                        }
                        /*
                        this.insertHistory({
                            u: this.currentUser,
                            d: new Date().getTime(),
                            t: 'добавила затрату '+this.vehName[vehicle]+' на '+this.items[item].minus[vehicle][i].reason+' в размере '+minusAmount+' руб.'
                        });*/
                        this.updateCass(item, vehicle);
                        this.saveItems(item);
                        return ;
                    }
                }

                if(minusAmount > 0)
                {
                    this.items[item].minus[vehicle].push({
                        amount: minusAmount,
                        reason: arr[0]
                    });
                    this.updateCass(item, vehicle);
                    this.saveItems(item);
                }
            }
        },
        toStringDate(date) {
            var mstr = "" + (date.getMonth()+1);
            var dstr = "" + date.getDate();
            var pad = "00"
            var month = pad.substring(0, pad.length - mstr.length) + mstr;
            var day = pad.substring(0, pad.length - dstr.length) + dstr;

            return date.getFullYear()+'-'+month+'-'+day;
        },
        setSort() {
            if(this.sort) this.sort = 0;
            else this.sort = 1;
        },
        searchReasons() {
            var arr = [];
            this.items.minus[0].forEach(item => {
                arr.push(item.reason);
            });
            this.items.minus[1].forEach(item => {
                arr.push(item.reason);
            });
            return arr;
        },
        toWorldDate(dayid) {
            let start = new Date(2020, 0, 1);
            start.setDate(start.getDate() + dayid);
            return start;
        },
        toDayID(date) {
            return Math.floor(Math.abs(date-new Date(2020, 0, 1))/(1000*60*60*24)) ;
        },
        toTimeNumber(num) {
            var str = "" + num;
            var pad = "00";
            return pad.substring(0, pad.length - str.length) + str;
        },
        toReadable(date) {
            if(date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) return 'сегодня';
            return date.getDate()+' '+this.months[date.getMonth()]+' '+date.getFullYear();
        },
        toReadableTime(date) {
            return date.getDate()+' '+this.months[date.getMonth()]+' '+date.getFullYear()+' в '+this.toTimeNumber(date.getHours())+':'+this.toTimeNumber(date.getMinutes());            
        }
    },
    beforeMount() {
        app = this;
        for(let i = 0; i <= 500; i++)
        {
            this.$set(this.items, i, {
                profit: [0, 0], // Sprinter, Bohdan
                cassUsr: [0,0],
                cass: [0,0],
                minus: [
                    [
                    ], // Sprinter
                    [
                    ] // Bohdan
                ]
            });
        }
        
        axios.post(this.s2+'load_items/index.php', {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            response.data.forEach((item, i) => {
                this.$set(this.items, i, item);
            });
            this.dataLoaded = 1;
            this.recalcTotalCass();
            this.recalcAnotherCass();
            /*
            socket.on('item-change', (msg) => {
                this.$set(this.items, msg.id, msg.item);
                this.recalcTotalCass();
                this.recalcAnotherCass();
            });*/
        })
        .catch((error) => {
            console.log(error);
        });

        axios.post(this.s2+'load_reports.php', {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            response.data.forEach((item, i) => {
                this.$set(this.reports, i, item);
            });
        })
        .catch((error) => {
            console.log(error);
        });
        /*
        axios.post(this.s+'load_history', {

        })
        .then((response) => {
            response.data.forEach((item, i) => {
                this.$set(this.history, i, item);
            });
            this.dataLoaded = 1;
        })
        .catch((error) => {
            console.log(error);
        });*/
    },
    mounted() {
        this.startDate = this.toStringDate(new Date(new Date().getTime()-(604800000/2)));
        this.endDate = this.toStringDate(new Date(new Date().getTime()+(604800000/2)));
    },
    directives: {
        search: {
            inserted: () => {

            }
        }
    }
}
</script>

<style>
html,body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.report {
    background: #fff;
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
    padding: 20px;
    border-radius: 20px;
    max-width: 50%;
    margin-bottom: 10px;
}

.report__title {
    font-size: 18px;
    font-weight: bold;
}

.report__time {
    font-size: 14px;
    color: #afafaf;
}

.report__author {
    font-size: 15px;
}

.history__content {
    font-size: 16px;
    margin-top: 5px;
}

#app {
    width: 100%;
    height: 100%;
}

.wrapper {
    margin-left: 70px;
    margin-right: 70px;
}

.layout {
    width: 100%;
    height: 85%;
}

</style>
