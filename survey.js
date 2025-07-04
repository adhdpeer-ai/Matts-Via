
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("survey");
    const status = document.getElementById("status");
    status.textContent = "";

    data.forEach((q, i) => {
      const qDiv = document.createElement("div");
      qDiv.innerHTML = `<p>${i + 1}. ${q.text}</p>` +
        q.options.map(
          (opt, idx) =>
            `<label><input type="radio" name="${q.question_id}" value="${idx + 1}"> ${opt}</label><br>`
        ).join("");
      container.appendChild(qDiv);
    });
  })
  .catch(err => {
    document.getElementById("status").textContent = "Failed to load questions.";
    console.error(err);
  });
