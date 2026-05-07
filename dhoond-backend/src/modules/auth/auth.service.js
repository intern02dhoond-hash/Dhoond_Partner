const db = require('../../config/db');

/**
 * Find a partner by their Firebase UID
 */
const findPartnerByUid = async (firebaseUid) => {
  const result = await db.query(
    'SELECT * FROM partners WHERE firebase_uid = $1',
    [firebaseUid]
  );
  return result.rows[0];
};

/**
 * Create a new partner record
 */
const createPartner = async (partnerData) => {
  const { uid, name, phone, email, photo, serviceType } = partnerData;
  const result = await db.query(
    `INSERT INTO partners (firebase_uid, full_name, phone, email, profile_photo, service_type)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [uid, name, phone, email, photo, serviceType]
  );
  return result.rows[0];
};

module.exports = {
  findPartnerByUid,
  createPartner
};
