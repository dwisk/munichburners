import { getDatabase, getPage } from "../../../lib/notion";
import { transformEvent } from "../activities.ics";
// import ics  from 'ics';
const ics = require('ics')

export const databaseId = process.env.NOTION_DATABASE_ID;

export default async (req, res) => {
  const { id } = req.query

  const page = await getPage(id.split('.')[0]);

  // create ics
  const { error, value } = ics.createEvent(transformEvent(page))
  
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
