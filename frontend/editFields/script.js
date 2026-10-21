const API_URL = "http://localhost:3000/api/fields";
const urlParams = new URLSearchParams(window.location.search);
const fieldId = urlParams.get("id");

async function loadFieldData() {
  try {
    const response = await fetch(`${API_URL}/${fieldId}`);
    const result = await response.json();
    console.log(result);
    const field = result.data;
    document.getElementById("name").value = field.name;
    document.getElementById("type").value = field.type;
    document.getElementById("price_per_hour").value = field.price_per_hour;
    document.getElementById("description").value = field.description;
  } catch (error) {
    console.error("Gagal memuat data lapangan:", error);
  }
}
loadFieldData();

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const updatedField = Object.fromEntries(formData);

  try {
    const response = await fetch(`${API_URL}/${fieldId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedField),
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      window.location.href = "../index.html"; // balik ke halaman utama
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Gagal mengupdate lapangan:", error);
  }
});
