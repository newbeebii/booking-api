const API_URL = "http://localhost:3000/api/fields";

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newField = {
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    price_per_hour: document.getElementById("price_per_hour").value,
    description: document.getElementById("description").value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newField),
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      alert(result.message);
      window.location.href = "../index.html"; // balik ke halaman utama
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Gagal menambah lapangan:", error);
  }
});
