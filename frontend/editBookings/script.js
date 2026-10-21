const API_URL = "http://localhost:3000/api/bookings";

// Ambil ID dari Query Parameter URL (?id=...)
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get("id");

if (!bookingId) {
  alert("ID Booking tidak ditemukan!");
  window.location.href = "../bookings/index.html";
}

// Element Referensi Input Form
const fieldInput = document.getElementById("field_name");
const customerInput = document.getElementById("customer_name");
const phoneInput = document.getElementById("customer_phone");
const dateInput = document.getElementById("booking_date");
const startTimeInput = document.getElementById("start_time");
const endTimeInput = document.getElementById("end_time");
const statusSelect = document.getElementById("status");

// Format jam ke HH:mm (Ambil 5 karakter pertama: "14:22:00" -> "14:22")
function formatTimeInput(timeString) {
  if (!timeString) return "";
  return timeString.slice(0, 5);
}

// Live Update Ringkasan Samping
function updateSummary() {
  document.getElementById("summaryField").textContent = fieldInput.value || "-";
  document.getElementById("summaryCustomer").textContent = customerInput.value || "-";
  
  const dateVal = dateInput.value 
    ? new Date(dateInput.value).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' }) 
    : "";
  
  const startVal = startTimeInput.value || "";
  const endVal = endTimeInput.value || "";
  
  document.getElementById("summarySchedule").textContent = dateVal 
    ? `${dateVal} (${startVal} - ${endVal})` 
    : "-";
  
  document.getElementById("summaryBadge").textContent = statusSelect.value.toUpperCase();
}

// Event Listeners Live Update
[fieldInput, customerInput, dateInput, startTimeInput, endTimeInput, statusSelect].forEach(el => {
  if (el) {
    el.addEventListener("input", updateSummary);
    el.addEventListener("change", updateSummary);
  }
});

// Fetch & Load Data Lama ke Form Input
async function loadBookingData() {
  try {
    const response = await fetch(`${API_URL}/${bookingId}`);
    const result = await response.json();
    const data = result.data;
    console.log("Fetched booking data:", data);

    if (!data) throw new Error("Data tidak ditemukan");

    // Masking data ke elemen HTML
    fieldInput.value = data.field_name || "";
    customerInput.value = data.customer_name || "";
    phoneInput.value = data.customer_phone || "";
    
    // Potong string ISO Date (YYYY-MM-DD)
    dateInput.value = data.booking_date ? data.booking_date.slice(0, 10) : "";
    
    // PERBAIKAN: Potong format waktu agar match dengan input type="time" (HH:mm)
    startTimeInput.value = formatTimeInput(data.start_time);
    endTimeInput.value = formatTimeInput(data.end_time);
    
    if (data.status) {
      statusSelect.value = data.status.toLowerCase();
    }

    document.getElementById("bookingIdText").textContent = data.id;

    // Trigger update tampilan ringkasan
    updateSummary();
  } catch (error) {
    console.error("Error loading booking:", error);
    alert("Gagal memuat detail data booking.");
  }
}

// Submit Update Data
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    customer_name: customerInput.value,
    customer_phone: phoneInput.value,
    booking_date: dateInput.value,
    start_time: startTimeInput.value,
    end_time: endTimeInput.value,
    status: statusSelect.value.toLowerCase(), // Sesuaikan enum lowercase backend kamu
  };

  try {
    const response = await fetch(`${API_URL}/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success || response.ok) {
      alert("Booking berhasil diperbarui!");
      window.location.href = "../bookings/index.html";
    } else {
      alert(result.message || "Gagal memperbarui data.");
    }
  } catch (error) {
    console.error("Error updating booking:", error);
    alert("Terjadi masalah koneksi server.");
  }
});

loadBookingData();