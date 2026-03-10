const nodemailer = require('nodemailer');
const Student = require('../models/Student');
const NotificationSettings = require('../models/NotificationSettings');
const fs = require('fs');
const path = require('path');

const APP_NAME = 'TitasDU';
const ORG_FULL_NAME = 'তিতাস-ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদ';
const DEFAULT_LOGO_PATH = path.join(__dirname, '..', '..', 'frontend', 'public', 'logo-email.png');
const EMAIL_FONT_STACK = "'Li Ador Noirrit','LiAdorNoirrit','Hind Siliguri','Noto Sans Bengali','SolaimanLipi','Kalpurush',Arial,sans-serif";
const SETTINGS_DOCUMENT_KEY = 'default';
const DEFAULT_NOTIFICATION_SETTINGS = {
    registrationStatus: true,
    profileEdit: true,
    noticePublished: true,
    eventReminders: true,
    passwordReset: true,
    loginAlerts: true,
};

const isBulkNoticeEmailAllowed = () => {
    return String(process.env.ALLOW_BULK_NOTICE_EMAIL || 'false').toLowerCase() === 'true';
};

const isEmailConfigured = () => {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const normalizeNotificationSettings = (settings = {}) => ({
    registrationStatus: settings.registrationStatus !== undefined ? Boolean(settings.registrationStatus) : DEFAULT_NOTIFICATION_SETTINGS.registrationStatus,
    profileEdit: settings.profileEdit !== undefined ? Boolean(settings.profileEdit) : DEFAULT_NOTIFICATION_SETTINGS.profileEdit,
    noticePublished: settings.noticePublished !== undefined ? Boolean(settings.noticePublished) : DEFAULT_NOTIFICATION_SETTINGS.noticePublished,
    eventReminders: settings.eventReminders !== undefined ? Boolean(settings.eventReminders) : DEFAULT_NOTIFICATION_SETTINGS.eventReminders,
    passwordReset: settings.passwordReset !== undefined ? Boolean(settings.passwordReset) : DEFAULT_NOTIFICATION_SETTINGS.passwordReset,
    loginAlerts: settings.loginAlerts !== undefined ? Boolean(settings.loginAlerts) : DEFAULT_NOTIFICATION_SETTINGS.loginAlerts,
});

const getNotificationSettingsSnapshot = async () => {
    try {
        const record = await NotificationSettings.findOne({ key: SETTINGS_DOCUMENT_KEY }).lean();
        return {
            settings: normalizeNotificationSettings(record?.settings || {}),
            updatedBy: record?.updatedBy || '',
            updatedAt: record?.updatedAt || null,
        };
    } catch (error) {
        console.error('Failed to load notification settings:', error.message);
        return {
            settings: { ...DEFAULT_NOTIFICATION_SETTINGS },
            updatedBy: '',
            updatedAt: null,
        };
    }
};

const getNotificationSettings = async () => {
    const snapshot = await getNotificationSettingsSnapshot();
    return snapshot.settings;
};

const saveNotificationSettings = async (settings = {}, updatedBy = '') => {
    const normalized = normalizeNotificationSettings(settings);
    const record = await NotificationSettings.findOneAndUpdate(
        { key: SETTINGS_DOCUMENT_KEY },
        {
            $set: {
                settings: normalized,
                updatedBy: updatedBy || '',
            },
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        }
    ).lean();

    return {
        settings: normalizeNotificationSettings(record?.settings || normalized),
        updatedBy: record?.updatedBy || updatedBy || '',
        updatedAt: record?.updatedAt || new Date(),
    };
};

const isNotificationEnabled = async (type) => {
    const settings = await getNotificationSettings();
    return Boolean(settings[type]);
};

const getTransporter = () => {
    if (!isEmailConfigured()) return null;

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const getStudentDisplayName = (student) => {
    return student?.nameBn || student?.nameEn || 'শিক্ষার্থী';
};

const getLogoAttachment = () => {
    const logoPath = process.env.TITAS_LOGO_PATH
        ? path.resolve(process.env.TITAS_LOGO_PATH)
        : DEFAULT_LOGO_PATH;

    if (!fs.existsSync(logoPath)) {
        return null;
    }

    return {
        filename: 'titas-logo.png',
        path: logoPath,
        cid: 'titas-logo@titasdu',
    };
};

const getLogoSrc = () => {
    if (process.env.EMAIL_LOGO_URL) {
        return String(process.env.EMAIL_LOGO_URL).trim();
    }

    const frontendOrigin = String(process.env.FRONTEND_URL || '').trim().replace(/\/$/, '');
    if (frontendOrigin) {
        return `${frontendOrigin}/logo-email.png`;
    }

    // Fallback only when URL env is not provided; some clients may not render local file URLs.
    if (fs.existsSync(DEFAULT_LOGO_PATH)) {
        return `cid:titas-logo@titasdu`;
    }

    return '';
};

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderEmailLayout = ({ title, intro = '', contentHtml = '', badge = 'TITASDU NOTICE', footerNote = '' }) => {
    const safeTitle = escapeHtml(title);
    const safeIntro = escapeHtml(intro);
    const safeBadge = escapeHtml(badge);
    const safeFooter = escapeHtml(footerNote || 'এই ইমেইলটি একটি স্বয়ংক্রিয় বার্তা। প্রয়োজন হলে TitasDU সাপোর্টে যোগাযোগ করুন।');

        return `
<!doctype html>
<html lang="bn">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <style>
        :root { color-scheme: light only !important; supported-color-schemes: light only !important; }
        body, .email-bg { background: #eef2ff !important; color: #0f172a !important; font-family: ${EMAIL_FONT_STACK} !important; }
        .email-card { background: #ffffff !important; border: 1px solid #e2e8f0 !important; }
        .email-header {
            background: #1d4ed8 !important;
            background-image: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%) !important;
            color: #ffffff !important;
        }
        .email-header * { color: #ffffff !important; }
        .email-title { color: #0f172a !important; }
        .email-intro { color: #334155 !important; }
        .email-content { background: #f8fafc !important; color: #0f172a !important; border: 1px solid #e2e8f0 !important; }
        .email-footer { background: #f8fafc !important; color: #64748b !important; border-top: 1px solid #e2e8f0 !important; }
        @media (prefers-color-scheme: dark) {
            body, .email-bg { background: #eef2ff !important; color: #0f172a !important; font-family: ${EMAIL_FONT_STACK} !important; }
            .email-card { background: #ffffff !important; }
            .email-title { color: #0f172a !important; }
            .email-intro { color: #334155 !important; }
            .email-content { background: #f8fafc !important; color: #0f172a !important; }
            .email-footer { background: #f8fafc !important; color: #64748b !important; }
            .email-header, .email-header * { color: #ffffff !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;font-family:${EMAIL_FONT_STACK};">
    <div class="email-bg" style="margin:0;padding:24px;font-family:${EMAIL_FONT_STACK};color:#0f172a;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-card" style="max-width:700px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 18px 40px rgba(15,23,42,0.08);">
            <tr>
                <td class="email-header" style="padding:24px 28px;background:#1d4ed8;background-image:linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%);color:#ffffff;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="vertical-align:middle;width:74px;">
                                ${getLogoSrc() ? `<img src="${escapeHtml(getLogoSrc())}" alt="Titas Logo" width="58" height="58" style="display:block;border-radius:14px;background:#ffffff;padding:6px;" />` : ''}
                            </td>
                            <td style="vertical-align:middle;">
                                <div style="font-size:11px;letter-spacing:1.1px;font-weight:700;text-transform:uppercase;opacity:0.88;color:#ffffff !important;">${safeBadge}</div>
                                <div style="font-size:19px;line-height:1.35;font-weight:700;margin-top:4px;color:#ffffff !important;">${ORG_FULL_NAME}</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:30px 28px 22px;">
                    <h1 class="email-title" style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0f172a;">${safeTitle}</h1>
                    ${safeIntro ? `<p class="email-intro" style="margin:0 0 18px;color:#334155;font-size:15px;line-height:1.75;">${safeIntro}</p>` : ''}
                    <div class="email-content" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;color:#0f172a;font-size:15px;line-height:1.75;">
                        ${contentHtml}
                    </div>
                </td>
            </tr>
            <tr>
                <td class="email-footer" style="padding:14px 28px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;">
                    <p style="margin:0;color:#64748b;font-size:12px;line-height:1.7;">${safeFooter}</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
        `;
};

const sendEmail = async ({ to, subject, text, html }) => {
    if (!to) return { sent: false, reason: 'missing-recipient' };

    const transporter = getTransporter();
    if (!transporter) {
        return { sent: false, reason: 'smtp-not-configured' };
    }

    try {
        const logoAttachment = getLogoAttachment();
        await transporter.sendMail({
            from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
            attachments: (getLogoSrc() === 'cid:titas-logo@titasdu' && logoAttachment) ? [logoAttachment] : [],
        });
        return { sent: true };
    } catch (error) {
        console.error('Email send failed:', error.message);
        return { sent: false, reason: 'send-failed' };
    }
};

const getApprovedStudentRecipients = async () => {
    const students = await Student.find({
        status: 'Approved',
        email: { $exists: true, $ne: '' },
    }).select('email nameBn nameEn');

    return students;
};

const buildRegistrationStatusEmail = (student, status) => {
    const isApproved = status === 'Approved';
    const studentName = getStudentDisplayName(student);
    const subject = isApproved
        ? 'সদস্যপদ অনুমোদিত হয়েছে - TitasDU'
        : 'সদস্যপদ আবেদন আপডেট - TitasDU';

    const text = isApproved
        ? `প্রিয় ${studentName}, আপনার নিবন্ধন অনুমোদিত হয়েছে। এখন আপনি লগইন করে সকল ফিচার ব্যবহার করতে পারবেন।`
        : `প্রিয় ${studentName}, আপনার নিবন্ধন আবেদনটি অনুমোদিত হয়নি। প্রয়োজনে সঠিক তথ্য দিয়ে আবার যোগাযোগ করুন।`;

    const html = renderEmailLayout({
        title: isApproved ? 'নিবন্ধন অনুমোদিত হয়েছে' : 'নিবন্ধন স্ট্যাটাস আপডেট',
        intro: `প্রিয় ${studentName},`,
        badge: 'REGISTRATION UPDATE',
        contentHtml: `<p style="margin:0;">${escapeHtml(text)}</p>`,
    });

    return { subject, text, html };
};

const buildProfileEditDecisionEmail = (student, decision) => {
    const isApproved = decision === 'Approved';
    const studentName = getStudentDisplayName(student);
    const subject = isApproved
        ? 'প্রোফাইল এডিট অনুমোদিত হয়েছে - TitasDU'
        : 'প্রোফাইল এডিট অনুরোধ আপডেট - TitasDU';

    const text = isApproved
        ? `প্রিয় ${studentName}, আপনার প্রোফাইল পরিবর্তনের অনুরোধ অনুমোদিত হয়েছে।`
        : `প্রিয় ${studentName}, আপনার প্রোফাইল পরিবর্তনের অনুরোধ অনুমোদিত হয়নি।`;

    const html = renderEmailLayout({
        title: isApproved ? 'প্রোফাইল আপডেট অনুমোদিত' : 'প্রোফাইল আপডেট রিভিউ সম্পন্ন',
        intro: `প্রিয় ${studentName},`,
        badge: 'PROFILE REVIEW',
        contentHtml: `<p style="margin:0;">${escapeHtml(text)}</p>`,
    });

    return { subject, text, html };
};

const buildNoticePublishedEmail = (notice) => {
    const noticeText = String(notice?.text || '').trim();
    const noticeLink = String(notice?.link || '').trim();
    const subject = 'নতুন নোটিশ প্রকাশিত হয়েছে - TitasDU';
    const text = `নতুন নোটিশ: ${noticeText}${noticeLink ? `\nবিস্তারিত: ${noticeLink}` : ''}`;

    const html = renderEmailLayout({
        title: 'নতুন নোটিশ প্রকাশিত হয়েছে',
        intro: 'আপনার জন্য নতুন নোটিশ আপডেট দেওয়া হলো:',
        badge: 'NOTICE BOARD',
        contentHtml: `
            <p style="margin:0 0 10px;font-weight:600;">${escapeHtml(noticeText || 'নোটিশ দেখুন')}</p>
            ${noticeLink ? `<a href="${escapeHtml(noticeLink)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:4px;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;font-size:14px;font-weight:600;">বিস্তারিত দেখুন</a>` : ''}
        `,
    });

    return { subject, text, html };
};

const buildEventReminderEmail = (event) => {
    const title = event?.title || 'Upcoming Event';
    const dateText = event?.date ? new Date(event.date).toLocaleString('en-GB') : 'TBA';
    const locationText = event?.location || 'TBA';
    const eventLink = String(event?.link || '').trim();
    const subject = `ইভেন্ট রিমাইন্ডার: ${title} - TitasDU`;
    const text = `রিমাইন্ডার: ${title}\nতারিখ: ${dateText}\nস্থান: ${locationText}${eventLink ? `\nবিস্তারিত: ${eventLink}` : ''}`;

    const html = renderEmailLayout({
        title: 'ইভেন্ট রিমাইন্ডার',
        intro: 'আপনার অংশগ্রহণের জন্য আসন্ন ইভেন্টের তথ্য:',
        badge: 'EVENT REMINDER',
        contentHtml: `
            <p style="margin:0 0 8px;"><strong>ইভেন্ট:</strong> ${escapeHtml(title)}</p>
            <p style="margin:0 0 8px;"><strong>তারিখ:</strong> ${escapeHtml(dateText)}</p>
            <p style="margin:0;"><strong>স্থান:</strong> ${escapeHtml(locationText)}</p>
            ${eventLink ? `<div style="margin-top:12px;"><a href="${escapeHtml(eventLink)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;font-size:14px;font-weight:600;">ইভেন্ট লিংক</a></div>` : ''}
        `,
    });

    return { subject, text, html };
};

const buildPasswordResetOtpEmail = (otp) => {
    const subject = 'Password Reset OTP - TitasDU';
    const text = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;

    const html = renderEmailLayout({
        title: 'Password Reset OTP',
        intro: 'আপনার পাসওয়ার্ড রিসেট করার এককালীন কোড নিচে দেওয়া হলো:',
        badge: 'SECURITY',
        contentHtml: `
            <div style="display:inline-block;padding:10px 16px;background:#0f172a;color:#ffffff;border-radius:10px;letter-spacing:7px;font-size:24px;font-weight:700;">${escapeHtml(otp)}</div>
            <p style="margin:12px 0 0;color:#475569;">এই OTP আগামী ১০ মিনিটের জন্য কার্যকর থাকবে।</p>
        `,
    });

    return { subject, text, html };
};

const buildPasswordResetSuccessEmail = (student) => {
    const studentName = getStudentDisplayName(student);
    const subject = 'পাসওয়ার্ড পরিবর্তন সফল - TitasDU';
    const text = `প্রিয় ${studentName}, আপনার অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।`;

    const html = renderEmailLayout({
        title: 'Password Reset Successful',
        intro: `প্রিয় ${studentName},`,
        badge: 'ACCOUNT SECURITY',
        contentHtml: `
            <p style="margin:0 0 8px;">আপনার অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।</p>
            <p style="margin:0;color:#b91c1c;">আপনি যদি এই কাজটি না করে থাকেন, দ্রুত সাপোর্টের সাথে যোগাযোগ করুন।</p>
        `,
    });

    return { subject, text, html };
};

const buildLoginAlertEmail = (student, meta = {}) => {
    const studentName = getStudentDisplayName(student);
    const time = new Date().toLocaleString('en-GB');
    const ip = meta.ipAddress || 'Unknown';
    const ua = meta.userAgent || 'Unknown device';
    const subject = 'নতুন লগইন এলার্ট - TitasDU';
    const text = `প্রিয় ${studentName}, আপনার অ্যাকাউন্টে নতুন লগইন হয়েছে। সময়: ${time}, IP: ${ip}`;

    const html = renderEmailLayout({
        title: 'Login Alert',
        intro: `প্রিয় ${studentName}, আপনার অ্যাকাউন্টে নতুন লগইন শনাক্ত হয়েছে।`,
        badge: 'ACCOUNT ALERT',
        contentHtml: `
            <p style="margin:0 0 8px;"><strong>সময়:</strong> ${escapeHtml(time)}</p>
            <p style="margin:0 0 8px;"><strong>IP:</strong> ${escapeHtml(ip)}</p>
            <p style="margin:0;"><strong>Device:</strong> ${escapeHtml(ua)}</p>
            <p style="margin:12px 0 0;color:#b91c1c;">এটি আপনি না হলে দ্রুত পাসওয়ার্ড পরিবর্তন করুন।</p>
        `,
    });

    return { subject, text, html };
};

const notifyStudentRegistrationStatus = async (student, status) => {
    if (!student?.email) return { sent: false };

    if (!(await isNotificationEnabled('registrationStatus'))) {
        return { sent: false, reason: 'notification-disabled' };
    }

    const { subject, text, html } = buildRegistrationStatusEmail(student, status);
    return sendEmail({ to: student.email, subject, text, html });
};

const notifyProfileEditDecision = async (student, decision) => {
    if (!student?.email) return { sent: false };

    if (!(await isNotificationEnabled('profileEdit'))) {
        return { sent: false, reason: 'notification-disabled' };
    }

    const { subject, text, html } = buildProfileEditDecisionEmail(student, decision);
    return sendEmail({ to: student.email, subject, text, html });
};

const notifyStudentsAboutNewNotice = async (notice, options = {}) => {
    const singleRecipientEmail = String(options?.recipientEmail || '').trim().toLowerCase();

    if (!options?.ignoreSettings && !(await isNotificationEnabled('noticePublished'))) {
        return {
            sentCount: 0,
            total: 0,
            mode: singleRecipientEmail ? 'single' : 'all',
            recipient: singleRecipientEmail || null,
            disabled: true,
            reason: 'notification-disabled',
        };
    }

    // Hard safety lock: bulk send is blocked unless explicitly enabled via env.
    if (!singleRecipientEmail && !isBulkNoticeEmailAllowed()) {
        return {
            sentCount: 0,
            total: 0,
            mode: 'all',
            recipient: null,
            blocked: true,
            reason: 'bulk-notice-email-disabled',
        };
    }

    const recipients = singleRecipientEmail
        ? [{ email: singleRecipientEmail }]
        : await getApprovedStudentRecipients();

    if (!recipients.length) {
        return {
            sentCount: 0,
            total: 0,
            mode: singleRecipientEmail ? 'single' : 'all',
            recipient: singleRecipientEmail || null,
        };
    }

    let sentCount = 0;
    for (const student of recipients) {
        const { subject, text, html } = buildNoticePublishedEmail(notice);

        const result = await sendEmail({ to: student.email, subject, text, html });
        if (result.sent) sentCount += 1;
    }

    return {
        sentCount,
        total: recipients.length,
        mode: singleRecipientEmail ? 'single' : 'all',
        recipient: singleRecipientEmail || null,
    };
};

const notifyStudentsEventReminder = async (event) => {
    if (!(await isNotificationEnabled('eventReminders'))) {
        return { sentCount: 0, total: 0, disabled: true, reason: 'notification-disabled' };
    }

    const recipients = await getApprovedStudentRecipients();
    if (!recipients.length) return { sentCount: 0, total: 0 };

    let sentCount = 0;
    for (const student of recipients) {
        const { subject, text, html } = buildEventReminderEmail(event);

        const result = await sendEmail({ to: student.email, subject, text, html });
        if (result.sent) sentCount += 1;
    }

    return { sentCount, total: recipients.length };
};

const sendPasswordResetOtpEmail = async (student, otp) => {
    if (!(await isNotificationEnabled('passwordReset'))) {
        return { sent: false, reason: 'notification-disabled' };
    }

    const { subject, text, html } = buildPasswordResetOtpEmail(otp);
    return sendEmail({ to: student?.email, subject, text, html });
};

const sendPasswordResetSuccessAlert = async (student) => {
    if (!(await isNotificationEnabled('passwordReset'))) {
        return { sent: false, reason: 'notification-disabled' };
    }

    const { subject, text, html } = buildPasswordResetSuccessEmail(student);
    return sendEmail({ to: student?.email, subject, text, html });
};

const sendStudentLoginAlert = async (student, meta = {}) => {
    if (!(await isNotificationEnabled('loginAlerts'))) {
        return { sent: false, reason: 'notification-disabled' };
    }

    const { subject, text, html } = buildLoginAlertEmail(student, meta);
    return sendEmail({ to: student?.email, subject, text, html });
};

const sendNotificationTestEmail = async (type, recipientEmail) => {
    const to = String(recipientEmail || '').trim().toLowerCase();
    if (!to) return { sent: false, reason: 'missing-recipient' };

    const sampleStudent = {
        email: to,
        nameBn: 'টেস্ট শিক্ষার্থী',
        nameEn: 'Test Student',
    };

    switch (type) {
        case 'registrationStatus': {
            const { subject, text, html } = buildRegistrationStatusEmail(sampleStudent, 'Approved');
            return sendEmail({ to, subject, text, html });
        }
        case 'profileEdit': {
            const { subject, text, html } = buildProfileEditDecisionEmail(sampleStudent, 'Approved');
            return sendEmail({ to, subject, text, html });
        }
        case 'noticePublished': {
            const { subject, text, html } = buildNoticePublishedEmail({
                text: 'এটি একটি টেস্ট নোটিশ। নতুন নোটিশ ইমেইল টেমপ্লেট যাচাই করার জন্য পাঠানো হয়েছে।',
                link: 'https://titasdu.com/notices',
            });
            return sendEmail({ to, subject, text, html });
        }
        case 'eventReminders': {
            const { subject, text, html } = buildEventReminderEmail({
                title: 'বার্ষিক পুনর্মিলনী',
                date: new Date(Date.now() + (48 * 60 * 60 * 1000)),
                location: 'ঢাকা বিশ্ববিদ্যালয় ক্যাম্পাস',
                link: 'https://titasdu.com/events',
            });
            return sendEmail({ to, subject, text, html });
        }
        case 'passwordReset': {
            const { subject, text, html } = buildPasswordResetOtpEmail('123456');
            return sendEmail({ to, subject, text, html });
        }
        case 'loginAlerts': {
            const { subject, text, html } = buildLoginAlertEmail(sampleStudent, {
                ipAddress: '203.0.113.15',
                userAgent: 'Chrome on macOS',
            });
            return sendEmail({ to, subject, text, html });
        }
        default:
            return { sent: false, reason: 'invalid-template-type' };
    }
};

module.exports = {
    DEFAULT_NOTIFICATION_SETTINGS,
    isEmailConfigured,
    isBulkNoticeEmailAllowed,
    getNotificationSettings,
    getNotificationSettingsSnapshot,
    saveNotificationSettings,
    notifyStudentRegistrationStatus,
    notifyProfileEditDecision,
    notifyStudentsAboutNewNotice,
    notifyStudentsEventReminder,
    sendNotificationTestEmail,
    sendPasswordResetOtpEmail,
    sendPasswordResetSuccessAlert,
    sendStudentLoginAlert,
};
