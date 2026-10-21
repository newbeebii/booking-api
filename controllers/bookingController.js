const pool = require("../config/db");

exports.getAllBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT bookings.*, fields.name AS field_name FROM bookings JOIN fields ON bookings.field_id = fields.id",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT bookings.*, fields.name AS field_name FROM bookings JOIN fields ON bookings.field_id = fields.id WHERE bookings.id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const {
      field_id,
      customer_name,
      customer_phone,
      booking_date,
      start_time,
      end_time,
    } = req.body;

    //validasi semua field wajib di isi
    if (
      !field_id ||
      !customer_name ||
      !customer_phone ||
      !booking_date ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    //validasi logic waktu: start harus lebih awal dari end
    if (start_time > end_time) {
      return res.status(400).json({
        success: false,
        message: "Waktu mulai harus lebih awal dari waktu selesai",
      });
    }

    // cek apakah field_id yang dikirimkan beneran ada di fields
    const [field] = await pool.query("SELECT * FROM fields WHERE id = ?", [
      field_id,
    ]);
    if (field.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field dengan id " + field_id + " tidak ditemukan",
      });
    }

    //cek jadwal bentrok
    const [conflictingBookings] = await pool.query(
      "SELECT * FROM bookings WHERE field_id = ? AND booking_date = ? AND status != 'cancelled' AND start_time < ? AND end_time > ?",
      [field_id, booking_date, end_time, start_time],
    );
    if (conflictingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Jadwal bentrok dengan booking yang sudah ada",
      });
    }

    //insert data booking baru
    const [result] = await pool.query(
      "INSERT INTO bookings (field_id, customer_name, customer_phone, booking_date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
      [
        field_id,
        customer_name,
        customer_phone,
        booking_date,
        start_time,
        end_time,
      ],
    );
    res.status(201).json({
      success: true,
      message: "Booking berhasil dibuat",
      data: {
        id: result.insertId,
        field_id,
        customer_name,
        customer_phone,
        booking_date,
        start_time,
        end_time,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      field_id,
      customer_name,
      customer_phone,
      booking_date,
      start_time,
      end_time,
      status,
    } = req.body;

    const [existing] = await pool.query("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    const allowedStatuses = ["pending", "confirmed", "cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    await pool.query(
      "UPDATE bookings SET field_id = ?, customer_name = ?, customer_phone = ?, booking_date = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?",
      [
        field_id || existing[0].field_id,
        customer_name || existing[0].customer_name,
        customer_phone || existing[0].customer_phone,
        booking_date || existing[0].booking_date,
        start_time || existing[0].start_time,
        end_time || existing[0].end_time,
        status || existing[0].status,
        id,
      ],
    );
    res.json({ message: "Booking berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }
    res.json({ success: true, message: "Booking berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
