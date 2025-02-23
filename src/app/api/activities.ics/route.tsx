import { getActivities } from "munichburners/lib/activities";
import { Activity } from "munichburners/lib/activities/schema";
import { NextResponse } from "next/server";
import { createEvents, DateTime, EventAttributes } from "ics";

function transformEvent (activity:Activity):EventAttributes {
  // get dates
  const startDate = new Date(activity.startDate);
  const endDate = new Date(activity.endDate);

  // parse dates
  const start: DateTime = activity.startDate.length > 10 ?
  [startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate(), startDate.getHours(), startDate.getMinutes()]
  : [startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate(), 0, 0] ;

  const end: DateTime = activity.endDate?.length > 10 ?
  [endDate.getFullYear(), endDate.getMonth()+1, endDate.getDate(), endDate.getHours(), endDate.getMinutes()]
  : [endDate.getFullYear(), endDate.getMonth()+1, endDate.getDate()+1, 0, 0] ;

  // return event-json
  return {
    title: activity.name,
    description: activity.shortDescription,
    location: activity.location,
    start,
    end: activity.endDate ? end : start,
    url: `https://munichburners.de/activities/${activity.documentId}`
  }
}

export async function GET() {
  // get activities
  const activities = await getActivities();

  // create ics
  const { error, value } = createEvents(activities.map(transformEvent));
  
  // ics error
  if (error) {
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }

  // return ics
  return new NextResponse(value, {
    headers: {
      'Content-Type': 'text/calendar'
    },
    status: 200
  });

}
