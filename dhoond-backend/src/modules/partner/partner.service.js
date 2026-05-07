const pool = require('../../config/db');

/**
 * Partner Service
 * Handles all database operations for the partners table
 */
class PartnerService {
  /**
   * Create a new partner profile
   * @param {Object} partnerData - Data for the new partner
   * @returns {Promise<Object>} - The created partner record
   */
  async createPartner(partnerData) {
    const { firebase_uid, full_name, phone, email, service_type } = partnerData;
    
    const query = `
      INSERT INTO partners (firebase_uid, full_name, phone, email, service_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const values = [firebase_uid, full_name, phone, email, service_type];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
   * Get partner profile by Firebase UID
   * @param {string} firebaseUid - Firebase unique identifier
   * @returns {Promise<Object>} - The partner record
   */
  async getPartnerByFirebaseUid(firebaseUid) {
    const query = 'SELECT * FROM partners WHERE firebase_uid = $1';
    const { rows } = await pool.query(query, [firebaseUid]);
    return rows[0];
  }

  /**
   * Update partner profile data
   * @param {string} firebaseUid - Firebase unique identifier
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} - The updated partner record
   */
  async updatePartner(firebaseUid, updateData) {
    const { full_name, email, profile_photo, service_type } = updateData;
    
    const query = `
      UPDATE partners 
      SET full_name = COALESCE($1, full_name),
          email = COALESCE($2, email),
          profile_photo = COALESCE($3, profile_photo),
          service_type = COALESCE($4, service_type),
          updated_at = CURRENT_TIMESTAMP
      WHERE firebase_uid = $5
      RETURNING *;
    `;
    
    const values = [full_name, email, profile_photo, service_type, firebaseUid];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
   * Toggle duty status (online/offline)
   * @param {string} firebaseUid - Firebase unique identifier
   * @param {string} dutyStatus - 'online' or 'offline'
   * @returns {Promise<Object>} - The updated partner record
   */
  async updateDutyStatus(firebaseUid, dutyStatus) {
    // Start a transaction to ensure both partner status and log are updated
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Update partner status
      const updateQuery = `
        UPDATE partners 
        SET duty_status = $1, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE firebase_uid = $2 
        RETURNING *;
      `;
      const { rows } = await client.query(updateQuery, [dutyStatus, firebaseUid]);
      const partner = rows[0];

      if (partner) {
        // 2. Log the duty change
        const logQuery = `
          INSERT INTO partner_duty_logs (partner_id, event, latitude, longitude)
          VALUES ($1, $2, $3, $4);
        `;
        await client.query(logQuery, [partner.id, dutyStatus, partner.latitude, partner.longitude]);
      }

      await client.query('COMMIT');
      return partner;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update partner's last known location
   * @param {string} firebaseUid - Firebase unique identifier
   * @param {number} latitude - Current latitude
   * @param {number} longitude - Current longitude
   * @returns {Promise<Object>} - The updated partner record
   */
  async updateLocation(firebaseUid, latitude, longitude) {
    const query = `
      UPDATE partners 
      SET latitude = $1, 
          longitude = $2, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE firebase_uid = $3 
      RETURNING *;
    `;
    
    const values = [latitude, longitude, firebaseUid];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = new PartnerService();
