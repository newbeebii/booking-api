const BOOKING_API_URL = "http://localhost:3000/api/bookings";
const FIELDS_API_URL = "http://localhost:3000/api/fields";

let fieldsData = []; // simpan semua data lapangan, biar bisa diakses lagi (buat cari harga)

// 1. Load daftar lapangan, isi ke dropdown
async function loadFieldOptions() {
  try {
    const response = await fetch(FIELDS_API_URL);
    const result = await response.json();

    fieldsData = result.data;

    const select = document.getElementById("field_id");
    select.innerHTML =
      '<option value="" disabled selected>-- Pilih Lapangan --</option>';

    fieldsData.forEach((field) => {
      const option = document.createElement("option");
      option.value = field.id;
      option.textContent = `${field.name} (${field.type})`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Gagal load daftar lapangan:", error);
  }
}
loadFieldOptions();

// 2. Update ringkasan setiap kali ada perubahan input
function updateSummary() {
  const fieldId = document.getElementById("field_id").value;
  const customerName = document.getElementById("customer_name").value;
  const date = document.getElementById("booking_date").value;
  const startTime = document.getElementById("start_time").value;
  const endTime = document.getElementById("end_time").value;

  const selectedField = fieldsData.find((f) => f.id === Number(fieldId));

  // update lokasi
  document.getElementById("summaryLocation").textContent = selectedField
    ? selectedField.name
    : "Belum dipilih";

  // update jadwal
  if (date && startTime && endTime) {
    document.getElementById("summarySchedule").textContent =
      `${date}, ${startTime} - ${endTime}`;
  } else {
    document.getElementById("summarySchedule").textContent =
      "Pilih tanggal & jam";
  }

  // update customer
  document.getElementById("summaryCustomer").textContent =
    customerName || "Tamu";

  // hitung estimasi harga
  let price = 0;
  if (selectedField && startTime && endTime) {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const durationHours = (endH * 60 + endM - (startH * 60 + startM)) / 60;

    if (durationHours > 0) {
      price = durationHours * Number(selectedField.price_per_hour);
    }
  }
  document.getElementById("summaryPrice").textContent =
    `Rp ${price.toLocaleString("id-ID")}`;
}

// pasang listener ke semua input yang mempengaruhi ringkasan
["field_id", "customer_name", "booking_date", "start_time", "end_time"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("input", updateSummary);
  },
);

// 3. Handle submit form
document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const newBooking = Object.fromEntries(formData);

  try {
    const response = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      window.location.href = "../bookings/index.html";
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Gagal menambah booking:", error);
  }
});
