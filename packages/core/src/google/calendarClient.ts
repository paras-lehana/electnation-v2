/**
 * Google Calendar helper utilities.
 * OAuth write support is represented by typed event payloads while the demo
 * path emits standards-compliant ICS files that open directly in Google Calendar.
 */

import type { ElectionEvent } from '../types/index.js';

export interface CalendarEventLink {
  id: string;
  title: string;
  googleCalendarUrl: string;
}

const formatDate = (value: string): string =>
  new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

const escapeIcs = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export const createGoogleCalendarTemplateUrl = (event: ElectionEvent): string => {
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.title.en);
  url.searchParams.set('details', event.description?.en ?? 'Election Yatra reminder');
  url.searchParams.set('dates', `${formatDate(event.startsAt)}/${formatDate(event.endsAt ?? event.startsAt)}`);
  if (event.eciSourceUrl) url.searchParams.set('sprop', event.eciSourceUrl);
  return url.toString();
};

export const createCalendarLinks = (events: ElectionEvent[]): CalendarEventLink[] =>
  events.map((event) => ({
    id: event.id,
    title: event.title.en,
    googleCalendarUrl: createGoogleCalendarTemplateUrl(event),
  }));

export const buildIcsCalendar = (events: ElectionEvent[], now = new Date()): string => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Election Yatra//Civic Reminder Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcs(event.id)}@election-yatra`,
      `DTSTAMP:${formatDate(now.toISOString())}`,
      `DTSTART:${formatDate(event.startsAt)}`,
      `DTEND:${formatDate(event.endsAt ?? event.startsAt)}`,
      `SUMMARY:${escapeIcs(event.title.en)}`,
      `DESCRIPTION:${escapeIcs(event.description?.en ?? 'Election Yatra reminder')}`,
    );
    if (event.eciSourceUrl) lines.push(`URL:${escapeIcs(event.eciSourceUrl)}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
};
