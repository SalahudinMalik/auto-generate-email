/**
 * Status.js
 *
 * @description :: Generic statuses
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    PENDING: 1,
    LIVE: 2,
    SUSPENDED: 3,
    DELETED: 4,
    CONFIRMED: 5,
    DRAFT: 6,
    ARCHIVED: 7,
    SHORTLISTED: 8,
    INTERVIEWED: 9,
    CONTACTED: 10,
    SCREENED: 11,
    DECLINED: 12,
    VIEWED: 13,
    APPROVED: 14,
    REJECTED: 15,

    // For account
    ACTIVE: 16,
    INACTIVE: 17,

    // For Transactions
    PAID: 18,
    FAILED: 19,
    FREE: 35,
    CANCELLED: 36,

    // For Job
    ONHOLD: 20,
    CLOSED: 21,

    // For Email
    SENT:22,
    OUTBOX:23,
    INBOX:24,
    REPLY:25,

    // For Job Posting
    REVIEW: 26,
    BEING_POSTED: 27,
    POSTED: 28,

    //for Candidate
    CONSIDERING:29,
    OFFER_MADE:30,
    HIRED:31,
    INTERVIEW_REQUESTED:32,
    INTERVIEW_BOOKED:33,
    BEHAVIOURAL_REQUESTED: 34,

    //for templates
    VIDEO_PROFILE_REQUEST: 37,
    VIDEO_INTERVIEW_REQUEST: 38,
    AGENCY_EXTERNAL_INVITATION: 39,
    NEW: 40,
    AWAITING_FEEDBACK: 41,
    CLIENT_CONFIRMED: 42,
    IN_REVIEW: 43,

    GDPR_DELETED: 44,

    
    tableName: 'statuses',


    attributes: {
        name: {
            type: 'string'
        },
       
        'status_id': {
            'type': 'number',
            // 'required': true,
            'defaultsTo': 2
        }
    }
};

