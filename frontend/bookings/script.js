const API_URL = "http://localhost:3000/api/bookings";

let allBookings = [];

// 1. Fetch Data dari Server
async function loadBookings() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    // Pastikan struktur response API sesuai (misal: result.data)
    allBookings = result.data || [];
    renderTable(allBookings);
  } catch (error) {
    console.error("Gagal load data booking:", error);
  }
}

// 2. Format Tanggal & Waktu
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "";
  return timeString.slice(0, 5); // Mengambil 5 karakter pertama: "13:00"
}

function renderTable(bookings) {
  const tbody = document.getElementById("bookingsTableBody");
  tbody.innerHTML = "";

  if (bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-8 text-center text-brand-muted text-sm">
          Data booking tidak ditemukan.
        </td>
      </tr>`;
    return;
  }

  bookings.forEach((booking) => {
    const row = `
      <tr class="table-row transition-colors">
        <td class="px-6 py-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-brand-dark flex items-center justify-center text-brand-green border border-brand-border">
              <i class="fa-solid fa-futbol"></i>
            </div>
            <div>
              <p class="text-sm font-semibold">${booking.field_name || '-'}</p>
              <p class="text-[10px] text-brand-muted">Main Field</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-5">
          <p class="text-sm font-medium">${booking.customer_name || '-'}</p>
        </td>
        <td class="px-6 py-5">
          <p class="text-sm text-brand-muted font-mono">${booking.customer_phone || '-'}</p>
        </td>
        <td class="px-6 py-5">
          <p class="text-sm text-brand-muted">${formatDate(booking.booking_date)}</p>
        </td>
        <td class="px-6 py-5">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-dark rounded text-xs font-medium border border-brand-border">
            <i class="fa-regular fa-clock text-[10px] text-brand-green"></i>
            ${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}
          </div>
        </td>
        <td class="px-6 py-5 text-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">
            ${booking.status || 'Pending'}
          </span>
        </td>
        <td class="px-6 py-5 text-right">
          <div class="flex justify-end gap-2">
            <button onclick="editBooking(${booking.id})" class="w-8 h-8 rounded-lg bg-brand-dark hover:bg-brand-border border border-brand-border text-brand-muted hover:text-white transition-colors flex items-center justify-center">
              <i class="fa-solid fa-pen-to-square text-xs"></i>
            </button>
            <button onclick="deleteBooking(${booking.id})" class="w-8 h-8 rounded-lg bg-brand-dark hover:bg-red-500/10 border border-brand-border hover:border-red-500/50 text-brand-muted hover:text-brand-red transition-colors flex items-center justify-center">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// 4. Fitur Pencarian Berdasarkan Nama Customer
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    
    // Filter array berdasarkan nama customer
    const filteredBookings = allBookings.filter((booking) =>
      booking.customer_name.toLowerCase().includes(keyword)
    );

    renderTable(filteredBookings);
  });
}

// 5. Fitur Hapus Booking
async function deleteBooking(id) {
  const confirmDelete = confirm("Yakin mau hapus booking ini?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.success) {
      alert("Booking berhasil dihapus!");
      loadBookings(); // Reload data setelah hapus
    } else {
      alert(result.message || "Gagal menghapus booking");
    }
  } catch (error) {
    console.error("Gagal hapus:", error);
  }
}

function editBooking(id) {
  // Redirect ke halaman edit booking dengan ID
  window.location.href = `../editBookings/index.html?id=${id}`;
}

// 6. Jalankan Fungsi Utama Saat Halaman Dimuat
loadBookings();