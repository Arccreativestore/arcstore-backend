import Agenda from 'agenda'
import { MONGO_URI } from './config';


const agenda = new Agenda({
    db: { address: MONGO_URI as string, collection: 'agendaJobs' },
    processEvery: '30 seconds', 
});

export default agenda