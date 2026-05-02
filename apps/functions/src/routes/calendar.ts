import { Router } from 'express';
import { CalendarAddRequestSchema, buildIcsCalendar, createCalendarLinks } from '@yatra/core';
import type { AppConfig } from '../config.js';
import { logger } from '../middleware/logger.js';

const DEFAULT_EVENTS = [
  {
    id: 'national-voter-registration-reminder',
    kind: 'registration-deadline' as const,
    title: { en: 'Check voter registration status' },
    description: {
      en: 'Election Yatra reminder: verify your voter registration on voters.eci.gov.in and update details early.',
    },
    startsAt: '2026-05-15T09:00:00.000Z',
    endsAt: '2026-05-15T09:30:00.000Z',
    eciSourceUrl: 'https://voters.eci.gov.in',
  },
  {
    id: 'polling-day-kit-reminder',
    kind: 'poll-day' as const,
    title: { en: 'Prepare polling day kit' },
    description: {
      en: 'Carry EPIC or accepted ID, check booth number, and avoid party symbols near the polling station.',
    },
    startsAt: '2026-05-31T07:00:00.000Z',
    endsAt: '2026-05-31T07:30:00.000Z',
    eciSourceUrl: 'https://eci.gov.in',
  },
];

export const calendarRouter = (_config: AppConfig): Router => {
  const router = Router();

  router.get('/calendar/ics', (req, res) => {
    const source = req.query.source === 'default' ? DEFAULT_EVENTS : DEFAULT_EVENTS;
    logger.info('calendar.ics_requested', { count: source.length });
    res.setHeader('content-type', 'text/calendar; charset=utf-8');
    res.setHeader('content-disposition', 'attachment; filename="election-yatra-reminders.ics"');
    res.send(buildIcsCalendar(source));
  });

  router.post('/calendar/add', (req, res) => {
    const parsed = CalendarAddRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid calendar request.',
          issues: parsed.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
        },
      });
      return;
    }

    const links = createCalendarLinks(parsed.data.events);
    logger.info('calendar.links_created', { count: links.length, mode: 'template-url' });
    res.json({
      mode: 'google-calendar-template',
      oauthReady: true,
      links,
      icsUrl: '/api/calendar/ics?source=default',
    });
  });

  return router;
};
