import { getDatabase } from "../../lib/notion";
// import ics  from 'ics';
const ics = require('ics')

export const databaseId = process.env.NOTION_DATABASE_ID;

export function transformEvent (post) {
  // get dates
  const startDate = new Date(post.properties.Date.date.start);
  const endDate = new Date(post.properties.Date.date.end);

  // parse dates
  const start = post.properties.Date.date.start.length > 10 ?
  [startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate(), startDate.getHours(), startDate.getMinutes()]
  : [startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate()] ;

  const end = post.properties.Date.date.end?.length > 10 ?
  [endDate.getFullYear(), endDate.getMonth()+1, endDate.getDate(), endDate.getHours(), endDate.getMinutes()]
  : [endDate.getFullYear(), endDate.getMonth()+1, endDate.getDate()+1] ;

  // return event-json
  return {
    title: post.properties.Name.title[0].text.content,
    description: post.properties.Description?.rich_text.map(t => t.plain_text).join(' '),
    location: post.properties.Location?.rich_text.map(t => t.plain_text).join(' '),
    start,
    end: post.properties.Date.date.end ? end : undefined,
    url: `https://munichburners.de/activities/${post.id}`
  }
}

export default async (req, res) => {
  const database = await getDatabase(databaseId);

  // parse database
  const events = database.map(transformEvent);

  // create ics
  const { error, value } = ics.createEvents(events)
  
  // ics error
  if (error) {
    res.statusCode = 400;
    res.json(error);
    return
  }

  // return ics
  res.setHeader('Content-Type', 'text/calendar')
  res.statusCode = 200;
  res.send(value);

}
