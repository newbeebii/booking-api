const API_URL = "http://localhost:3000/api/fields";

let allFields = []; // <- variabel global, nyimpen SEMUA data hasil fetch

async function loadFields() {
  try {
    const response = await fetch(`${API_URL}`);
    const result = await response.json();

    allFields = result.data; // Simpan semua data ke variabel global
    renderTable(result.data); // panggil fungsi buat render ke
  } catch (error) {
    console.error("Error fetching fields:", error);
  }
}

const badgeColors = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
];

function getBadgeColor(type) {
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % badgeColors.length;
  return badgeColors[index];
}

function renderTable(fields) {
  console.log("Rendering table with fields:", fields);
  const tbody = document.getElementById("fieldsTableBody");
  tbody.innerHTML = "";

  fields.forEach((field) => {
    const color = getBadgeColor(field.type);
    const row = `
      <tr>
        <td>${field.name}</td>
        <td><span class="badge" style="background-color: ${color}">${field.type}</span></td>
        <td>Rp. ${Number(field.price_per_hour).toLocaleString("id-ID")}</td>
        <td>${field.description ?? "-"}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteField('${field.id}')">Delete</button>
          <a href="editFields/index.html?id=${field.id}">
            <button class="btn btn-primary">Edit</button>
          </a>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

//HAPUS FIELD
async function deleteField(id) {
  const confirmDelete = confirm("Yakin mau hapus lapangan ini?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE", // coba isi sendiri method HTTP-nya
    });
    const result = await response.json();

    if (result.success) {
      alert("Lapangan berhasil dihapus!");
      loadFields();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Gagal hapus:", error);
  }
}

//fitur search
function handleSearch() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allFields.filter((field) =>
    field.name.toLowerCase().includes(keyword),
  );

  renderTable(filtered);
}

document.getElementById("searchInput").addEventListener("input", handleSearch);

loadFields();
