async function loadHealth() {
  const card = document.getElementById("health-card");
  try {
    const res = await fetch("/health");
    const data = await res.json();
    const uptime = Math.floor(data.uptime);
    card.innerHTML = `<span class="status ok"></span> Status: ${data.status} &mdash; Uptime: ${uptime}s`;
  } catch {
    card.innerHTML = `<span class="status error"></span> Unable to reach server`;
  }
}

async function loadUsers() {
  const list = document.getElementById("user-list");
  try {
    const res = await fetch("/users");
    const users = await res.json();
    list.innerHTML = users
      .map(
        (u) => `<li><span>${u.name}</span><span class="user-id">#${u.id}</span></li>`
      )
      .join("");
  } catch {
    list.innerHTML = "<li>Failed to load users</li>";
  }
}

loadHealth();
loadUsers();
