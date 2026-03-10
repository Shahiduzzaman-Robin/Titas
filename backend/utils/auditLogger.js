const AuditLog = require('../models/AuditLog');

const getIpAddress = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || '';
};

const logAdminAction = async (req, payload) => {
    try {
        const adminId = req?.admin?._id || payload.admin || null;
        const adminUsername = req?.admin?.username || payload.adminUsername || 'Admin';

        if (!adminId && !adminUsername) return null;

        return await AuditLog.create({
            admin: adminId,
            adminUsername,
            module: payload.module,
            action: payload.action,
            targetType: payload.targetType,
            targetId: payload.targetId ? String(payload.targetId) : '',
            targetLabel: payload.targetLabel || '',
            description: payload.description,
            details: payload.details || {},
            ipAddress: getIpAddress(req || { headers: {}, socket: {} }),
            userAgent: req?.headers?.['user-agent'] || '',
        });
    } catch (error) {
        console.error('Audit log write failed:', error.message);
        return null;
    }
};

module.exports = { logAdminAction };