const pool = require('../../config/db');

/**
 * OTP Service
 * Handles generation and verification of order OTPs (arrival & completion)
 */
class OtpService {
  /**
   * Generate a new 6-digit OTP for an order
   * @param {number} orderId - Internal order ID
   * @param {string} type - 'arrival' or 'completion'
   * @returns {Promise<Object>} - The generated OTP record
   */
  async generateOtp(orderId, type) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000); // Expires in 15 minutes

    const query = `
      INSERT INTO order_otps (order_id, otp_type, otp_code, expires_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (order_id, otp_type) 
      DO UPDATE SET 
        otp_code = EXCLUDED.otp_code, 
        expires_at = EXCLUDED.expires_at, 
        is_used = FALSE, 
        verified_at = NULL,
        created_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [orderId, type, otpCode, expiresAt]);
    return rows[0];
  }

  /**
   * Verify an OTP provided by the partner (given by customer)
   * @param {number} orderId - Internal order ID
   * @param {string} type - 'arrival' or 'completion'
   * @param {string} code - The 6-digit code to verify
   * @returns {Promise<boolean>} - True if valid
   */
  async verifyOtp(orderId, type, code) {
    const query = `
      SELECT * FROM order_otps 
      WHERE order_id = $1 
      AND otp_type = $2 
      AND otp_code = $3 
      AND is_used = FALSE 
      AND expires_at > CURRENT_TIMESTAMP;
    `;

    const { rows } = await pool.query(query, [orderId, type, code]);
    
    if (rows.length === 0) {
      return false;
    }

    // Mark as used
    await pool.query(
      "UPDATE order_otps SET is_used = TRUE, verified_at = CURRENT_TIMESTAMP WHERE id = $1",
      [rows[0].id]
    );

    return true;
  }
}

module.exports = new OtpService();
