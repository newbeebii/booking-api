const pool = require("../config/db");

exports.getAllFields = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fields");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getFieldById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM fields WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada data dengan ID tersebut" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.createField = async (req, res) => {
  try {
    const { name, type, price_per_hour, description } = req.body;

    //validasi
    if (!name || !type || !price_per_hour || !description) {
      return res.status(400).json({
        message: "Nama, tipe, harga per jam dan deskripsi tidak boleh kosong",
      });
    }
    const [result] = await pool.query(
      "INSERT INTO fields (name, type, price_per_hour, description) VALUES (?, ?, ?, ?)",
      [name, type, price_per_hour, description],
    );
    res.status(201).json({
      success: true,
      message: "Field berhasil ditambahkan",
      fieldId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price_per_hour, description } = req.body;

    const [existingField] = await pool.query(
      "SELECT * FROM fields WHERE id = ?",
      [id],
    );
    if (existingField.length === 0) {
      return res.status(404).json({ message: "Field tidak ditemukan" });
    }

    const updateData = {
      name: name ?? existingField[0].name,
      type: type ?? existingField[0].type,
      price_per_hour: price_per_hour ?? existingField[0].price_per_hour,
      description: description ?? existingField[0].description,
    };

    const [result] = await pool.query(
      "UPDATE fields SET name = ?, type = ?, price_per_hour = ?, description = ? WHERE id = ?",
      [
        updateData.name,
        updateData.type,
        updateData.price_per_hour,
        updateData.description,
        id,
      ],
    );

    // console.log("Hasil query:", result);
    // console.log("Data yang diperbarui:", updateData);

    res.json({ success: true, message: "Field berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM fields WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Field tidak ditemukan" });
    }
    res.json({ success: true, message: "Field berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
