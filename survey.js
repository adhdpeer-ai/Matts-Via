// survey.js

async function loadSurvey() {
  const container = document.getElementById("survey-container");
  const submitButton = document.getElementById("submit-button");
  const resultsContainer = document.getElementById("results-container");

  try {
    const response = await fetch("nd_adaptive_24traits_96questions_FINAL.json");
    const data = await response.json();

    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.trait]) grouped[item.trait] = [];
      grouped[item.trait].push(item);
    });

    for (const [trait, questions] of Object.entries(grouped)) {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      heading.textContent = trait;
      section.appendChild(heading);

      questions.forEach((q) => {
        const div = document.createElement("div");
        div.className = "question-block";
        const label = document.createElement("label");
        label.textContent = q.text;
        label.setAttribute("for", q.question_id);

        div.appendChild(label);
        q.options.forEach((opt, i) => {
          const input = document.createElement("input");
          input.type = "radio";
          input.name = q.question_id;
          input.value = i + 1;
          div.appendChild(input);
          div.appendChild(document.createTextNode(opt));
        });

        section.appendChild(div);
      });

      container.appendChild(section);
    }

    submitButton.addEventListener("click", () => {
      const scores = {};
      for (const [trait, questions] of Object.entries(grouped)) {
        let total = 0;
        let count = 0;
        questions.forEach((q) => {
          const selected = document.querySelector(
            `input[name='${q.question_id}']:checked`
          );
          if (selected) {
            total += parseInt(selected.value);
            count++;
          }
        });
        if (count > 0) scores[trait] = (total / count).toFixed(2);
      }

      resultsContainer.innerHTML = "<h2>Results:</h2>";
      for (const [trait, avg] of Object.entries(scores)) {
        resultsContainer.innerHTML += `<p><strong>${trait}:</strong> ${avg}</p>`;
      }
    });
  } catch (error) {
    container.textContent = "Failed to load questions.";
    console.error("Error loading survey:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadSurvey);
