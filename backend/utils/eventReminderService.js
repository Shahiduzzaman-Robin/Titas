const Event = require('../models/Event');
const { notifyStudentsEventReminder } = require('./emailNotifier');

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const sendUpcomingEventReminders = async ({ daysAhead = 1 } = {}) => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + Number(daysAhead || 1));

    const todayKey = toDateKey(now);

    const events = await Event.find({
        date: { $gte: now, $lte: end },
        $or: [
            { lastReminderSentOn: { $exists: false } },
            { lastReminderSentOn: { $ne: todayKey } },
        ],
    }).sort({ date: 1 });

    let remindedEvents = 0;
    let recipientsNotified = 0;

    for (const event of events) {
        const result = await notifyStudentsEventReminder(event);
        if (result.sentCount > 0) {
            event.lastReminderSentOn = todayKey;
            await event.save();
            remindedEvents += 1;
            recipientsNotified += result.sentCount;
        }
    }

    return {
        matchedEvents: events.length,
        remindedEvents,
        recipientsNotified,
        daysAhead: Number(daysAhead || 1),
        reminderDate: todayKey,
    };
};

module.exports = {
    sendUpcomingEventReminders,
};
